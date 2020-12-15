import { UserRO } from 'src/users/user.dto';

export class OrderDTO {
  type: string;
  name: string;
  description: string;
  picture: string;
  people: number;
  deadline: Date;
}

export class OrderRO {
  id: string;
  owner: UserRO;
  type: string;
  name: string;
  description: string;
  people: number;
  deadline: Date;
  picture: string;
  created: Date;
  updated: Date;
  state: string;
  commit: number;
}

export class OrderReqDTO {
  orderId: string;
  description: string;
}
