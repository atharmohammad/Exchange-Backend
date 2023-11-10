import { Controller, Post, Query } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  private readonly userService: UserService;
  @Post('signup')
  async signup(@Query() data: RegisterDto) {
    const user = await this.userService.signup(data);
    // generate and return access and refresh tokens
  }
}
