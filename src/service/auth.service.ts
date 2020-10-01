import { TOKEN_TYPE_BEARER } from './../constant/token.constant';
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
  static async login(
    username: string,
    password: string
  ): Promise<{
    user: { id: string; username: string; defaultKanbanId: string; kanbans: { id: string }[] };
    token: string;
    tokenType: string;
  }> {
    const user = await UserRepository.getUserByUsername(username);
    if (!user || !PasswordService.compareSecureHash(password, user.password)) {
      throw new LoginInfoError();
    }

    return {
      user: {
        id: user.id,
        defaultKanbanId: user.defaultKanbanId,
        username,
        kanbans: user.usersKanbans
          // Filter at there, because I want to avoid from using raw sql in this project. Actually, using raw sql will be easier to control, but it will lost consistency.
          .filter((info) => !info.isDeleted)
          .map((info) => {
            return {
              id: info.kanbanId
            };
          })
      },
      tokenType: TOKEN_TYPE_BEARER,
      token: PassportService.sign({ id: user.id, username })
    };
  }
}
