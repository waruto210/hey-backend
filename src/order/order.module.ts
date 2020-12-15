import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
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
    // MulterModule.register({
    //   storage: diskStorage({
    //     destination: `./fileUpload/${dayjs().format('YYYY-MM-DD')}`,
    //     filename: (req, file, cb) => {
    //       // 自定义文件名
    //       const filename = `${nuid.next()}.${file.mimetype.split('/')[1]}`;
    //       return cb(null, filename);
    //     },
    //   }),
    // }),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
