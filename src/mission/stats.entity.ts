import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stats')
export class StatsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
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
