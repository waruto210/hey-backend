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

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('picture'))
  @Post('order')
  async pubOrder(
    @UploadedFile() file,
    @User('id') userId: string,
    @Body() data: Partial<OrderDTO>,
  ) {
    Logger.log(`file is ${file}`, 's');
    return await this.orderService.add(userId, file, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('order')
  async updateOrder(@Query('id') orderId, @Body() data: Partial<OrderDTO>) {
    Logger.log(`data is ${data.type}`, 'Order');
    return await this.orderService.update(orderId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('order')
  async showOrders(@User('id') userId: string) {
    return await this.orderService.showAll(userId);
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
    @Body('agree') agree: boolean,
  ) {
    return await this.orderService.handleOrderReq(orderId, reqId, agree);
  }

  @UseGuards(JwtAuthGuard)
  @Get('orderreq')
  async showAllOrders() {
    return await this.orderService.showAll('');
  }
  @UseGuards(JwtAuthGuard)
  @Post('orderreq')
  async createOrderReq(@User('id') userId: string, @Body() data: OrderReqDTO) {
    return await this.orderService.creatOrderReq(userId, data);
  }
}
