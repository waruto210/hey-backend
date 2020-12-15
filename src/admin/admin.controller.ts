import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrderService } from 'src/order/order.service';
import { UsersService } from 'src/users/users.service';

@Controller()
export class AdminController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('api/profiles')
  async getUsersProfile() {
    return await this.usersService.findAll(false);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('order')
  // async getOrders(@Body() cond: Partial<OrderCondDto>) {
  //   return await this.orderService.searchAllOrders(cond);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Post('orderreq')
  // async getOrderReqs(@Body() cond: Partial<OrderReqCondDto>) {
  //   return await this.orderService.searchAllOrderReqs(cond);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Post('stas')
  // async getStatistic(@Body() cond: Partial<StasCondDto>) {
  //   return await this.adminService.getStas(cond);
  // }
}
