import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserQueryDto } from './dto/user-query.dto.js';
import { UsersRepository } from './users.repository.js';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(dto: CreateUserDto) {
    const existingUser = await this.usersRepository.findByEmail(
      dto.organizationId,
      dto.email,
    );

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    return this.usersRepository.create(dto);
  }

  async findAll(query: UserQueryDto) {
    const result = await this.usersRepository.findAll(query);

    return {
      data: result.data,
      meta: {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / query.limit),
      },
    };
  }

  async findOne(organizationId: number, id: number) {
    const user = await this.usersRepository.findById(organizationId, id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(organizationId: number, id: number, dto: UpdateUserDto) {
    await this.findOne(organizationId, id);

    if (dto.email) {
      const existingUser = await this.usersRepository.findByEmail(
        organizationId,
        dto.email,
      );

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('User with this email already exists');
      }
    }

    return this.usersRepository.update(organizationId, id, dto);
  }

  async remove(organizationId: number, id: number) {
    await this.findOne(organizationId, id);

    return this.usersRepository.delete(organizationId, id);
  }
}
