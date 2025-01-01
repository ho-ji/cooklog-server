import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { codeGenerator } from 'src/utils/codeGenerator';

@Injectable()
export class VerificationCodeService {
  private readonly redis: Redis;
  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow();
  }
  async saveVerificationCode(email: string) {
    const code = codeGenerator();
    const ttl = 180;
    await this.redis.del(email);
    await this.redis.setex(email, ttl, code);
  }
  async getVerificationCode(email: string): Promise<string | null> {
    return await this.redis.get(email);
  }
}
