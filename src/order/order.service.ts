import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { MissionDTO, MissionRO } from './order.dto';
import { OrderEntity } from './order.entity';
import 'dotenv/config';
import { OrderReqRo } from './orderreq.dto';
import { OrderReqEntity } from './orderreq.entity';
import { OrderSucEntity } from './ordersuc.entity';
import { TotalEntity } from './total.entity';
import { OrderReqCondDto } from 'src/admin/search.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(OrderReqEntity)
    private orderReqRepository: Repository<OrderReqEntity>,
    @InjectRepository(OrderSucEntity)
    private orderSucRepository: Repository<OrderSucEntity>,
    @InjectRepository(TotalEntity)
    private totalRepository: Repository<TotalEntity>,
  ) {}

  async checkMissionState(orders: OrderEntity[]) {
    // Logger.log(`order state update`, 'ss');
    const now = new Date();
    for (const order of orders) {
      // Logger.log(`order state ${typeof order.deadline} `, 'ss');
      const ddl = new Date(order.deadline);
      if (ddl <= now) {
        // Logger.log(`order state update`, 'ss');
        order.state = 3;
        await this.orderRepository.save(order);
      }
    }
    return orders;
  }

  async addMission(userId: string, data: MissionDTO): Promise<MissionRO> {
    const user = await this.usersRepository.findOne({ id: userId });

    if (new Date(data.deadline) < new Date()) {
      throw new HttpException('ddl is too early', HttpStatus.BAD_REQUEST);
    }
    let order = this.orderRepository.create({
      ...data,
      owner: user,
    });
    order = await this.orderRepository.save(order);
    order = await this.orderRepository.findOne({
      where: { id: order.id },
      relations: ['owner'],
    });
    return order.toResponseObject(true);
  }

  async updateMission(orderId: string, data: Partial<MissionDTO>) {
    let order = await this.orderRepository.findOne({
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
    await this.orderRepository.update({ id: orderId }, data);
    order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['owner'],
    });
    return order.toResponseObject(true);
  }

  async findOneMission(userId: string, missionId: string): Promise<MissionRO> {
    let mission = await this.orderRepository.findOne({
      where: { id: missionId },
    });
    if (!mission) {
      throw new HttpException('Mission do not exist', HttpStatus.BAD_REQUEST);
    }
    await this.checkMissionState([mission])[0];
    mission = await this.orderRepository.findOne({
      where: { id: missionId },
      relations: ['owner'],
    });
    const isOwner = mission.owner.id == userId;
    return mission.toResponseObject(isOwner);
  }

  async showAllOrders(userId: string): Promise<MissionRO[]> {
    let orders: OrderEntity[];
    if (userId !== '') {
      const user = await this.usersRepository.findOne({ id: userId });
      orders = await this.orderRepository.find({
        where: { owner: user },
      });
    } else {
      // 接令者查看，只给看待接的
      orders = await this.orderRepository.find({
        where: { state: 0 },
      });
    }
    orders = await this.checkMissionState(orders);
    // orders = await Promise.all(orders.map(order => this.signUrl(order)));
    return orders.map(order => order.toResponseObject());
  }

  async searchAllMissions(
    owner: string,
    type: string,
    keyword: string,
  ): Promise<MissionRO[]> {
    let missions = await this.orderRepository.find({ relations: ['owner'] });
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

  async searchAllOrderReqs(
    cond: Partial<OrderReqCondDto>,
  ): Promise<OrderReqRo[]> {
    const states = ['待处理', '同意', '拒绝', '取消'];
    let orderReqs = await this.orderReqRepository.find({
      relations: ['reqUser'],
    });

    if (cond.from) {
      orderReqs = orderReqs.filter(
        x => new Date(x.created) >= new Date(cond.from),
      );
    }
    if (cond.to) {
      orderReqs = orderReqs.filter(
        x => new Date(x.created) >= new Date(cond.from),
      );
    }
    if (cond.state) {
      orderReqs = orderReqs.filter(x => states[x.state] == cond.state);
    }

    return orderReqs.map(order => order.toResponseObject());
  }

  async deleteMission(orderId: string) {
    let mission = await this.orderRepository.findOne({
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
    await this.orderRepository.save(mission);
    mission = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    return mission.toResponseObject();
  }

  async getMissionAps(missionId: string): Promise<OrderReqRo[]> {
    const mission = await this.orderRepository.findOne({
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
          await this.orderReqRepository.findOne({
            where: { id: x.id },
            relations: ['apUser'],
          }),
      ),
    );
    return apsTmp.map(x => x.toResponseObject());
  }

  async getAp(userId: string, applicationId: string): Promise<OrderReqRo> {
    const application = await this.orderReqRepository.findOne({
      where: { id: applicationId },
      relations: ['apUser'],
    });
    if (!application) {
      throw new HttpException('application not exist', HttpStatus.BAD_REQUEST);
    }
    return application.toResponseObject(application.apUser.id == userId);
  }

  async handleAp(applicationId: string, agree: boolean) {
    let ap = await this.orderReqRepository.findOne({
      where: { id: applicationId },
      relations: ['apUser', 'mission'],
    });
    if (!ap) {
      throw new HttpException(
        'Application do not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Logger.log(
    //   `agree is ${agree}, ${typeof agree}, ${agree == true}, state is ${
    //     req.state
    //   }`,
    //   's',
    // );
    if (agree == true) {
      if (ap.state >= 1) {
        throw new HttpException(
          'Application already handled!',
          HttpStatus.BAD_REQUEST,
        );
      }
      ap.state = 1;

      const mission = await this.orderRepository.findOne({
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
      ap = await this.orderReqRepository.save(ap);

      const orderSuc = this.orderSucRepository.create({
        application: ap,
        apUser: ap.apUser,
        owner: mission.owner,
        finishDate: new Date(),
        pay: 3,
        commission: 1,
      });
      let total = await this.totalRepository.findOne({
        where: {
          city: mission.owner.city,
          type: mission.type,
          date: new Date(),
        },
      });
      if (!total) {
        total = this.totalRepository.create({
          city: mission.owner.city,
          type: mission.type,
          date: new Date(),
          count: 0,
          income: 0,
        });
      }
      total.count += 1;
      total.income += 1;
      await this.totalRepository.save(total);
      // 任务完成
      await this.orderSucRepository.save(orderSuc);
      if (mission.commit == mission.people) {
        // 召集令完成
        mission.state = 1;
      }
      await this.orderRepository.save(mission);

      return orderSuc;
    } else {
      ap.state = 2;
      await this.orderReqRepository.save(ap);
    }
  }

  async addApplication(userId: string, missionId: string, description: string) {
    const order = await this.orderRepository.findOne({
      where: { id: missionId },
    });
    if (!order) {
      throw new HttpException('Order do not exist', HttpStatus.BAD_REQUEST);
    }
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new HttpException('User do not exist', HttpStatus.BAD_REQUEST);
    }
    let application = this.orderReqRepository.create({
      mission: order,
      description: description,
      apUser: user,
    });
    application = await this.orderReqRepository.save(application);
    application = await this.orderReqRepository.findOne({
      where: { id: application.id },
      relations: ['apUser'],
    });
    return application.toResponseObject();
  }

  async updateAp(applicationId: string, description: string) {
    let orderReq = await this.orderReqRepository.findOne({
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
    await this.orderReqRepository.update(
      { id: applicationId },
      { description: description },
    );
    orderReq = await this.orderReqRepository.findOne({
      where: { id: applicationId },
      relations: ['apUser'],
    });
    return orderReq.toResponseObject();
  }

  async deleteApplication(applicationId: string) {
    let application = await this.orderReqRepository.findOne({
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
    await this.orderReqRepository.save(application);
    application = await this.orderReqRepository.findOne({
      where: { id: applicationId },
      relations: ['apUser'],
    });
    return application.toResponseObject();
  }
}
