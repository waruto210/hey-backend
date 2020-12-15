import { use } from 'passport';
import { UserEntity } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';
import { OrderSucEntity } from './ordersuc.entity';

@Entity('orderreq')
export class OrderReqEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => OrderEntity,
    order => order.reqs,
  )
  order: OrderEntity;

  @ManyToOne(
    () => UserEntity,
    user => user.reqOrders,
  )
  reqUser: UserEntity;

  @Column('text')
  description: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({
    type: 'int',
    default: 0,
  })
  state: number;

  @OneToOne(
    () => OrderSucEntity,
    orderSuc => orderSuc.req,
  )
  orderSuc: OrderSucEntity[];

  toResponseObject() {
    const states = ['待处理', '同意', '拒绝', '取消'];
    const { id, reqUser: user, description, state } = this;
    let username = '';
    if (user.username) {
      username = user.username;
    }
    const resObj: any = {
      id,
      username,
      description,
      state,
    };
    resObj.state = states[resObj.state];
    return resObj;
  }
}
