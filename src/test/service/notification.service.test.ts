import { NotificationService } from './../../service/notification.service';
import { MockLib } from './../mock.lib';
import { TestingLib } from './../testing.lib';

describe('Test NotificationService', () => {
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
      await NotificationService.createTask(
        TestingLib.TEST_TASK,
        TestingLib.TEST_TASK,
        TestingLib.TEST_USER,
        TestingLib.TEST_KANBAN
      );
      expect(fn).toBeCalledTimes(1);
      MockLib.restoreAllMocks();
    });
  });

  describe('Test moveTask', () => {
    test('happy path', async () => {
      const direction = 'forward';
      const fn = MockLib.mockTaskServiceMoveTaskPublish(direction);
      MockLib.mockAMQPServicePublish(fn);
      await NotificationService.moveTask(
        TestingLib.TEST_TASK,
        direction,
        TestingLib.TEST_USER,
        TestingLib.TEST_KANBAN_STATUS[1].id
      );
      expect(fn).toBeCalledTimes(1);
      MockLib.restoreAllMocks();
    });
  });

  describe('Test deleteTask', () => {
    test('happy path', async () => {
      const fn = MockLib.mockTaskServiceDeleteTaskPublish();
      MockLib.mockAMQPServicePublish(fn);
      await NotificationService.deleteTask(TestingLib.TEST_TASK, TestingLib.TEST_USER);
      expect(fn).toBeCalledTimes(1);
      MockLib.restoreAllMocks();
    });
  });
});
