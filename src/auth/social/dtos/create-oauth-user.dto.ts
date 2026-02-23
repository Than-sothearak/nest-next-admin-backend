import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsDateString,
  IsInt,
  Min,
  MaxLength,
  IsNotEmpty,
  IsEnum,
  IsArray,
} from 'class-validator';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum Roles {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export class CreateOAuthUserDto {
  // ---------------- REQUIRED ----------------
  @ApiProperty({ description: 'Unique username', example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @ApiProperty({ description: 'User email', example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password', example: 'P@ssw0rd123!' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    enum: Roles,
    isArray: true,
    description: 'User roles',
    example: [Roles.USER],
  })
  @IsEnum(Roles, { each: true })
  @IsArray()
  roles: Roles[];

  // ---------------- OPTIONAL ----------------
  @IsOptional()
  phone?: number;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string;

  @ApiPropertyOptional({ description: 'User status', example: 'active' })
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  imageUrl?: string;

  @IsOptional()
  @IsString()
  telegramChatId?: string;

  @ApiPropertyOptional({ description: 'Is Admin', example: false })
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  loginCount?: number;

  @IsOptional()
  @IsDateString()
  lastLogin?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastIP?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  lastSeen?: Date;

  @IsOptional()
  @IsString()
  lastUserAgent?: string;

  @IsOptional()
  @IsString()
  deviceType?: string;

  @IsOptional()
  @IsString()
  deviceModel?: string;

  @IsOptional()
  @IsString()
  osName?: string;

  @IsOptional()
  @IsString()
  browserName?: string;
}
