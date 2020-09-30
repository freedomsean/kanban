import { LoginInfoError } from '../exception/auth.exception';
import { PasswordService } from './password.service';
import { UserRepository } from '../repository/user.repository';
import { PassportService } from './passport.service';

export class AuthService {
  /**
   * Login by username and password.
   *
   * @param {string} username - Username.
   * @param {string} password - Password.
   */
  static async login(username: string, password: string): Promise<{ id: string; username: string; token: string }> {
    const user = await UserRepository.getUserByUsername(username);
    if (!user || !PasswordService.compareSecureHash(password, user.password)) {
      throw new LoginInfoError();
    }

    return {
      username,
      id: user.id,
      token: PassportService.sign({ id: user.id, username })
    };
  }
}
