import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express'; // ✅ correct import
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './decorator/public.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({ type: LoginDto })
  async signIn(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signIn(loginDto);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax', // ✅ cross-origin
      secure: false, // true in prod + HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return {
      success: true,
      accessToken: accessToken,
    };
  }
}
