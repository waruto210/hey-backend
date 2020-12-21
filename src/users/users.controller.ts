import {
  Controller,
  Get,
  UseGuards,
  Put,
  Body,
  Param,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProfileDTO } from './user.dto';
import { User } from './users.decorator';
import { UsersService } from './users.service';

@Controller('api/profile')
export class UsersController {
  private logger = new Logger('UsersController');
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getProfile(@User('id') userId: string) {
    this.logger.log(`here userId: ${userId}`);
    return await this.usersService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('')
  async chProfile(@User('id') userId, @Body() data: Partial<ProfileDTO>) {
    this.logger.log(`userId: ${userId}, data: ${data.description}`);
    return await this.usersService.update(userId, data);
  }
}
