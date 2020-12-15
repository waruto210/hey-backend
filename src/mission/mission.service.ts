import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { MissionDTO, MissionRO } from './mission.dto';
import { MissionEntity } from './mission.entity';
import 'dotenv/config';
import { ApplicationRo } from './application.dto';
import { ApplicationEntity } from './application.entity';
import { TransactionEntity } from './transaction.entity';
import { StatsEntity } from './stats.entity';

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(MissionEntity)
    private missionRepository: Repository<MissionEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(ApplicationEntity)
    private applicationRepository: Repository<ApplicationEntity>,
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(StatsEntity)
    private statsRepository: Repository<StatsEntity>,
  ) {}

  async checkMissionState(orders: MissionEntity[]) {
    const now = new Date();
    for (const order of orders) {
      const ddl = new Date(order.deadline);
      if (ddl <= now) {
        order.state = 3;
        await this.missionRepository.save(order);
      }
    }
    return orders;
  }

  async addMission(userId: string, data: MissionDTO): Promise<MissionRO> {
    const user = await this.usersRepository.findOne({ id: userId });

    if (new Date(data.deadline) < new Date()) {
      throw new HttpException('ddl is too early', HttpStatus.BAD_REQUEST);
    }
    let order = this.missionRepository.create({
      ...data,
      owner: user,
    });
    order = await this.missionRepository.save(order);
    order = await this.missionRepository.findOne({
      where: { id: order.id },
      relations: ['owner'],
    });
    return order.toResponseObject(true);
  }

  async updateMission(orderId: string, data: Partial<MissionDTO>) {
    let order = await this.missionRepository.findOne({
      where: { id: orderId },
      relations: ['applications'],
    });
    if (!order) {
      throw new HttpException('Order do not exist', HttpStatus.BAD_REQUEST);
    }
    if (order.applications.length > 0) {
      throw new HttpException(
        'Order already has reqs!',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.missionRepository.update({ id: orderId }, data);
    order = await this.missionRepository.findOne({
      where: { id: orderId },
      relations: ['owner'],
    });
    return order.toResponseObject(true);
  }

  async findOneMission(userId: string, missionId: string): Promise<MissionRO> {
    let mission = await this.missionRepository.findOne({
      where: { id: missionId },
    });
    if (!mission) {
      throw new HttpException('Mission do not exist', HttpStatus.BAD_REQUEST);
    }
    await this.checkMissionState([mission])[0];
    mission = await this.missionRepository.findOne({
      where: { id: missionId },
      relations: ['owner'],
    });
    const isOwner = mission.owner.id == userId;
    return mission.toResponseObject(isOwner);
  }

  async searchMissions(
    owner: string,
    type: string,
    keyword: string,
  ): Promise<MissionRO[]> {
    let missions = await this.missionRepository.find({ relations: ['owner'] });
    if (owner) {
      missions = missions.filter(x => x.owner.username == owner);
    }
    if (type) {
      missions = missions.filter(x => x.type == type);
    }
    if (keyword) {
      missions = missions.filter(x => x.title.indexOf(keyword) != -1);
    }

    return missions.map(x => x.toResponseObject());
  }

  async deleteMission(orderId: string) {
    let mission = await this.missionRepository.findOne({
      where: { id: orderId },
      relations: ['applications'],
    });
    if (!mission) {
      throw new HttpException('Order do not exist', HttpStatus.BAD_REQUEST);
    }
    if (mission.applications.length > 0) {
      throw new HttpException(
        'Order already has reqs!',
        HttpStatus.BAD_REQUEST,
      );
    }
    mission.state = 2;
    await this.missionRepository.save(mission);
    mission = await this.missionRepository.findOne({
      where: { id: orderId },
    });
    return mission.toResponseObject();
  }

  async getMissionApplications(missionId: string): Promise<ApplicationRo[]> {
    const mission = await this.missionRepository.findOne({
      where: { id: missionId },
      relations: ['applications'],
    });
    if (!mission) {
      throw new HttpException('Order do not exist', HttpStatus.BAD_REQUEST);
    }
    const aps = mission.applications;
    const apsTmp = await Promise.all(
      aps.map(
        async x =>
          await this.applicationRepository.findOne({
            where: { id: x.id },
            relations: ['apUser', 'mission'],
          }),
      ),
    );
    return apsTmp.map(x => x.toResponseObject());
  }

  async getApplication(
    userId: string,
    applicationId: string,
  ): Promise<ApplicationRo> {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['apUser'],
    });
    if (!application) {
      throw new HttpException('application not exist', HttpStatus.BAD_REQUEST);
    }
    return application.toResponseObject(application.apUser.id == userId);
  }

  async handleApplication(applicationId: string, agree: boolean) {
    let ap = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['apUser', 'mission'],
    });
    if (!ap) {
      throw new HttpException(
        'Application do not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (agree == true) {
      if (ap.state >= 1) {
        throw new HttpException(
          'Application already handled!',
          HttpStatus.BAD_REQUEST,
        );
      }
      ap.state = 1;

      const mission = await this.missionRepository.findOne({
        where: { id: ap.mission.id },
        relations: ['owner'],
      });
      mission.commit += 1;
      if (mission.commit > mission.people) {
        throw new HttpException(
          'Mission already finsh!',
          HttpStatus.BAD_REQUEST,
        );
      }
      ap = await this.applicationRepository.save(ap);

      const orderSuc = this.transactionRepository.create({
        application: ap,
        apUser: ap.apUser,
        owner: mission.owner,
        finishDate: new Date(),
        pay: 3,
        commission: 1,
      });
      let total = await this.statsRepository.findOne({
        where: {
          city: mission.owner.city,
          type: mission.type,
          date: new Date(),
        },
      });
      if (!total) {
        total = this.statsRepository.create({
          city: mission.owner.city,
          type: mission.type,
          date: new Date(),
          count: 0,
          income: 0,
        });
      }
      total.count += 1;
      total.income += 1;
      await this.statsRepository.save(total);
      // 任务完成
      await this.transactionRepository.save(orderSuc);
      if (mission.commit == mission.people) {
        // 召集令完成
        mission.state = 1;
      }
      await this.missionRepository.save(mission);
    } else {
      ap.state = 2;
      await this.applicationRepository.save(ap);
    }
    return {
      msg: 'ok',
    };
  }

  async addApplication(userId: string, missionId: string, description: string) {
    const order = await this.missionRepository.findOne({
      where: { id: missionId },
    });
    if (!order) {
      throw new HttpException('Order do not exist', HttpStatus.BAD_REQUEST);
    }
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new HttpException('User do not exist', HttpStatus.BAD_REQUEST);
    }
    let application = this.applicationRepository.create({
      mission: order,
      description: description,
      apUser: user,
    });
    application = await this.applicationRepository.save(application);
    application = await this.applicationRepository.findOne({
      where: { id: application.id },
      relations: ['apUser'],
    });
    return application.toResponseObject();
  }

  async updateApplication(applicationId: string, description: string) {
    let orderReq = await this.applicationRepository.findOne({
      where: { id: applicationId },
    });
    if (!orderReq) {
      throw new HttpException('OrderReq do not exist', HttpStatus.BAD_REQUEST);
    }
    if (orderReq.state != 0) {
      throw new HttpException(
        'Application has already been handled!',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.applicationRepository.update(
      { id: applicationId },
      { description: description },
    );
    orderReq = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['apUser'],
    });
    return orderReq.toResponseObject();
  }

  async deleteApplication(applicationId: string) {
    let application = await this.applicationRepository.findOne({
      where: { id: applicationId },
    });
    if (!application) {
      throw new HttpException('OrderReq do not exist', HttpStatus.BAD_REQUEST);
    }
    if (application.state != 0) {
      throw new HttpException(
        'Application has already been handled!',
        HttpStatus.BAD_REQUEST,
      );
    }
    application.state = 3;
    await this.applicationRepository.save(application);
    application = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['apUser'],
    });
    return application.toResponseObject();
  }
}
