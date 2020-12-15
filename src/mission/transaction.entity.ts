import { UserEntity } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApplicationEntity } from './application.entity';

@Entity('transaction')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => ApplicationEntity,
    application => application.transactions,
  )
  application: ApplicationEntity;

  @ManyToOne(
    () => UserEntity,
    user => user.apTransactions,
  )
  apUser: UserEntity;

  @ManyToOne(
    () => UserEntity,
    user => user.missonTransactions,
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
