import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    return await this.usersService.login(username, pass);
  }

  async login(user: any) {
    const realuser = await this.usersService.findOne(user.username);
    const payload = { username: realuser.username, sub: realuser.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
