import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/cores/guards/auth.guard';
import { Request } from 'express';
import { CurrentUser } from 'src/cores/decorators/current-user.decorator';
import { SignUpAuthDto } from 'src/auth/dto/sign-up-auth.dto';
import { TransformDto } from 'src/cores/interceptors/transform-dto.interceptor';
import { ResponseUserDto } from './dto/response-user.dto';
import { UserPayload } from 'src';

@Controller('api/v1/users')
@TransformDto(ResponseUserDto)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: SignUpAuthDto) {
    return this.userService.create(createUserDto);
  }

  @Get("/me")
  @UseGuards(AuthGuard)
  getCurrentUser(
    @CurrentUser() user: UserPayload
  ) {
    return this.userService.findMe(user);
  }
  @Get(":id")
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id)
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
