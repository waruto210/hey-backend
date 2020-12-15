import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserRO } from './user.dto';
import { OrderEntity } from 'src/order/order.entity';
import { OrderReqEntity } from 'src/order/orderreq.entity';
import { OrderSucEntity } from 'src/order/ordersuc.entity';

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
    order => order.owner,
  )
  missions: OrderEntity[];

  @OneToMany(
    () => OrderReqEntity,
    orderReq => orderReq.apUser,
  )
  missionAps: OrderReqEntity[];

  @OneToMany(
    () => OrderSucEntity,
    orderSuc => orderSuc.apUser,
  )
  missionApSucs: OrderSucEntity[];

  @OneToMany(
    () => OrderSucEntity,
    orderSuc => orderSuc.owner,
  )
  missionOwnSucs: OrderSucEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toResponseObject(showId = true): UserRO {
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
      isadmin,
    } = this;
    const responseObject: any = {
      id,
      username,
      name,
      phone,
      level,
      description,
      city,
      isadmin,
    };
    if (showId) {
      responseObject.identityType = identityType;
      responseObject.identity = identity;
    }
    responseObject.level = levels[responseObject.level];

    return responseObject;
  }
}
