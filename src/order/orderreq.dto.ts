import { UserRO } from 'src/users/user.dto';

export class OrderReqRo {
  id: string;
  apuser: UserRO;
  description: string;
  state: string;
  isOwner: boolean;
}
