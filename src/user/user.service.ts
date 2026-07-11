import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt"
import { RoleService } from 'src/role/role.service';
import { SignUpAuthDto } from 'src/auth/dto/sign-up-auth.dto';
import { CartService } from 'src/cart/cart.service';
import { UserPayload } from 'src';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private roleService: RoleService,
    private cartService: CartService
  ) {

  }
  async create(createUserDto: SignUpAuthDto) {
    const role = await this.roleService.getRole("user")
    const user = new User();
    const userCheck = await this.userRepository.findOne({
      where: {
        email: createUserDto.email
      }
    })
    if (userCheck) {
      throw new BadRequestException("User already existed!")
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
    Object.assign(user, { ...createUserDto, password: hashedPassword, role: role })
    const savedUser = await this.userRepository.save(user);
    await this.cartService.create(savedUser)
    return savedUser;
  }
  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id
      },
      relations: {
        role: true
      }
    })

    if (!user) {
      throw new NotFoundException("User Not Found")
    }
    return user;
  }
  async findAll() {
    const users = await this.userRepository.find({
      where: {
        isActive: true
      }
    })
    if (users.length == 0) {
      throw new NotFoundException("Users not found")
    }
    return users;

  }
  async findMe(user: UserPayload) {
    const currentUser = await this.userRepository.findOne({
      where: {
        id: user.id
      },
      relations: {
        role: true
      }
    })
    return currentUser;
  }
  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email
      }
    })
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id)
    user.firstName = updateUserDto.firstName ?? user.firstName
    user.lastName = updateUserDto.lastName ?? user.lastName
    return this.userRepository.save(user)
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
