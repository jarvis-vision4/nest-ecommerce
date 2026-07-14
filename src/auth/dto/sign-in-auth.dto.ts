import { PartialType } from '@nestjs/swagger';
import { SignUpAuthDto } from './sign-up-auth.dto';

export class SignInAuthDto extends PartialType(SignUpAuthDto) {}
