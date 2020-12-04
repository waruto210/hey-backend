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
    order => order.req,
  )
  order: OrderEntity;

  @ManyToOne(
    () => UserEntity,
    user => user.orderReqs,
  )
  user: UserEntity;

  @Column('text')
  description: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column('int')
  state: number;

  @OneToOne(
    () => OrderSucEntity,
    orderSuc => orderSuc.orderReq,
  )
  orderSuc: OrderSucEntity;
}
