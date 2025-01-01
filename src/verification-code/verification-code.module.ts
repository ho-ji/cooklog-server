import { Module } from '@nestjs/common';
import { VerificationCodeService } from './verification-code.service';

@Module({
  providers: [VerificationCodeService],
})
export class VerificationCodeModule {}
