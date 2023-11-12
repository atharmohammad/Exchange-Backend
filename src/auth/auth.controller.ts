import { Controller, Patch, Post, Query } from '@nestjs/common';
import { RegisterDto } from '../user/dto/register.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/user/dto/login.dto';

@Controller('auth')
export class AuthController {
  private readonly userService: UserService;
  private readonly authService: AuthService;
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
}
