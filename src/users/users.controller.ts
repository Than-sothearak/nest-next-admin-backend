import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUserParamDto } from './dto/get-user-param.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users with pagination and search for testing',
  })
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully',
  })
  @ApiQuery({
    name: 'query',
    type: String,
    required: false,
    description: 'Search keyword for user name or email',
    example: 'john',
  })
  @ApiQuery({
    name: 'page',
    // type: Number,
    required: false,
    description: 'Page number for pagination (starting from 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    // type: Number,
    required: false,
    description: 'Number of entries returned per page',
    example: 10,
  })
  async findAll(
    @Res({ passthrough: true }) response: Response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('query') query?: string,
  ) {
    return this.userService.findAll(Number(page), Number(limit), query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID only for admin' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(
    @Param()
    getUserParam: GetUserParamDto,
  ) {
    return this.userService.findOne(getUserParam.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create user (admin only)' })
  // @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User successfully created',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch() //PATCH method to update a user by id /users/:id
  @ApiOperation({ summary: 'Update user by ID only for admin' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({
    name: 'id',
    type: String,
    description: 'User ID for update',
    example: '69956202df751140b65892...',
  })
  @ApiBody({ type: UpdateUserDto })
  update(
    @Query('id') id: string, // <-- read from query
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  // @Delete(':id') //DELETE method to delete a user by id /users/:id
  // remove(@Param('id') id: string) {
  //   return `This action removes user with id: ${id}`;
  // }
}
