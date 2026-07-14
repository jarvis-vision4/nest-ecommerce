import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}
  create(createRoleDto: CreateRoleDto) {
    const role = new Role();
    Object.assign(role, createRoleDto);
    return this.roleRepository.save(role);
  }

  async findAll() {
    const roles = await this.roleRepository.find();
    return roles;
  }

  async getRole(name: string) {
    const role = await this.roleRepository.findOne({
      where: {
        name,
      },
    });
    if (!role) {
      throw new NotFoundException(`Role ${name} not found`);
    }
    return role;
  }

  async update(name: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.getRole(name);
    role.description = updateRoleDto.description!;
    return this.roleRepository.save(role);
  }

  async remove(name: string) {
    const role = await this.getRole(name);
    role.isActive = false;
    return this.roleRepository.save(role);
  }
}
