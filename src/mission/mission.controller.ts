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
import { MissionDTO } from './mission.dto';
import { MissionService } from './mission.service';
import 'dotenv/config';

@Controller('api')
export class MissionController {
  private logger = new Logger('MissionController');
  constructor(private missionService: MissionService) {}

  @UseGuards(JwtAuthGuard)
  @Post('mission')
  async pubMission(@User('id') userId: string, @Body() data: MissionDTO) {
    this.logger.log(`userId: ${userId}, data: ${data}`);
    return await this.missionService.addMission(userId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('mission/:missionId')
  async updateOrder(
    @Param('missionId') missionId,
    @Body() data: Partial<MissionDTO>,
  ) {
    this.logger.log(`missionId: ${missionId}, data: ${data}`);
    return await this.missionService.updateMission(missionId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mission/:missionId')
  async showOrders(@User('id') userId, @Param('missionId') missionId) {
    this.logger.log(`userId: ${userId}, missionId: ${missionId}`);
    return await this.missionService.findOneMission(userId, missionId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('mission/:missionId')
  async deleteOrder(@Param('missionId') missionId) {
    this.logger.log(`missionId: ${missionId}`);
    return await this.missionService.deleteMission(missionId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mission/:missionId/applications')
  async getMissionAps(@Param('missionId') missionId: string) {
    this.logger.log(`missionId: ${missionId}`);
    return await this.missionService.getMissionApplications(missionId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mission/application/:applicationId')
  async getAp(
    @User('id') userId,
    @Param('applicationId') applicationId: string,
  ) {
    this.logger.log(`userId: ${userId}, applicationId: ${applicationId}`);
    return await this.missionService.getApplication(userId, applicationId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mission/application/:applicationId/accept')
  async acceptAp(@Param('applicationId') applicationId: string) {
    this.logger.log(`applicationId: ${applicationId}`);
    return await this.missionService.handleApplication(applicationId, true);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mission/application/:applicationId/decline')
  async declineAp(@Param('applicationId') applicationId: string) {
    this.logger.log(`applicationId: ${applicationId}`);
    return await this.missionService.handleApplication(applicationId, false);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mission/:missionId/application')
  async addApplication(
    @User('id') userId: string,
    @Param('missionId') missionId: string,
    @Body('description') description: string,
  ) {
    this.logger.log(
      `userId: ${userId}, missionId: ${missionId}, description: ${description}`,
    );
    return await this.missionService.addApplication(
      userId,
      missionId,
      description,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('mission/:missionId/application/:applicationId')
  async getApplication(
    @Param('applicationId') applicationId: string,
    @Body('description') description: string,
  ) {
    this.logger.log(
      `applicationId: ${applicationId}, description: ${description}`,
    );
    return await this.missionService.updateApplication(
      applicationId,
      description,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('mission/:missionId/application/:applicationId')
  async deleteApplication(@Param('applicationId') applicationId: string) {
    this.logger.log(`applicationId: ${applicationId}`);
    return await this.missionService.deleteApplication(applicationId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('missions')
  async searchMission(
    @Query('owner') owner: string,
    @Query('type') type: string,
    @Query('keyword') keyword: string,
  ) {
    this.logger.log(`owner: ${owner}, type: ${type}, keyword: ${keyword}`);
    return await this.missionService.searchMissions(owner, type, keyword);
  }
}
