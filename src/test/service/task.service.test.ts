import { TaskService } from './../../service/task.service';
import { MockLib } from './../mock.lib';
import { TestingLib } from './../testing.lib';

describe('Test TaskService', () => {
  beforeEach(async () => {
    await TestingLib.connectToDB();
    await TestingLib.createTestTask();
  });

  afterEach(async () => {
    await TestingLib.deleteTestUser();
    await TestingLib.closeDBConnection();
  });

  describe('Test createTask', () => {
    test('happy path', async () => {
      const fn = MockLib.mockTaskServiceCreateTaskPublish();
      await TaskService.createTask(TestingLib.TEST_NEW_TASK, TestingLib.TEST_USER, TestingLib.TEST_KANBAN);
      expect(fn).toBeCalledTimes(1);
      MockLib.restoreAllMocks();
    });
  });

  describe('Test moveTask', () => {
    test('happy path', async () => {
      const direction = 'forward';
      const fn = MockLib.mockTaskServiceMoveTaskPublish(direction);
      await TaskService.moveTask(TestingLib.TEST_TASK, direction, TestingLib.TEST_USER);
      expect(fn).toBeCalledTimes(1);
      MockLib.restoreAllMocks();
    });
  });

  describe('Test deleteTask', () => {
    test('happy path', async () => {
      const fn = MockLib.mockTaskServiceDeleteTaskPublish();
      MockLib.mockAMQPServicePublish(fn);
      await TaskService.deleteTask(TestingLib.TEST_TASK, TestingLib.TEST_USER);
      expect(fn).toBeCalledTimes(1);
      MockLib.restoreAllMocks();
    });
  });
});
