import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class createAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  id: string;
}
