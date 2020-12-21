import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    return await this.usersService.login(username, pass);
  }

  async login(user: any) {
    const realuser = await this.userRepository.findOne({
      username: user.username,
    });
    const payload = { username: realuser.username, sub: realuser.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
