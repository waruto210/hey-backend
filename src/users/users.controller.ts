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
import { UsersService } from './users.service';

@Controller('api/profile')
export class UsersController {
  private logger = new Logger('UsersController');
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  async getProfile(@Param('username') username: string) {
    this.logger.log(`username: ${username}`);
    return this.usersService.findOne(username);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':username')
  async chProfile(
    @Param('username') username,
    @Body() data: Partial<ProfileDTO>,
  ) {
    this.logger.log(`username: ${username}, data: ${data}`);
    return await this.usersService.update(username, data);
  }
}
