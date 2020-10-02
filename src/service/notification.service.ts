import { TaskRepository } from './../repository/task.repository';
import {
  EMAIL_QUEUE_NAME,
  NOTIFICATION_ACTION_CREATE,
  NOTIFICATION_ACTION_MOVE,
  NOTIFICATION_ACTION_DELETE
} from './../constant/notification.constant';
import { AMQPService } from './amqp.service';

export class NotificationService {
  /**
   * Notification for creating task.
   *
   * @param {string} taskId - Task id.
   * @param {string} name - Task name.
   * @param {string} userId - User id.
   * @param {string} kanbanId - Kanban id.
   */
  static async createTask(taskId: string, name: string, userId: string, kanbanId: string) {
    const emails = await TaskRepository.getAdminEmailsByTaskId(taskId);
    await AMQPService.getInstance().publish(EMAIL_QUEUE_NAME, {
      action: NOTIFICATION_ACTION_CREATE,
      id: taskId,
      name,
      userId,
      kanbanId,
      emails
    });
  }

  /**
   * Notification for moving task.
   *
   * @param {string} id - Task id.
   * @param {string} direction - It can be forward or backward.
   * @param {string} userId - User id.
   * @param {string} newStatus - New status id.
   */
  static async moveTask(id: string, direction: 'forward' | 'backward', userId: string, newStatus: String) {
    const emails = await TaskRepository.getAdminEmailsByTaskId(id);
    await AMQPService.getInstance().publish(EMAIL_QUEUE_NAME, {
      action: NOTIFICATION_ACTION_MOVE,
      taskId: id,
      direction,
      newStatus,
      userId,
      emails
    });
  }

  /**
   * Notification for deleting task.
   *
   * @param {string} id - Task id.
   * @param {string} userId - Task id.
   */
  static async deleteTask(id: string, userId: string) {
    const emails = await TaskRepository.getAdminEmailsByTaskId(id);
    await AMQPService.getInstance().publish(EMAIL_QUEUE_NAME, {
      action: NOTIFICATION_ACTION_DELETE,
      taskId: id,
      userId,
      emails
    });
  }
}
