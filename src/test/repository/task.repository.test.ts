import { KanbanStatus } from './../../model/kanban-status.model';
import { Task } from '../../model/task.model';
import { TestingLib } from '../testing.lib';
import {
  TaskCannotForwardError,
  TaskCannotBackwardError,
  TaskNotExistError,
  TaskPermissionDeniedError,
  NoKanbanStatusError
} from './../../exception/task.exception';
import { TaskRepository } from './../../repository/task.repository';
import { DBService } from './../../service/db.service';

describe('Test TaskRepository', () => {
  describe('Test checkUserKanbanRelation', () => {
    beforeEach(async () => {
      await TestingLib.connectToDB();
      await TestingLib.createTestKanban();
    });

    afterEach(async () => {
      await TestingLib.deleteTestUser();
      await TestingLib.closeDBConnection();
    });

    test('happy path', async () => {
      const result = await TaskRepository.checkUserKanbanRelation(TestingLib.TEST_USER, TestingLib.TEST_KANBAN);
      expect(result).toBeTruthy();
    });

    test('no relation', async () => {
      const result = await TaskRepository.checkUserKanbanRelation(
        TestingLib.TEST_USER,
        TestingLib.NOT_EXISTED_TEST_KANBAN
      );
      expect(result).toBeFalsy();
    });
  });

  describe('Test createTask', () => {
    beforeEach(async () => {
      await TestingLib.connectToDB();
      await TestingLib.createTestKanban();
    });

    afterEach(async () => {
      await TestingLib.deleteTestUser();
      await TestingLib.closeDBConnection();
    });

    test('happy path', async () => {
      const task = await TaskRepository.createTask(TestingLib.TEST_TASK, TestingLib.TEST_USER, TestingLib.TEST_KANBAN);
      expect(task).toBeTruthy();
      const result = await DBService.getInstance().getConnection().getRepository(Task).findOne({
        name: TestingLib.TEST_TASK
      });
      expect(result).toBeTruthy();
    });

    test('kanban not existed, should be failed', async () => {
      await expect(
        TaskRepository.createTask(TestingLib.TEST_TASK, TestingLib.TEST_USER, TestingLib.NOT_EXISTED_TEST_KANBAN)
      ).rejects.toThrowError(TaskPermissionDeniedError);
    });

    test('kanban status not existed, should be failed', async () => {
      await DBService.getInstance()
        .getConnection()
        .getRepository(KanbanStatus)
        .delete({ kanbanId: TestingLib.TEST_KANBAN });

      await expect(
        TaskRepository.createTask(TestingLib.TEST_TASK, TestingLib.TEST_USER, TestingLib.TEST_KANBAN)
      ).rejects.toThrowError(NoKanbanStatusError);
    });
  });

  describe('Test moveTask', () => {
    beforeEach(async () => {
      await TestingLib.connectToDB();
      await TestingLib.createTestTask();
    });

    afterEach(async () => {
      await TestingLib.deleteTestUser();
      await TestingLib.closeDBConnection();
    });

    test('task id does not exist', async () => {
      await expect(TaskRepository.moveTask(TestingLib.NOT_EXISTED_TEST_TASK, 'backward')).rejects.toThrowError(
        TaskNotExistError
      );
    });

    test('move forward happy path', async () => {
      const result = await TaskRepository.moveTask(TestingLib.TEST_TASK, 'forward');
      expect(result!.id).toBe(TestingLib.TEST_KANBAN_STATUS[1].id);
    });

    test('failed to move forward, because no any next order exists', async () => {
      await DBService.getInstance()
        .getConnection()
        .getRepository(Task)
        .update(
          {
            id: TestingLib.TEST_TASK
          },
          {
            status: TestingLib.TEST_KANBAN_STATUS[TestingLib.TEST_KANBAN_STATUS.length - 1].id
          }
        );
      await expect(TaskRepository.moveTask(TestingLib.TEST_TASK, 'forward')).rejects.toThrowError(
        TaskCannotForwardError
      );
    });

    test('move backward happy path', async () => {
      await DBService.getInstance()
        .getConnection()
        .getRepository(Task)
        .update(
          {
            id: TestingLib.TEST_TASK
          },
          {
            status: TestingLib.TEST_KANBAN_STATUS[TestingLib.TEST_KANBAN_STATUS.length - 1].id
          }
        );
      const result = await TaskRepository.moveTask(TestingLib.TEST_TASK, 'backward');
      expect(result!.id).toBe(TestingLib.TEST_KANBAN_STATUS[TestingLib.TEST_KANBAN_STATUS.length - 2].id);
    });

    test('failed to move backward, because no any previous order exists', async () => {
      await expect(TaskRepository.moveTask(TestingLib.TEST_TASK, 'backward')).rejects.toThrowError(
        TaskCannotBackwardError
      );
    });
  });

  describe('Test moveTask', () => {
    beforeEach(async () => {
      await TestingLib.connectToDB();
      await TestingLib.createTestTask();
    });

    afterEach(async () => {
      await TestingLib.deleteTestUser();
      await TestingLib.closeDBConnection();
    });

    test('happy path', async () => {
      await TaskRepository.deleteTask(TestingLib.TEST_TASK, TestingLib.TEST_USER);
    });

    test('task does not exist', async () => {
      await expect(
        TaskRepository.deleteTask(TestingLib.NOT_EXISTED_TEST_TASK, TestingLib.TEST_USER)
      ).rejects.toThrowError(TaskNotExistError);
    });

    test('task does not belong to the specific user', async () => {
      await expect(
        TaskRepository.deleteTask(TestingLib.TEST_TASK, TestingLib.NOT_EXISTED_TEST_USER)
      ).rejects.toThrowError(TaskPermissionDeniedError);
    });
  });
});
