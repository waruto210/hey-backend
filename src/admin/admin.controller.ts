import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrderService } from 'src/order/order.service';
import { UsersService } from 'src/users/users.service';
import { OrderConDto, OrderReqConDto } from './search.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private usersService: UsersService,
    private orderService: OrderService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('allprofile')
  async getUsersProfile() {
    return await this.usersService.findAll(false);
  }

  @UseGuards(JwtAuthGuard)
  @Post('order')
  async getOrders(@Body() cond: Partial<OrderConDto>) {
    return await this.orderService.searchAllOrders(cond);
  }

  @UseGuards(JwtAuthGuard)
  @Post('orderreq')
  async getOrderReqs(@Body() cond: Partial<OrderReqConDto>) {
    return await this.orderService.searchAllOrderReqs(cond);
  }
}
