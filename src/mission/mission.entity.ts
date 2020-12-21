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
import { ApplicationEntity } from './application.entity';
import { missionStates } from 'src/constants';
import { MissionRO } from './mission.dto';

@Entity('mission')
export class MissionEntity {
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
    () => ApplicationEntity,
    application => application.mission,
  )
  applications: ApplicationEntity[];

  toResponseObject(isOwner = false): MissionRO {
    const {
      id: missionId,
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
      applications,
    } = this;
    const resObj: any = {
      missionId,
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
      resObj.owner = owner.toResponseObject();
    }
    if (applications) {
      resObj.applications = applications.map(x => x.toResponseObject());
    }
    resObj.isOwner = isOwner;
    resObj.state = missionStates[resObj.state];
    // Logger.log(`resObj is ${owner}`, 'heer');
    return resObj;
  }
}
