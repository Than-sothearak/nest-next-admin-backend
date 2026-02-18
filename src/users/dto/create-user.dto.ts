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

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  address: string;

  @IsEnum(Gender, { message: 'gender must be either male or female' })
  gender: Gender;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string;

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

  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @IsEnum(Roles, {
    each: true,
    message: 'roles must be one of user, admin, or moderator',
  })
  roles: Roles[];

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
