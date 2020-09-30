import { PasswordService } from './../service/password.service';
import { Env } from '../constant/env.constant';
import { User } from '../model/user.model';
import { DBService } from './../service/db.service';
export class TestingLib {
  static readonly TEST_USER = 'testing';
  static readonly NOT_EXISTED_TEST_USER = 'not_existed';

  static async connectToDB() {
    await DBService.getInstance().init({
      dialect: Env.DB_DIALECT,
      host: Env.DB_HOST,
      port: Env.DB_PORT,
      user: Env.DB_USER,
      password: Env.DB_PASSWORD,
      usedDatabase: Env.DB_USED_DATABASE,
      needToSync: Env.DB_SYNC,
      poolSize: Env.DB_POOL_MAX_CONNECTION
    });
  }

  static async closeDBConnection() {
    await DBService.getInstance().closeConnection();
  }

  static async createTestUser() {
    await DBService.getInstance()
      .getConnection()
      .getRepository(User)
      .insert({
        id: TestingLib.TEST_USER,
        username: TestingLib.TEST_USER,
        password: PasswordService.generateSecureHash(TestingLib.TEST_USER),
        isDeleted: false
      });
  }

  static async deleteTestUser() {
    await DBService.getInstance().getConnection().getRepository(User).delete({
      id: TestingLib.TEST_USER
    });
  }
}
