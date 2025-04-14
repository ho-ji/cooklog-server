import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { DefaultResponse } from 'src/utils/types/response.type';
import { SendEmailService } from 'src/send-email/send-email.service';
import { EmailVerificationService } from './email-verification.service';

@Controller('/api/email-verification')
export class EmailVerificationController {
  constructor(
    private readonly userService: UserService,
    private readonly EmailVerificationService: EmailVerificationService,
    private readonly sendEmailService: SendEmailService,
  ) {}

  @Get('/verify/:email')
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

  @Post('/send/:email')
  async sendVerificationCode(@Param('email') email: string): Promise<void> {
    const verificationCode: string =
      await this.EmailVerificationService.saveVerificationCode(email);
    await this.sendEmailService.sendVerificationCode(email, verificationCode);
  }

  @Post('/check')
  async checkVerificationCode(
    @Body('code') code: string,
    @Body('email') email: string,
  ): Promise<DefaultResponse<boolean>> {
    const verificationCode: string =
      await this.EmailVerificationService.getVerificationCode(email);

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
}
