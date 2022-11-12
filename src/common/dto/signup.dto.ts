import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { AccountType } from '../enum';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsEnum(AccountType)
  readonly account: AccountType;
}
