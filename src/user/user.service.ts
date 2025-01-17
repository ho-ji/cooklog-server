import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

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

  async addUser(dto: CreateUserDto): Promise<void> {
    const user = this.userRepository.create(dto);
    await this.userRepository.save(user);
  }
}
