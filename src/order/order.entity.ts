import { UserEntity } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import 'dotenv/config';
import { OrderReqEntity } from './orderreq.entity';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => UserEntity,
    user => user.missions,
  )
  owner: UserEntity;

  @Column('text')
  type: string;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('int')
  people: number;

  @Column({
    type: 'int',
    default: 0,
  })
  commit: number;

  @Column('date')
  deadline: Date;

  @Column('text')
  picture: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({
    type: 'int',
    default: 0,
  })
  state: number;

  @OneToMany(
    () => OrderReqEntity,
    orderReq => orderReq.mission,
  )
  applications: OrderReqEntity[];

  toResponseObject(isOwner = false) {
    const states = ['待响应', '已完成', '已取消', '到期未达成'];
    const {
      id,
      owner,
      type,
      title: title,
      description,
      people,
      deadline,
      picture,
      created,
      updated,
      state,
      commit,
    } = this;
    const resObj: any = {
      id,
      type,
      title,
      description,
      people,
      deadline,
      picture,
      created,
      updated,
      state,
      commit,
    };
    if (owner) {
      resObj.owner = owner.toResponseObject(false);
    }
    resObj.isOwner = isOwner;
    resObj.state = states[resObj.state];
    // Logger.log(`resObj is ${owner}`, 'heer');
    return resObj;
  }
}
