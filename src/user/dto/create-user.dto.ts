import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;
  @IsString()
  @IsNotEmpty()
  lastName!: string;
  @IsEmail()
  @IsNotEmpty()
  email!: string;
  @IsNotEmpty()
  @IsString()
  password!: string;
  @IsString()
  @IsNotEmpty()
  role!: string;
}
