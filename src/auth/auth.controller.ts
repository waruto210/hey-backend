import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserDTO } from 'src/users/user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() user) {
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() data: UserDTO) {
    const user = await this.usersService.register(data);
    return this.authService.login(user);
  }
}
