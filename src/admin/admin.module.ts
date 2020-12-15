import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissionEntity } from 'src/mission/mission.entity';
import { UserEntity } from 'src/users/user.entity';
import { ApplicationEntity } from 'src/mission/application.entity';
import { TransactionEntity } from 'src/mission/transaction.entity';
import { StatsEntity } from 'src/mission/stats.entity';
import { UsersService } from 'src/users/users.service';
import { MissionService } from 'src/mission/mission.service';

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
  providers: [AdminService, UsersService, MissionService],
  controllers: [AdminController],
})
export class AdminModule {}
