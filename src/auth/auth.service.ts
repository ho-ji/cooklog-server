import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './auth.entity';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async generateAccessToken(dto: CreateAuthDto) {
    const accessTokenKey = this.configService.get<string>('ACCESS_TOKEN_KEY');
    const payload = { id: dto.id, email: dto.email };
    return await this.jwtService.signAsync(payload, {
      secret: accessTokenKey,
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRE_TIME'),
    });
  }
  async generateRefreshToken(dto: CreateAuthDto) {
    const refreshTokenKey = this.configService.get<string>('REFRESH_TOKEN_KEY');
    const payload = { id: dto.id, email: dto.email };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshTokenKey,
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRE_TIME'),
    });
    await this.addRefreshToken(refreshToken, dto.id);
    return refreshToken;
  }
  async addRefreshToken(refreshToken: string, id: string) {
    const auth = this.authRepository.create({
      refreshToken,
      user: { id },
    });
    await this.authRepository.save(auth);
  }
}
