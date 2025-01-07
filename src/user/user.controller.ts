import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { VerificationCodeService } from 'src/verification-code/verification-code.service';
import { SendEmailService } from 'src/send-email/send-email.service';
import { DefaultResponse } from 'src/utils/types/response.type';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('/api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly sendEmailService: SendEmailService,
  ) {}

  @Get('/verify-email/:email')
  async verifyEmail(
    @Param('email') email: string,
  ): Promise<DefaultResponse<boolean>> {
    const isEmailTaken: boolean = await this.userService.checkEmail(email);
    return {
      success: true,
      data: isEmailTaken,
      message: isEmailTaken
        ? 'Email is already in use'
        : 'Email is available for signup',
    };
  }

  @Post('/send-verification-code/:email')
  async sendVerificationCode(@Param('email') email: string): Promise<void> {
    const verificationCode: string =
      await this.verificationCodeService.saveVerificationCode(email);
    await this.sendEmailService.sendVerificationCode(email, verificationCode);
  }

  @Post('/check-verification-code')
  async checkVerificationCode(
    @Body('code') code: string,
    @Body('email') email: string,
  ): Promise<DefaultResponse<boolean>> {
    const verificationCode: string =
      await this.verificationCodeService.getVerificationCode(email);

    if (!verificationCode)
      return {
        success: false,
        message: 'Email verification expired',
      };

    const isCodeCorrect = code === verificationCode;
    return {
      success: true,
      data: isCodeCorrect,
      message: isCodeCorrect
        ? 'Email verificaiotn success'
        : 'Verification code is incorrect',
    };
  }

  @Get('/verify-nickname/:nickname')
  async verfiyNickname(
    @Param('nickname') nickname: string,
  ): Promise<DefaultResponse<boolean>> {
    const isNicknameTaken: boolean =
      await this.userService.checkNickname(nickname);
    return {
      success: true,
      data: isNicknameTaken,
      message: isNicknameTaken
        ? 'Nickname is already in use'
        : 'Nickname is available for signup',
    };
  }

  @Post('/signup')
  async signUp(
    @Body('user') dto: CreateUserDto,
  ): Promise<DefaultResponse<void>> {
    const success = await this.userService.addUser(dto);
    return {
      success,
      message: success ? 'Signup success' : 'Signup fail',
    };
  }
}
