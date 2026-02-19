import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll(page: number, limit: number, query?: string) {
    const where = query
      ? {
          OR: [
            { username: { contains: query, mode: undefined } }, // optional: remove mode
            { email: { contains: query, mode: undefined } }, // optional: remove mode
          ],
        }
      : {};

    const [users, count] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }), // ✅ await executed
    ]);

    const totalPages = Math.ceil(count / limit);
    return {
      data: users,
      meta: {
        totalItems: count,
        itemCount: users.length,
        itemsPerPage: limit,
        totalPages: totalPages,
        currentPage: page,
      },
    };
  }

  async findOne(id: string) {
    if (!id || !/^[a-fA-F0-9]{24}$/.test(id)) {
      throw new BadRequestException('Invalid user ID format');
    }
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      },
    });

    if (existingUser) {
      throw new HttpException(
        existingUser.username === createUserDto.username
          ? 'Username already exists'
          : ' Email already exists',
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword: string = await bcrypt.hash(
      createUserDto.password,
      10,
    );

    try {
      const createdUser = await this.prisma.user.create({
        data: {
          ...createUserDto,
          phone: createUserDto.phone?.toString(),
          password: hashedPassword,
        },
      });
      return {
        success: true,
        message: 'User created successfully',
        data: createdUser,
      };
    } catch (error) {
      throw new HttpException(
        `An error occurred during user creation. ${String(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: id.toString() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const data = {
      ...updateUserDto,
      phone:
        updateUserDto.phone !== undefined
          ? updateUserDto.phone.toString()
          : undefined,
    };

    const updatedUser = await this.prisma.user.update({
      where: { id: id.toString() },
      data,
    });

    return {
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    };
  }
}
