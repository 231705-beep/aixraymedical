import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        console.log('DEBUG: Validating User:', email);
        const user = await this.usersService.findOne(email);
        if (!user) {
            console.log('DEBUG: User NOT found in database');
            return null;
        }
        const isMatch = await bcrypt.compare(pass, user.password);
        console.log('DEBUG: Password Match Result:', isMatch);
        if (isMatch) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        console.log('DEBUG: Login Attempt for:', loginDto.email);
        const user = await this.usersService.findOne(loginDto.email);

        if (!user) {
            console.log('DEBUG: Login Failed - Email NOT found:', loginDto.email);
            throw new UnauthorizedException('Email not found. Please register first.');
        }

        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        console.log('DEBUG: Password Match:', isMatch);
        console.log(`DEBUG: Input Password Length: ${loginDto.password.length}, Stored Hash Length: ${user.password.length}`);

        if (!isMatch) {
            console.log('DEBUG: Login Failed - Incorrect Password for:', loginDto.email);
            console.log(`DEBUG: Failed Input: '${loginDto.password}' (first 2 chars: ${loginDto.password.substring(0, 2)})`);
            throw new UnauthorizedException('Incorrect password. Please check your credentials.');
        }

        const payload = { email: user.email, sub: user.id, role: user.role };
        console.log('DEBUG: AuthService.login returning user:', JSON.stringify(user));
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

    async signup(createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    async getProfile(userId: string) {
        return this.usersService.findById(userId);
    }
}
