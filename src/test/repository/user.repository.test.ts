import { PasswordService } from './../../service/password.service';
import { UserRepository } from '../../repository/user.repository';
import { TestingLib } from '../testing.lib';

describe('Test UserRepository', () => {
  describe('Test getUserByUsername', () => {
    beforeEach(async () => {
      await TestingLib.connectToDB();
      await TestingLib.createTestKanban();
    });

    afterEach(async () => {
      await TestingLib.deleteTestUser();
      await TestingLib.closeDBConnection();
    });

    test('happy path', async () => {
      const user = await UserRepository.getUserByUsername(TestingLib.TEST_USER);
      expect(user!.defaultKanbanId).toBe(TestingLib.TEST_KANBAN);
      expect(Array.isArray(user!.usersKanbans)).toBeTruthy();
      expect(user!.usersKanbans[0].kanbanId).toBe(TestingLib.TEST_KANBAN);
      expect(PasswordService.compareSecureHash(TestingLib.TEST_USER, user!.password)).toBeTruthy();
    });

    test('password error', async () => {
      const user = await UserRepository.getUserByUsername(TestingLib.TEST_USER);
      expect(PasswordService.compareSecureHash(TestingLib.NOT_EXISTED_TEST_USER, user!.password)).toBeFalsy();
    });

    test('no existed user', async () => {
      const user = await UserRepository.getUserByUsername(TestingLib.NOT_EXISTED_TEST_USER);
      expect(user).toBeUndefined();
    });
  });
});
