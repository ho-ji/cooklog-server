import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthCleanupService } from './auth-cleanup.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthCleanupService],
})
export class AuthModule {}
