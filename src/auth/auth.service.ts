import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthToken, JwtDto, JwtPayload } from './dto/auth.dto';
import { pick } from 'lodash';
import { PrismaService } from 'nestjs-prisma';
import * as nacl from 'tweetnacl';
import { SIGN_IN_MESSAGE } from '../constants';

@Injectable()
export class AuthService {
  private readonly jwtService: JwtService;
  private readonly prisma: PrismaService;
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

  async connectWallet(address: string, encoding: string) {
    try {
      const wallet = await this.prisma.wallet.findUnique({
        where: { address },
      });
      if (!wallet) {
        throw new NotFoundException(`No wallet found with address ${address}`);
      }
      const message = `${SIGN_IN_MESSAGE}${wallet.nonce}`;
      const isVerified = nacl.sign.detached.verify(
        Buffer.from(message),
        Buffer.from(encoding),
        Buffer.from(address),
      );
      if (!isVerified) {
        throw new UnauthorizedException('Message signature is incorrect');
      }
      return address;
    } catch (error) {
      console.log(`Failed to connect wallet ${error}`);
    }
  }

  sanitizeJwtPayload(jwtPayload: JwtPayload) {
    return pick(jwtPayload, 'id', 'email');
  }
}
