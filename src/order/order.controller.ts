import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/users.decorator';
import { OrderDTO, OrderReqDTO } from './order.dto';
import { OrderService } from './order.service';
import 'dotenv/config';
import { identity } from 'rxjs';

@Controller('api/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post('order')
  async pubOrder(@User('id') userId, @Body() data: OrderDTO) {
    // Logger.log(`userId is ${userId}`, 's');
    return await this.orderService.add(userId, data);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('picture'))
  @Post('image')
  async addImage(@UploadedFile() file) {
    return await this.orderService.addImage(file);
  }

  @UseGuards(JwtAuthGuard)
  @Put('order')
  async updateOrder(@Query('id') orderId, @Body() data: Partial<OrderDTO>) {
    // Logger.log(`data is ${data.type}`, 'Order');
    return await this.orderService.update(orderId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('order')
  async showOrders(@User('id') userId: string) {
    return await this.orderService.showAllOrders(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('order')
  async deleteOrder(@Query('id') orderId: string) {
    return await this.orderService.deleteOrder(orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('handlereq')
  async getOrderReq(@Query('id') orderId: string) {
    // Logger.log(`orderId is ${orderId}`, 'handlereq');
    return await this.orderService.fetchOrderReqs(orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('handlereq')
  async handlereq(
    @Query('orderid') orderId: string,
    @Query('reqid') reqId: string,
    @Query('agree') agree: boolean,
  ) {
    Logger.log(`agree is ${agree}`, 's');
    return await this.orderService.handleOrderReq(orderId, reqId, agree);
  }

  @UseGuards(JwtAuthGuard)
  @Get('orderreq')
  async showAllOrders() {
    return await this.orderService.showAllOrders('');
  }
  @UseGuards(JwtAuthGuard)
  @Post('orderreq')
  async createOrderReq(@User('id') userId: string, @Body() data: OrderReqDTO) {
    return await this.orderService.creatOrderReq(userId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('orderreq')
  async updateOrderReq(
    @Query('id') id: string,
    @Body() data: Partial<OrderReqDTO>,
  ) {
    //Logger.log(`data is ${data.description}`, 'orderreq');
    return await this.orderService.updateOrderReq(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('orderreq')
  async deleteOrderReq(@Query('id') id: string) {
    return await this.orderService.deleteOrderReq(id);
  }
}
