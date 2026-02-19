// src/users/dto/get-user-param.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetUserParamDto {
  @ApiProperty({
    description: 'User ID (UUID or Mongo ObjectId)',
    example: '65f1c9e1c2b3f8a9d4e7a123',
  })
  @IsString()
  id: string;
}
