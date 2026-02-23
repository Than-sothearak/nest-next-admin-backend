import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express'; // ✅ correct import
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './decorator/public.decorator';
import { GoogleOauthGuard } from './guards/google-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  @Public()
  @ApiOperation({ summary: 'Google OAuth login' })
  async googleAuth() {
    // this will redirect to Google automatically
  }

  @Get('google/callback')
  @Public()
  @UseGuards(GoogleOauthGuard)
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleRedirect(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { accessToken } = await this.authService.oauthLogin(req.user);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { success: true, accessToken };
  }

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
      sameSite: 'lax', // cross-origin
      secure: false, // true in prod + HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return {
      success: true,
      accessToken: accessToken,
    };
  }
}
