import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/user.entity';
import { MissionController } from './mission.controller';
import { MissionEntity } from './mission.entity';
import { MissionService } from './mission.service';
import { ApplicationEntity } from './application.entity';
import { TransactionEntity } from './transaction.entity';
import { StatsEntity } from './stats.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MissionEntity,
      UserEntity,
      ApplicationEntity,
      TransactionEntity,
      StatsEntity,
    ]),
  ],
  controllers: [MissionController],
  providers: [MissionService],
})
export class MissionModule {}
