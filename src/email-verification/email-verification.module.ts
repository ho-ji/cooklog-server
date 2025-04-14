import { Module } from '@nestjs/common';
import { EmailVerificationController } from './email-verification.controller';
import { EmailVerificationService } from './email-verification.service';

@Module({
  providers: [EmailVerificationService],
  controllers: [EmailVerificationController],
})
export class VerificationCodeModule {}
