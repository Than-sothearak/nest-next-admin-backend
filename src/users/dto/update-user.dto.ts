import { CreateUserDto } from './create-user.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: 'Unique username', example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username: string;
}
