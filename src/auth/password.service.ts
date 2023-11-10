import * as bcrypt from 'bcrypt';

export class PasswordService {
  constructor() {}

  async hash(password: string) {
    const hash = await bcrypt.hash(password, process.env.SALT);
    return hash;
  }
}
