import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/verify-email/:email')
  async verifyEmail(@Param('email') email: string): Promise<object> {
    const isEmailTaken = await this.userService.checkEmail(email);
    return {
      success: true,
      data: isEmailTaken,
      message: isEmailTaken
        ? 'Email is already in use'
        : 'Email is available for signup',
    };
  }
}
