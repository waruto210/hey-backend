import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MissionEntity } from 'src/mission/mission.entity';
import { ApplicationEntity } from 'src/mission/application.entity';
import { TransactionEntity } from 'src/mission/transaction.entity';
import { StatsEntity } from 'src/mission/stats.entity';
import { UserEntity } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { OrderCondDto, StasCondDto } from './search.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(MissionEntity)
    private orderRepository: Repository<MissionEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(ApplicationEntity)
    private orderReqRepository: Repository<ApplicationEntity>,
    @InjectRepository(TransactionEntity)
    private orderSucRepository: Repository<TransactionEntity>,
    @InjectRepository(StatsEntity)
    private totalRepository: Repository<StatsEntity>,
  ) {}

  async getStas(cond: Partial<StasCondDto>) {
    let totals = await this.totalRepository.find();
    if (cond.from) {
      totals = totals.filter(x => new Date(x.date) >= new Date(cond.from));
    }
    if (cond.to) {
      totals = totals.filter(x => new Date(x.date) <= new Date(cond.to));
    }
    if (cond.city) {
      totals = totals.filter(x => x.city == cond.city);
    }

    if (cond.sortkey) {
      if (cond.sortkey == 'count') {
        totals = totals.sort((x1, x2) => x1.count - x2.count);
      } else if (cond.sortkey == 'income') {
        totals = totals.sort((x1, x2) => x1.income - x2.income);
      }
    }
    return totals;
  }
}
