import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async checkEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ email });
    return !!user;
  }

  async checkNickname(nickname: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ nickname });
    return !!user;
  }

  async addUser({
    email,
    password,
    nickname,
  }: {
    email: string;
    password: string;
    nickname: string;
  }): Promise<boolean> {
    const isEmailTaken = await this.checkEmail(email);
    if (isEmailTaken) return false;
    const user = this.userRepository.create({ email, password, nickname });
    await this.userRepository.save(user);
    return true;
  }
}
