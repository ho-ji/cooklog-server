import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { VerificationCodeService } from 'src/verification-code/verification-code.service';
import { SendEmailService } from 'src/send-email/send-email.service';

@Controller('/api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly sendEmailService: SendEmailService,
  ) {}

  @Get('/verify-email/:email')
  async verifyEmail(@Param('email') email: string): Promise<object> {
    const isEmailTaken: boolean = await this.userService.checkEmail(email);
    return {
      data: isEmailTaken,
      message: isEmailTaken
        ? 'Email is already in use'
        : 'Email is available for signup',
    };
  }

  @Post('/send-verification-code/:email')
  async sendVerificationCode(@Param('email') email: string) {
    const verificationCode: string =
      await this.verificationCodeService.saveVerificationCode(email);
    await this.sendEmailService.sendVerificationCode(email, verificationCode);
  }

  @Post('/check-verification-code')
  async checkVerificationCode(
    @Body('code') code: string,
    @Body('email') email: string,
  ): Promise<object> {
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
      messages: isCodeCorrect
        ? 'Email verificaiotn success'
        : 'Verification code is incorrect',
    };
  }

  @Get('/verify-nickname/:nickname')
  async verfiyNickname(@Param('nickname') nickname: string): Promise<object> {
    const isNicknameTaken: boolean =
      await this.userService.checkNickname(nickname);
    return {
      data: isNicknameTaken,
      message: isNicknameTaken
        ? 'Nickname is already in use'
        : 'Nickname is available for signup',
    };
  }
}
