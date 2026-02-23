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
import { GoogleUserInterface } from './interfaces/google-user.interface';
import {
  CreateOAuthUserDto,
  Gender,
  Roles,
} from './social/dtos/create-oauth-user.dto';

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
  async oauthLogin(googleUser: GoogleUserInterface) {
    // check if user exists
    let user = await this.usersService.findByEmail(googleUser.email);

    if (!user) {
      const createUserDto: CreateOAuthUserDto = {
        email: googleUser.email,
        username: googleUser.email.split('@')[0], // use email prefix as username
        imageUrl: googleUser.picture,
        password: '', // empty string, not undefined
        status: 'active',
        roles: [Roles.USER],
        gender: Gender.MALE,
      };
      // create user if not exists
      const response = await this.usersService.create(createUserDto);
      user = response.data;
    }

    const accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
      username: user.username,
    } as CurrentUserData);

    return { accessToken };
  }

  singUp(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
