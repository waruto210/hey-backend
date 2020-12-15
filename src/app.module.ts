import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { OrderModule } from './order/order.module';
import { AdminModule } from './admin/admin.module';
import { OrderService } from './order/order.service';
import { AdminController } from './admin/admin.controller';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot(),
    OrderModule,
    AdminModule,
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    AdminController,
  ],
  providers: [AppService],
})
export class AppModule {}
