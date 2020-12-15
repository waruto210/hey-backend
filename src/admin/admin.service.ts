import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from 'src/order/order.entity';
import { OrderReqEntity } from 'src/order/orderreq.entity';
import { OrderSucEntity } from 'src/order/ordersuc.entity';
import { TotalEntity } from 'src/order/total.entity';
import { UserEntity } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { OrderCondDto, StasCondDto } from './search.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(OrderReqEntity)
    private orderReqRepository: Repository<OrderReqEntity>,
    @InjectRepository(OrderSucEntity)
    private orderSucRepository: Repository<OrderSucEntity>,
    @InjectRepository(TotalEntity)
    private totalRepository: Repository<TotalEntity>,
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
