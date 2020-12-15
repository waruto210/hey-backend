export class UserDTO {
  username: string;
  password: string;
  phone: string;
  identity: string;
  city: string;
}
export class ProfileDTO {
  password: string;
  phone: string;
  description: string;
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
}
