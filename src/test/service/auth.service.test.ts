import { AuthService } from '../../service/auth.service';
import { TestingLib } from '../testing.lib';
import * as jwt from 'jsonwebtoken';
import { Env } from '../../constant/env.constant';

describe('Test AuthService', () => {
  describe('Test login', () => {
    beforeEach(async () => {
      await TestingLib.connectToDB();
      await TestingLib.createTestUser();
    });

    afterEach(async () => {
      await TestingLib.deleteTestUser();
      await TestingLib.closeDBConnection();
    });

    test('happy path', async () => {
      const info = await AuthService.login(TestingLib.TEST_USER, TestingLib.TEST_USER);
      expect(info.user.id).toBe(TestingLib.TEST_USER);
      expect(info.user.username).toBe(TestingLib.TEST_USER);
      const jwtInfo: any = jwt.verify(info.token, Env.JWT_SECRET);
      expect(jwtInfo.sub).toBe(TestingLib.TEST_USER);
    });
  });
});
