import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthToken, JwtDto, JwtPayload } from './dto/auth.dto';
import { pick } from 'lodash';
@Injectable()
export class AuthService {
  private readonly jwtService: JwtService;
  constructor() {}

  generateAccessToken(jwtPayload: JwtPayload) {
    const payload = this.sanitizeJwtPayload(jwtPayload);
    const accessToken = `Bearer ${this.jwtService.sign(payload)}`;
    return accessToken;
  }

  generateRefereshToken(jwtPayload: JwtPayload) {
    const payload = this.sanitizeJwtPayload(jwtPayload);
    const JWT_SECRET = process.env.JWT_SECRET;
    const refreshToken = this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: '30d',
    });
    return refreshToken;
  }

  generateAuthTokens(jwtPayload: JwtPayload): AuthToken {
    return {
      accessToken: this.generateAccessToken(jwtPayload),
      refreshToken: this.generateRefereshToken(jwtPayload),
    };
  }

  refreshAccessToken(refreshToken: string): AuthToken {
    const JWT_SECRET = process.env.JWT_SECRET;
    let jwtDto: JwtDto;
    try {
      jwtDto = this.jwtService.verify<JwtDto>(refreshToken, {
        secret: JWT_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
    return this.generateAuthTokens(jwtDto);
  }

  sanitizeJwtPayload(jwtPayload: JwtPayload) {
    return pick(jwtPayload, 'id', 'email');
  }
}
