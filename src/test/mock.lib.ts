import {
  EMAIL_QUEUE_NAME,
  NOTIFICATION_ACTION_DELETE,
  NOTIFICATION_ACTION_MOVE
} from '../constant/notification.constant';
import { NOTIFICATION_ACTION_CREATE } from './../constant/notification.constant';
import { AMQPService } from './../service/amqp.service';
import { NotificationService } from './../service/notification.service';
import { TestingLib } from './testing.lib';

export class MockLib {
  static mockAMQPServicePublish(fn: jest.Mock) {
    jest.spyOn(AMQPService.prototype, 'publish').mockImplementationOnce(fn);
  }

  static mockAMQPServiceInit() {
    jest.spyOn(AMQPService.prototype, 'init').mockImplementationOnce(jest.fn());
  }

  static mockNotificationServiceCreateTask() {
    jest.spyOn(NotificationService, 'createTask').mockImplementationOnce(jest.fn());
  }

  static mockNotificationServiceMoveTask() {
    jest.spyOn(NotificationService, 'moveTask').mockImplementationOnce(jest.fn());
  }

  static mockNotificationServiceDeleteTask() {
    jest.spyOn(NotificationService, 'deleteTask').mockImplementationOnce(jest.fn());
  }

  static mockTaskServiceCreateTaskPublish(): jest.Mock {
    const fn = jest.fn().mockImplementationOnce((queueName: string, message: any) => {
      expect(queueName).toBe(EMAIL_QUEUE_NAME);
      expect(message.action).toBe(NOTIFICATION_ACTION_CREATE);
      expect(Array.isArray(message.emails)).toBeTruthy();
      expect(message.emails.length).toBe(1);
      expect(message.emails[0]).toBe(TestingLib.TEST_USER_EMAIL);
    });
    MockLib.mockAMQPServicePublish(fn);
    return fn;
  }

  static mockTaskServiceMoveTaskPublish(direction: string): jest.Mock {
    const fn = jest.fn().mockImplementationOnce((queueName: string, message: any) => {
      expect(queueName).toBe(EMAIL_QUEUE_NAME);
      expect(message.action).toBe(NOTIFICATION_ACTION_MOVE);
      expect(Array.isArray(message.emails)).toBeTruthy();
      expect(message.emails.length).toBe(1);
      expect(message.emails[0]).toBe(TestingLib.TEST_USER_EMAIL);
      expect(message.direction).toBe(direction);
    });
    MockLib.mockAMQPServicePublish(fn);
    return fn;
  }

  static mockTaskServiceDeleteTaskPublish(): jest.Mock {
    const fn = jest.fn().mockImplementationOnce((queueName: string, message: any) => {
      expect(queueName).toBe(EMAIL_QUEUE_NAME);
      expect(message.action).toBe(NOTIFICATION_ACTION_DELETE);
      expect(Array.isArray(message.emails)).toBeTruthy();
      expect(message.emails.length).toBe(1);
      expect(message.emails[0]).toBe(TestingLib.TEST_USER_EMAIL);
    });
    MockLib.mockAMQPServicePublish(fn);
    return fn;
  }

  static restoreAllMocks() {
    jest.restoreAllMocks();
  }
}
