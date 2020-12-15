import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/user.entity';
import { OrderController } from './order.controller';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';
import { OrderReqEntity } from './orderreq.entity';
import { OrderSucEntity } from './ordersuc.entity';
import { TotalEntity } from './total.entity';

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
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
