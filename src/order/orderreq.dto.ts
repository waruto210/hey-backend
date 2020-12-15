import { UserRO } from 'src/users/user.dto';

export class OrderReqRo {
  id: string;
  requser: UserRO;
  description: string;
  state: number;
}
