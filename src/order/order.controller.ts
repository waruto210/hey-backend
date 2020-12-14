import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/users.decorator';
import { OrderDTO } from './order.dto';
import { OrderService } from './order.service';
import 'dotenv/config';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('picture'))
  @Post('order-owner')
  async pubOrder(
    @UploadedFile() file,
    @User('id') userId: string,
    @Body() data: Partial<OrderDTO>,
  ) {
    return await this.orderService.add(userId, file, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('order-owner')
  async updateOrder(@Param('id') orderId, @Body() data: OrderDTO) {
    Logger.log(`data is ${data.type}`, 'Order');
    return await this.orderService.update(orderId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('order-owner')
  async showOrders(@User('id') userId: string) {
    return await this.orderService.showAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('order-owner')
  async deleteOrder(@Param('id') orderId: string) {
    return await this.orderService.delete(orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('order-receiver')
  async showAllOrders() {
    return await this.orderService.showAll('');
  }
}
