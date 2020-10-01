import { KanbanPermissionDeniedError } from './../../exception/kanban.exception';
import { KanbanStatusRepository } from './../../repository/kanban-status.repository';
import { TestingLib } from './../testing.lib';

describe('Test KanbanStatusRepository', () => {
  describe('Test getStatusesByKanbanId', () => {
    beforeEach(async () => {
      await TestingLib.connectToDB();
      await TestingLib.createTestKanban();
    });

    afterEach(async () => {
      await TestingLib.deleteTestUser();
      await TestingLib.closeDBConnection();
    });

    test('happy path', async () => {
      const statuses = await KanbanStatusRepository.getStatusesByKanbanId(TestingLib.TEST_KANBAN, TestingLib.TEST_USER);
      for (let i = 0; i < statuses.length; i++) {
        expect(statuses[i].id).toBe(TestingLib.TEST_KANBAN_STATUS[i].id);
        expect(statuses[i].name).toBe(TestingLib.TEST_KANBAN_STATUS[i].name);
        expect(statuses[i].order).toBe(i);
      }
    });

    test('permission denied', async () => {
      await expect(
        KanbanStatusRepository.getStatusesByKanbanId(TestingLib.TEST_KANBAN, TestingLib.NOT_EXISTED_TEST_USER)
      ).rejects.toThrowError(KanbanPermissionDeniedError);
    });
  });
});
