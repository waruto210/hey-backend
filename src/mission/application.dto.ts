import { UserRO } from 'src/users/user.dto';
import { MissionRO } from './mission.dto';

export class ApplicationRo {
  id: string;
  apuser: UserRO;
  description: string;
  state: string;
  isOwner: boolean;
  mission: MissionRO;
}
