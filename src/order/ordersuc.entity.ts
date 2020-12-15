import { UserEntity } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderReqEntity } from './orderreq.entity';

@Entity('ordersuc')
export class OrderSucEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => OrderReqEntity,
    orderReq => orderReq.missionSuc,
  )
  application: OrderReqEntity;

  @ManyToOne(
    () => UserEntity,
    user => user.missionApSucs,
  )
  apUser: UserEntity;

  @ManyToOne(
    () => UserEntity,
    user => user.missionOwnSucs,
  )
  owner: UserEntity;

  @Column('date')
  finishDate: Date;

  @Column({
    type: 'int',
    default: 0,
  })
  pay: number;

  @Column({
    type: 'int',
    default: 0,
  })
  commission: number;
}
