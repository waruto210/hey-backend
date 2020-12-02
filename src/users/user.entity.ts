import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserRO } from './uset.dto';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isadmin: boolean;

  @Column({
    type: 'text',
    nullable: true,
  })
  name: string;

  @Column('text')
  identity: string;

  @Column('text')
  phone: string;

  @Column({
    type: 'integer',
    default: 0,
  })
  level: number;

  @Column({
    type: 'text',
    default: '这个人很懒，什么也没留下',
  })
  profile: string;

  @Column('text')
  city: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  toResponseObject(): UserRO {
    const { id, username } = this;
    const responseObject: any = { id, username };
    return responseObject;
  }
}
