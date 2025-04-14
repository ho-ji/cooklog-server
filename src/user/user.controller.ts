import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { DefaultResponse } from 'src/utils/types/response.type';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';

@Controller('/api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

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
  async signUp(@Body() dto: CreateUserDto): Promise<DefaultResponse<object>> {
    const isEmailTaken = await this.userService.checkEmail(dto.email);
    const isNicknameTaken = await this.userService.checkNickname(dto.nickname);
    await this.userService.addUser(dto);
    const success = !isEmailTaken && !isNicknameTaken;
    return {
      success,
      message: success ? 'Signup success' : 'Signup fail',
      data: { email: isEmailTaken, nickname: isNicknameTaken },
    };
  }

  @Post('/signin')
  async signIn(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ): Promise<void> {
    const uid = await this.userService.validateUser(body.email, body.password);
    if (!uid) {
      res.status(401).json({
        success: false,
        message: 'Signin failed',
        data: null,
      });
      return;
    }
    const dto: CreateAuthDto = {
      email: body.email,
      id: uid,
    };
    const accessToken = await this.authService.generateAccessToken(dto);
    const refreshToken = await this.authService.generateRefreshToken(dto);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.json({
      success: true,
      message: 'Signin success',
      data: {
        accessToken,
        uid,
      },
    });
    return;
  }
}
