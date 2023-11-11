import { Controller, Post, Query } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly userService: UserService;
  private readonly authService: AuthService;
  @Post('signup')
  async signup(@Query() data: RegisterDto) {
    const user = await this.userService.signup(data);
    return this.authService.generateAuthTokens(user);
  }
}
