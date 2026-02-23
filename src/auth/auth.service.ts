import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CurrentUserData } from './interfaces/current-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new NotFoundException(`No user found for email: ${loginDto.email}`);
    }
    const isPasswordValid: boolean = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
      username: user.username,
    } as CurrentUserData);

    return {
      accessToken,
    };
  }

  singUp(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
