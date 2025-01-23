import { User } from 'src/user/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  refreshToken: string;

  @Column({ type: 'timestamp' })
  expiredAt: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  @JoinColumn({ name: 'uid' })
  user: User;

  @BeforeInsert()
  setExpireDate() {
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 7);
    this.expiredAt = expireDate;
  }
}
