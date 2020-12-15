import { UserRO } from 'src/users/user.dto';

export class MissionDTO {
  type: string;
  title: string;
  description: string;
  picture: string;
  people: number;
  deadline: Date;
}

export class MissionRO {
  id: string;
  owner: UserRO;
  type: string;
  title: string;
  description: string;
  people: number;
  deadline: Date;
  picture: string;
  created: Date;
  updated: Date;
  state: string;
  commit: number;
  isOwner: boolean;
}
