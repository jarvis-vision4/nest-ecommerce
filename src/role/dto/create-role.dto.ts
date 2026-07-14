import { IsNotEmpty, Length } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  name!: string;
  @IsNotEmpty()
  @Length(3)
  description!: string;
}
