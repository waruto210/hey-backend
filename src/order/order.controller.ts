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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/users.decorator';
import { MissionDTO } from './order.dto';
import { OrderService } from './order.service';
import 'dotenv/config';

@Controller()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post('api/mission')
  async pubMission(@User('id') userId: string, @Body() data: MissionDTO) {
    Logger.log(`userId is ${userId}`, 's');
    return await this.orderService.addMission(userId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('api/mission/:missionId')
  async updateOrder(
    @Param('missionId') missionId,
    @Body() data: Partial<MissionDTO>,
  ) {
    return await this.orderService.updateMission(missionId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/mission/:missionId')
  async showOrders(@User('id') userId, @Param('missionId') missionId) {
    return await this.orderService.findOneMission(userId, missionId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('api/mission/:missionId')
  async deleteOrder(@Param('missionId') missionId) {
    return await this.orderService.deleteMission(missionId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/api/mission/:missionId/applications')
  async getMissionAps(@Param('missionId') missionId: string) {
    // Logger.log(`orderId is ${orderId}`, 'handlereq');
    return await this.orderService.getMissionAps(missionId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/api/mission/application/:applicationId')
  async getAp(
    @User('id') userId,
    @Param('applicationId') applicationId: string,
  ) {
    // Logger.log(`orderId is ${orderId}`, 'handlereq');
    return await this.orderService.getAp(userId, applicationId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/api/mission/application/:applicationId/accept')
  async acceptAp(@Param('applicationId') applicationId: string) {
    // Logger.log(`orderId is ${orderId}`, 'handlereq');
    return await this.orderService.handleAp(applicationId, true);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/api/mission/application/:applicationId/decline')
  async declineAp(@Param('applicationId') applicationId: string) {
    // Logger.log(`orderId is ${orderId}`, 'handlereq');
    return await this.orderService.handleAp(applicationId, false);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/api/mission/:missionId/application')
  async addApplication(
    @User('id') userId: string,
    @Param('missionId') missionId: string,
    @Body('description') description: string,
  ) {
    Logger.log(`userId is: ${userId}`, 'ss');
    return await this.orderService.addApplication(
      userId,
      missionId,
      description,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('/api/mission/:missionId/application/:applicationId')
  async getApplication(
    @Param('applicationId') applicationId: string,
    @Body('description') description: string,
  ) {
    return await this.orderService.updateAp(applicationId, description);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/api/mission/:missionId/application/:applicationId')
  async deleteApplication(@Param('applicationId') applicationId: string) {
    return await this.orderService.deleteApplication(applicationId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/missions')
  async searchMission(
    @Query('owner') owner: string,
    @Query('type') type: string,
    @Query('keyword') keyword: string,
  ) {
    return await this.orderService.searchAllMissions(owner, type, keyword);
  }
}
