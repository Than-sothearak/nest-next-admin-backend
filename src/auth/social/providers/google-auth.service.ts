import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { GoogleTokenDto } from '../dtos/google-token.dto';

@Injectable()
export class GoogleAuthService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    /**
     * Initialize the OAuth2 client with the Google Client ID from environment variables.
     */
    private readonly configService: ConfigService,
  ) {}
  onModuleInit() {
    const clientId = this.configService.get<string>('GOOGLE_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_SECRET');
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    
  }
}
