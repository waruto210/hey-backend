import { UserEntity } from 'src/users/user.entity';
import { User } from 'src/users/users.service';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderReqEntity } from './orderreq.entity';

@Entity('ordersuc')
export class OrderSucEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(
    () => OrderReqEntity,
    orderReq => orderReq.orderSuc,
  )
  orderReq: OrderReqEntity;

  @ManyToOne(
    () => UserEntity,
    user => user.orderReqSucs,
  )
  userReq: UserEntity;

  @ManyToOne(
    () => UserEntity,
    user => user.orderOwnSucs,
  )
  userOwn: UserEntity;

  @Column('date')
  finishDate: Date;

  @Column('int')
  ownerPay: number;

  @Column('int')
  reqPay: number;
}
