import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from 'src/order/order.entity';
import { OrderReqEntity } from 'src/order/orderreq.entity';
import { OrderSucEntity } from 'src/order/ordersuc.entity';
import { TotalEntity } from 'src/order/total.entity';
import { UserEntity } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { OrderConDto } from './search.dto';

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
}
