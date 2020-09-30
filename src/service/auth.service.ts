import { LoginInfoError } from '../exception/auth.exception';
import { PasswordService } from './password.service';
import { UserRepository } from '../repository/user.repository';
import { PassportService } from './passport.service';
import { TOKEN_TYPE_BEARER } from '../constant/login.constant';

export class AuthService {
  /**
   * Login by username and password.
   *
   * @param {string} username - Username.
   * @param {string} password - Password.
   */
  static async login(
    username: string,
    password: string
  ): Promise<{ user: { id: string; username: string }; tokenType: string; token: string }> {
    const user = await UserRepository.getUserByUsername(username);
    if (!user || !PasswordService.compareSecureHash(password, user.password)) {
      throw new LoginInfoError();
    }

    return {
      user: {
        id: user.id,
        username
      },
      tokenType: TOKEN_TYPE_BEARER,
      token: PassportService.sign({ id: user.id, username })
    };
  }
}
