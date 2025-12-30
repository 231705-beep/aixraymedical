import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { PatientProfile } from './entities/patient-profile.entity';
import { DoctorProfile } from './entities/doctor-profile.entity';

import { Role } from './entities/role.entity';
import { UsersController } from './users.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User, PatientProfile, DoctorProfile, Role])],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
