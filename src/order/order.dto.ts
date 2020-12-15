export class OrderDTO {
  type: string;
  name: string;
  description: string;
  people: number;
  deadline: Date;
}

export class OrderRO {
  id: string;
  user: string;
  type: string;
  name: string;
  description: string;
  people: number;
  deadline: Date;
  picture: string;
  created: Date;
  updated: Date;
  state: string;
  reqs: number;
  modify: boolean;
}

export class OrderReqDTO {
  orderId: string;
  description: string;
}
