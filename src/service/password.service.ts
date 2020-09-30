import * as bcrypt from 'bcryptjs';
import { Env } from '../constant/env.constant';

export class PasswordService {
  /**
   * Compare password by bcrypt.
   *
   * @param {string} password - Password.
   * @param {string} hash - Hash.
   */
  static compareSecureHash(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  /**
   * Generate hash by bcrypt.
   *
   * @param {string} password - Password.
   */
  static generateSecureHash(password: string): string {
    const salt = bcrypt.genSaltSync(Env.SALT_ROUNDS);
    return bcrypt.hashSync(password, salt);
  }
}
