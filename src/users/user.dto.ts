import { MissionRO } from 'src/mission/mission.dto';

export class UserDTO {
  username: string;
  password: string;
  phone: string;
  identity: string;
  city: string;
}
export class ProfileDTO {
  oldPassword: string;
  password: string;
  phone: string;
  description: string;
  city: string;
}
export class UserRO {
  id: string;
  username: string;
  name: string;
  identityType: string;
  identity: string;
  phone: string;
  level: number;
  description: string;
  city: string;
  isadmin: boolean;
  missions: MissionRO;
}
