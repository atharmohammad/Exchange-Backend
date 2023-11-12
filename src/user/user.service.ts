import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { RegisterDto } from 'src/user/dto/register.dto';
import { PasswordService } from 'src/auth/password.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  private readonly passwordService: PasswordService;

  constructor(private readonly prisma: PrismaService) {}

  async signup(data: RegisterDto) {
    const hashedPassword = await this.passwordService.hash(data.password);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        lastActive: new Date(),
      },
    });
    return user;
  }

  async login(data: LoginDto) {
    const { email, password } = data;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!this.passwordService.compare(password, user.password)) {
      throw new UnauthorizedException();
    }
    return await this.prisma.user.update({
      where: { email },
      data: { lastActive: new Date() },
    });
  }
}
