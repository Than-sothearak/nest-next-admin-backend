import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_ID')!,
      clientSecret: configService.get<string>('GOOGLE_SECRET')!,
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL')!,
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    // profile contains Google user info
    try {
      const { name, emails, photos } = profile;
      const user = {
        email: emails?.[0]?.value,
        firstName: name?.givenName,
        lastName: name?.familyName,
        picture: photos?.[0]?.value,
        accessToken,
      };
      done(null, user);
    } catch (err) {
      console.error('GoogleStrategy validate error:', err);
      done(err, false);
    }
  }
}
