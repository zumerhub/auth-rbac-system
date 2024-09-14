import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../enums/role.enum';

export class SignUpDto {
  @IsNotEmpty()
  @IsString({ message: 'name must not less than 5 characters' })
  @MinLength(5)
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString({ message: 'password must not less than 6 characters' })
  @MinLength(6)
  readonly password: string;

  @IsEnum(Role)
  role: Role;
}
