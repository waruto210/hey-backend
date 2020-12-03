import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    // const user = await this.usersService.findOne(username);
    // if (user && bcrypt.compare(pass, user.password)) {
    //   const { password, ...result } = user;
    //   return result;
    // }
    // return null;
    return await this.usersService.login(username, pass);
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    Logger.log(`payload is ${payload.sub}`, 'here');
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
