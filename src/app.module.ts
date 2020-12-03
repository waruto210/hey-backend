import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [AuthModule, UsersModule, TypeOrmModule.forRoot(), OrderModule],
  controllers: [AppController, AuthController, UsersController],
  providers: [AppService],
})
export class AppModule {}
