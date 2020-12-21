import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { ProfileDTO, UserDTO, UserRO } from './user.dto';
import * as bcrypt from 'bcryptjs';

export type User = any;

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async login(username: string, password: string): Promise<UserRO> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && bcrypt.compare(password, user.password)) {
      return user.toResponseObject();
    }
    return null;
  }

  async register(data: UserDTO): Promise<UserEntity | undefined> {
    const { username } = data;
    let user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    user = this.userRepository.create(data);
    await this.userRepository.save(user);
    return user;
  }

  async update(userId, data: Partial<ProfileDTO>): Promise<UserRO> {
    let user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('User do not exists', HttpStatus.BAD_REQUEST);
    }
    if (data.oldPassword && data.password) {
      if (bcrypt.compare(data.oldPassword, user.password)) {
        user.password = await bcrypt.hash(data.password, 10);
        await this.userRepository.save(user);
      }
    }
    if (data.description) {
      user.description = data.description;
      await this.userRepository.save(user);
    }
    if (data.phone) {
      user.phone = data.phone;
      await this.userRepository.save(user);
    }
    if (data.city) {
      user.city = data.city;
      await this.userRepository.save(user);
    }
    user = await this.userRepository.findOne({ id: userId });
    return user.toResponseObject();
  }

  async findOne(userId: string, showId = true): Promise<UserRO> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['missions'],
    });
    Logger.log(`user is ${user}`, 'ni');
    if (!user) {
      throw new HttpException('User do not exists', HttpStatus.BAD_REQUEST);
    }
    return user.toResponseObject(showId);
  }

  async findAll(showId = true): Promise<UserRO[]> {
    const users = await this.userRepository.find({ isadmin: false });
    return users.map(x => x.toResponseObject(showId));
  }
}
