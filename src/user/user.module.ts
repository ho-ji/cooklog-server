import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { SendEmailService } from 'src/send-email/send-email.service';
import { VerificationCodeService } from 'src/verification-code/verification-code.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, SendEmailService, VerificationCodeService],
  exports: [UserService],
})
export class UserModule {}
