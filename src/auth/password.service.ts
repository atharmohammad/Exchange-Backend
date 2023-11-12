import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { PrismaService } from 'nestjs-prisma';
import { SIGN_IN_MESSAGE } from '../constants';

export class PasswordService {
  private readonly prisma: PrismaService;
  constructor() {}

  async hash(password: string) {
    const hash = await bcrypt.hash(password, process.env.SALT);
    return hash;
  }

  async compare(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async generateOneTimePassword(address: string) {
    const nonce = uuid();
    await this.prisma.wallet.upsert({
      where: { address },
      update: { nonce },
      create: { address, nonce },
    });
    return `${SIGN_IN_MESSAGE} ${nonce}`;
  }
}
