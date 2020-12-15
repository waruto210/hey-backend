import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/order/order.entity';
import { UserEntity } from 'src/users/user.entity';
import { OrderReqEntity } from 'src/order/orderreq.entity';
import { OrderSucEntity } from 'src/order/ordersuc.entity';
import { TotalEntity } from 'src/order/total.entity';
import { UsersService } from 'src/users/users.service';
import { OrderService } from 'src/order/order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      UserEntity,
      OrderReqEntity,
      OrderSucEntity,
      TotalEntity,
    ]),
  ],
  providers: [AdminService, UsersService, OrderService],
  controllers: [AdminController],
})
export class AdminModule {}
