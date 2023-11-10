import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { PasswordService } from 'src/auth/password.service';

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
      },
    });
    return user;
  }
}
