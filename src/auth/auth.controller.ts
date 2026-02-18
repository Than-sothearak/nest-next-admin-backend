import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express'; // ✅ correct import

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body(ValidationPipe) loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // 1️⃣ Call service first to get token
    const { accessToken, user } = await this.authService.signIn(loginDto);

    // 2️⃣ Set HttpOnly cookie
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax', // ✅ cross-origin
      secure: false, // true in prod + HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    // 3️⃣ Return success response
    return {
      success: true,
      user: {
        username: user.username,
        email: user.email,
        id: user.id,
        accessToken: accessToken,
      },
    };
  }
}
