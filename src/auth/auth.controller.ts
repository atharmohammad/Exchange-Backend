import { Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { RegisterDto } from '../user/dto/register.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/user/dto/login.dto';
import { PasswordService } from './password.service';

@Controller('auth')
export class AuthController {
  private readonly userService: UserService;
  private readonly authService: AuthService;
  private readonly passwordService: PasswordService;

  @Post('signup')
  async signup(@Query() data: RegisterDto) {
    const user = await this.userService.signup(data);
    return this.authService.generateAuthTokens(user);
  }

  @Patch('login')
  async login(@Query() data: LoginDto) {
    const user = await this.userService.login(data);
    return this.authService.generateAuthTokens(user);
  }

  @Get('refresh-token/:refresh-token')
  async refreshAccessToken(@Query() refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }

  @Get('request/one-time-password/:address')
  async requestOneTimePassword(@Query() address: string) {
    return this.passwordService.generateOneTimePassword(address);
  }

  @Get('connect-wallet/:address/:encoding')
  async connectWallet(@Query() address: string, @Query() encoding: string) {
    return this.authService.connectWallet(address, encoding);
  }
}
