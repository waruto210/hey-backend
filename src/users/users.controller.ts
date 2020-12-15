import { Controller, Get, UseGuards, Put, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProfileDTO } from './user.dto';
import { User } from './users.decorator';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('api/profile/:username')
  async getProfile(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @UseGuards(JwtAuthGuard)
  @Put('api/profile/:username')
  async chProfile(
    @Param('username') username,
    @Body() data: Partial<ProfileDTO>,
  ) {
    return await this.usersService.update(username, data);
  }
}
