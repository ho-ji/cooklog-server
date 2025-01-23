import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeSoftRemove,
  DataSource,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Auth } from 'src/auth/auth.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  nickname: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'boolean', default: false })
  marketingAgreement: boolean;

  @Column({ type: 'boolean', default: false })
  eventNotificationAgreement: boolean;

  @OneToMany(() => Auth, (auth) => auth.user)
  refreshTokens: Auth[];

  @BeforeInsert()
  private async beforeInsert() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  constructor(private dataSource: DataSource) {}

  @BeforeSoftRemove()
  async deletePersonalInfo() {
    this.password = null;
    const authRepository = this.dataSource.getRepository(Auth);
    await authRepository.delete({ user: this });
  }
}
