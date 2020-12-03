import { IsNotEmpty, IsString } from 'class-validator';

export class UserDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  phone: string;

  @IsString()
  identity: string;

  @IsString()
  city: string;
}
export class ProfileDTO {
  @IsString()
  password: string;

  @IsString()
  phone: string;

  @IsString()
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
}
