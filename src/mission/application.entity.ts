import { applicationStates } from 'src/constants';
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
import { ApplicationRo } from './application.dto';
import { MissionEntity } from './mission.entity';
import { TransactionEntity } from './transaction.entity';

@Entity('application')
export class ApplicationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => MissionEntity,
    mission => mission.applications,
  )
  mission: MissionEntity;

  @ManyToOne(
    () => UserEntity,
    user => user.applications,
  )
  apUser: UserEntity;

  @Column('text')
  description: string;

  @CreateDateColumn({
    type: 'date',
  })
  created: Date;

  @UpdateDateColumn({
    type: 'date',
  })
  updated: Date;

  @Column({
    type: 'int',
    default: 0,
  })
  state: number;

  @OneToMany(
    () => TransactionEntity,
    transaction => transaction.application,
  )
  transactions: TransactionEntity[];

  toResponseObject(isOwner = false): ApplicationRo {
    const { id, apUser, description, state, mission } = this;

    const resObj: any = {
      id,
      description,
      state,
    };
    if (apUser) {
      resObj.apUser = apUser.toResponseObject(false);
    }
    if (mission) {
      resObj.mission = mission.toResponseObject(false);
    }
    resObj.state = applicationStates[resObj.state];
    resObj.isOwner = isOwner;
    return resObj;
  }
}
