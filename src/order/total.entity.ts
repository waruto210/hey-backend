import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('total')
export class TotalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @UpdateDateColumn()
  date: Date;

  @Column('text')
  city: string;

  @Column('text')
  type: string;

  @Column({
    type: 'int',
    default: 0,
  })
  count: number;

  @Column({
    type: 'int',
    default: 0,
  })
  income: number;
}
