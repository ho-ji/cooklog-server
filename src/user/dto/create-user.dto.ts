import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';
import { USER_REGEX } from 'src/utils/constants/user.constants';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(USER_REGEX.PASSWORD)
  password: string;

  @IsNotEmpty()
  @Matches(USER_REGEX.NICKNAME)
  nickname: string;

  @IsOptional()
  @IsBoolean()
  marketingAgreement: boolean;

  @IsOptional()
  @IsBoolean()
  eventNotificationAgreement: boolean;
}
