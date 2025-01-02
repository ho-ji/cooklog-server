import { Controller, Get, Param, Post } from '@nestjs/common';
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
    const isEmailTaken = await this.userService.checkEmail(email);
    return {
      data: isEmailTaken,
      message: isEmailTaken
        ? 'Email is already in use'
        : 'Email is available for signup',
    };
  }

  @Post('/send-verification-code/:email')
  async sendVerificationCode(@Param('email') email: string) {
    const verificationCode =
      await this.verificationCodeService.saveVerificationCode(email);
    await this.sendEmailService.sendVerificationCode(email, verificationCode);
  }
}
