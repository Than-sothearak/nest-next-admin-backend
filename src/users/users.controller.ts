import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get() //GET method to fetch all users /users
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Res({ passthrough: true }) response: Response,
    @Query('query') query?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10, //
  ) {
    return this.userService.findAll(query, Number(page), Number(limit));
  }

  @Get(':id') //GET method to fetch a user by id /users/:id
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post() //POST method to create a new /user
  @UseGuards(JwtAuthGuard)
  create(
    @Body(ValidationPipe)
    createUserDto: CreateUserDto,
  ) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id') //PATCH method to update a user by id /users/:id
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  // @Delete(':id') //DELETE method to delete a user by id /users/:id
  // remove(@Param('id') id: string) {
  //   return `This action removes user with id: ${id}`;
  // }
}
