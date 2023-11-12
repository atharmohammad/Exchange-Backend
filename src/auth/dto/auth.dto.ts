import { UserDto } from 'src/user/dto/user.dto';

export type JwtPayload = {
  id: UserDto['id'];
  email: UserDto['email'];
};

export type AuthToken = {
  accessToken: string;
  refreshToken: string;
};

export type JwtDto = JwtPayload & {
  iat: number;
  exp: number;
};
