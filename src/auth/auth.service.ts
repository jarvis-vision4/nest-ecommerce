import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { SignInAuthDto } from './dto/sign-in-auth.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) { }
  async signUp(createAuthDto: SignUpAuthDto) {
    const userInfo = await this.userService.findByEmail(createAuthDto.email!);
    if (userInfo?.email) {
      throw new BadRequestException("Email Already Existed");
    }
    const user = await this.userService.create(createAuthDto);
    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
    }
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }

  async signIn(signInAuth: SignInAuthDto) {
    const user = await this.userService.findByEmail(signInAuth.email!);
    if (!user) {
      throw new BadRequestException("Email Not Found");
    }
    const isMatch = await bcrypt.compare(signInAuth.password!, user.password);
    if (!isMatch) {
      throw new BadRequestException("Bad Credentials");
    }
    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
    }
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;

  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }



  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
