import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserRO } from './user.dto';
import { OrderEntity } from 'src/order/order.entity';

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

  @Column({
    type: 'text',
    default: '身份证',
  })
  identityType: string;

  @Column('text')
  identity: string;

  @Column('text')
  phone: string;

  @Column({
    type: 'int',
    default: 0,
  })
  level: number;

  @Column({
    type: 'text',
    default: '这个人很懒，什么也没留下',
  })
  description: string;

  @Column('text')
  city: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @OneToMany(
    () => OrderEntity,
    order => order.user,
  )
  orders: OrderEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toResponseObject(): UserRO {
    const levels = ['一般', '重要', '钻石'];
    const {
      id,
      username,
      name,
      identityType,
      identity,
      phone,
      level,
      description,
      city,
    } = this;
    const responseObject: any = {
      id,
      username,
      name,
      identityType,
      identity,
      phone,
      level,
      description,
      city,
    };
    responseObject.level = levels[responseObject.level];

    return responseObject;
  }
}
