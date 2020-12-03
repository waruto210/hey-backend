import {
  Body,
  Controller,
  Get,
  Logger,
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
  @Post('publish')
  async pubOrder(
    @UploadedFile() file,
    @User('id') userId: string,
    @Body() data: Partial<OrderDTO>,
  ) {
    return await this.orderService.add(userId, file, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('publish')
  async updateOrder(@Body() data: OrderDTO) {
    Logger.log(`data is ${data.type}`, 'Order');
    return await this.orderService.update(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('showall')
  async showOrders(@User('id') userId: string) {
    return await this.orderService.showAll(userId);
  }
}
