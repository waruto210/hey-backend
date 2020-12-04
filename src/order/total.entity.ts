import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('total')
export class TotalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
  date: Date;

  @Column('text')
  city: string;

  @Column('text')
  type: string;

  @Column('int')
  count: number;

  @Column('int')
  income: number;
}
