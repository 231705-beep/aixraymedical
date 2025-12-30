import { Injectable, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { PatientProfile } from './entities/patient-profile.entity';
import { DoctorProfile } from './entities/doctor-profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(PatientProfile)
        private patientProfileRepository: Repository<PatientProfile>,
        @InjectRepository(DoctorProfile)
        private doctorProfileRepository: Repository<DoctorProfile>,
    ) { }

    async onModuleInit() {
        const admin = await this.usersRepository.findOne({ where: { role: UserRole.ADMIN } });
        if (!admin) {
            console.log('Seeding default Admin...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await this.usersRepository.save({
                email: 'admin@medmail.com',
                password: hashedPassword,
                role: UserRole.ADMIN
            });
        }
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { email, password, role, ...profileData } = createUserDto;

        const normalizedEmail = email.toLowerCase();
        let user = await this.usersRepository.findOne({ where: { email: normalizedEmail } });

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Registering/Updating user with fullName:', profileData.fullName);

        if (user) {
            // Allow re-registration to reset password in dev mode
            user.fullName = profileData.fullName;
            user.password = hashedPassword;
            user.role = role;
            user = await this.usersRepository.save(user);
        } else {
            user = this.usersRepository.create({
                email: normalizedEmail,
                fullName: profileData.fullName,
                password: hashedPassword,
                role,
            });
            user = await this.usersRepository.save(user);
        }

        const savedUser = user;
        console.log('Processed User ID:', savedUser.id, 'Name:', savedUser.fullName);

        if (role === 'PATIENT') {
            let patientProfile = await this.patientProfileRepository.findOne({ where: { userId: savedUser.id } });
            if (patientProfile) {
                patientProfile.fullName = profileData.fullName || savedUser.fullName || '';
                patientProfile.age = profileData.age || patientProfile.age || 0;
                patientProfile.gender = profileData.gender || patientProfile.gender || 'Other';
                patientProfile.contact = profileData.phoneNumber || profileData.contact || patientProfile.contact || '';
                patientProfile.medicalHistory = profileData.medicalHistory || patientProfile.medicalHistory || '';
            } else {
                patientProfile = this.patientProfileRepository.create({
                    user: savedUser,
                    userId: savedUser.id,
                    fullName: profileData.fullName || savedUser.fullName || '',
                    age: profileData.age || 0,
                    gender: profileData.gender || 'Other',
                    contact: profileData.phoneNumber || profileData.contact || '',
                    medicalHistory: profileData.medicalHistory || '',
                });
            }
            await this.patientProfileRepository.save(patientProfile);
        } else if (role === 'DOCTOR') {
            let doctorProfile = await this.doctorProfileRepository.findOne({ where: { userId: savedUser.id } });

            // Robust parsing for "10+", "0-5", "5 years", etc.
            const rawExp = profileData.experience || '0';
            const expNum = parseInt(rawExp.replace(/[^0-9]/g, ''), 10) || 0;

            if (doctorProfile) {
                doctorProfile.fullName = profileData.fullName || savedUser.fullName || '';
                doctorProfile.specialization = profileData.specialization || doctorProfile.specialization || 'General Practice';
                doctorProfile.licenseNumber = profileData.licenseNumber || doctorProfile.licenseNumber || 'PENDING';
                doctorProfile.hospital = profileData.hospital || doctorProfile.hospital || 'Main Medical Center';

                // Fix: Update experience whenever it is provided in the DTO
                if (profileData.experience !== undefined) {
                    doctorProfile.experience = expNum;
                }
            } else {
                doctorProfile = this.doctorProfileRepository.create({
                    user: savedUser,
                    userId: savedUser.id,
                    fullName: profileData.fullName || savedUser.fullName || '',
                    specialization: profileData.specialization || 'General Practice',
                    licenseNumber: profileData.licenseNumber || 'PENDING',
                    hospital: profileData.hospital || 'Main Medical Center',
                    experience: expNum,
                    isApproved: false,
                });
            }
            await this.doctorProfileRepository.save(doctorProfile);
        }

        return savedUser;
    }

    async findOne(email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { email: email.toLowerCase() },
            relations: ['patientProfile', 'doctorProfile'],
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { id },
            relations: ['patientProfile', 'doctorProfile'],
        });
    }
}
