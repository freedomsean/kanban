import { DBService } from './../service/db.service';
import { User } from '../model/user.model';

export class UserRepository {
  /**
   * Get user by username, if it had.
   *
   * @param {string} username - Username.
   */
  static async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await DBService.getInstance()
      .getConnection()
      .getRepository(User)
      .findOne({
        select: ['id', 'password', 'defaultKanbanId'],
        where: {
          isDeleted: false,
          username
        },
        relations: ['usersKanbans']
      });

    return user;
  }
}
