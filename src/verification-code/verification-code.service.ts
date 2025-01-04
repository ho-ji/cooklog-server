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
  async saveVerificationCode(email: string): Promise<string> {
    const code = codeGenerator();
    const ttl = 180;
    await this.redis.del(`verification:${email}`);
    await this.redis.del(`attempts:${email}`);
    await this.redis.setex(`verification:${email}`, ttl, code);
    await this.redis.setex(`attempts:${email}`, ttl, 10);
    return code;
  }
  async getVerificationCode(email: string): Promise<string | null> {
    const attempts = await this.redis.get(`attempts:${email}`);
    if (!attempts || parseInt(attempts) <= 0) return null;
    const ttl = await this.redis.ttl(`attempts:${email}`);
    await this.redis.setex(`attempts:${email}`, ttl, parseInt(attempts) - 1);
    return await this.redis.get(`verification:${email}`);
  }
}
