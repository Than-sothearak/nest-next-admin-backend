// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <-- NEW IMPORT
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // // 💡 Add this FIRST to ensure .env variables are loaded globally
    // // before any other module (like Prisma) tries to access them.
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Your other modules
    UsersModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
