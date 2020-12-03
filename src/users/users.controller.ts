import { Controller, Get, UseGuards, Request, Put, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProfileDTO } from './user.dto';
import { User } from './users.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@User('id') userId: string) {
    return this.usersService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async chProfile(@User('id') userId, @Body() data: Partial<ProfileDTO>) {
    return await this.usersService.update(userId, data);
  }
}
