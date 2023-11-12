import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthToken, JwtPayload } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly jwtService: JwtService;
  constructor() {}

  generateAccessToken(jwtPayload: JwtPayload) {
    const accessToken = this.jwtService.sign(jwtPayload);
    return accessToken;
  }

  generateRefereshToken(jwtPayload: JwtPayload) {
    const JWT_SECRET = process.env.JWT_SECRET;
    const refreshToken = this.jwtService.sign(jwtPayload, {
      secret: JWT_SECRET,
      expiresIn: 24 * 3600,
    });
    return refreshToken;
  }

  generateAuthTokens(jwtPayload: JwtPayload): AuthToken {
    return {
      accessToken: this.generateAccessToken(jwtPayload),
      refreshToken: this.generateRefereshToken(jwtPayload),
    };
  }
}
