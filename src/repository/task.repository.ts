import { LessThan, MoreThan } from 'typeorm';

import { Task } from '../model/task.model';
import {
  NoKanbanStatusError,
  TaskCannotBackwardError,
  TaskCannotForwardError,
  TaskNotExistError,
  TaskPermissionDeniedError,
  TaskNameDuplicatedError
} from './../exception/task.exception';
import { KanbanStatus } from './../model/kanban-status.model';
import { UserKanban } from './../model/user-kanban.model';
import { DBService } from './../service/db.service';
import { UUIDService, UUIDType } from './../service/uuid.service';

export class TaskRepository {
  /**
   * Get admin's emails by task id.
   *
   * @param {string} taskId - Task id.
   */
  static async getAdminEmailsByTaskId(taskId: string): Promise<string[]> {
    const task = await DBService.getInstance()
      .getConnection()
      .getRepository(Task)
      .findOneOrFail({
        select: ['kanbanId'],
        where: {
          // It cannot add isDeleted: false, because deleting task will change that.
          id: taskId
        }
      });

    const usersKanbans = await DBService.getInstance()
      .getConnection()
      .getRepository(UserKanban)
      .find({
        where: {
          kanbanId: task.kanbanId,
          isDeleted: false
        },
        relations: ['user']
      });

    return usersKanbans.filter((ele) => ele.type === 'admin').map((ele) => ele.user.email);
  }

  /**
   * Check relation between user with kanban.
   *
   * @param {string} userId - User id.
   * @param {string} kanbanId - Kanban id.
   */
  static async checkUserKanbanRelation(userId: string, kanbanId: string): Promise<boolean> {
    const userKanban = await DBService.getInstance()
      .getConnection()
      .getRepository(UserKanban)
      .findOne({
        select: ['userId', 'kanbanId'],
        where: {
          userId,
          kanbanId,
          isDeleted: false
        }
      });

    return !!userKanban;
  }

  /**
   * Create task.
   *
   * @param {string} name - Task name.
   * @param {string} userId - User id.
   * @param {string} kanbanId - Kanban id.
   */
  static async createTask(name: string, userId: string, kanbanId: string): Promise<Task | undefined> {
    const task = new Task();
    task.id = UUIDService.generateUniqueId(UUIDType.TASK);
    task.lastModified = userId;
    task.name = name;
    task.kanbanId = kanbanId;

    const userKanban = await TaskRepository.checkUserKanbanRelation(userId, task.kanbanId);
    if (!userKanban) {
      throw new TaskPermissionDeniedError();
    }

    try {
      await DBService.getInstance()
        .getConnection()
        .transaction(async (transactionalEntityManager) => {
          const status = await transactionalEntityManager.findOneOrFail(KanbanStatus, {
            where: {
              kanbanId,
              isDeleted: false
            },
            select: ['id'],
            order: {
              order: 'ASC'
            }
          });

          task.status = status.id;

          await transactionalEntityManager.save(task);
        });
      return task;
    } catch (error) {
      if (error.toString().startsWith(`EntityNotFound: Could not find any entity of type "KanbanStatus" matching`)) {
        throw new NoKanbanStatusError();
      }

      if (error.message.startsWith(`duplicate key value violates unique constraint`)) {
        throw new TaskNameDuplicatedError();
      }

      throw error;
    }
  }

  /**
   * Move task by id and direction.
   *
   * @param {string} id - Task id.
   * @param {string} direction - It can be forward or backward.
   * @param {string} userId - User id.
   */
  static async moveTask(
    id: string,
    direction: 'forward' | 'backward',
    userId: string
  ): Promise<KanbanStatus | undefined> {
    const isForward = direction === 'forward';

    try {
      const newStatus = await DBService.getInstance()
        .getConnection()
        .transaction(async (transactionalEntityManager) => {
          const task = await transactionalEntityManager.findOneOrFail(Task, {
            where: {
              id,
              isDeleted: false
            },
            select: ['status', 'kanbanId']
          });

          await transactionalEntityManager.getRepository(UserKanban).findOneOrFail({
            select: ['userId', 'kanbanId'],
            where: {
              userId,
              kanbanId: task.kanbanId,
              isDeleted: false
            }
          });

          const currentStatus = await transactionalEntityManager.getRepository(KanbanStatus).findOneOrFail({
            where: {
              id: task.status,
              isDeleted: false
            },
            select: ['order']
          });

          const newStatus = await transactionalEntityManager.findOneOrFail(KanbanStatus, {
            where: {
              kanbanId: task.kanbanId,
              order: isForward ? MoreThan(currentStatus.order) : LessThan(currentStatus.order),
              isDeleted: false
            },
            select: ['id', 'name'],
            order: {
              order: isForward ? 'ASC' : 'DESC'
            }
          });

          await transactionalEntityManager.update(
            Task,
            {
              id
            },
            {
              status: newStatus.id,
              lastModified: userId,
              updatedAt: new Date()
            }
          );

          return newStatus;
        });
      return newStatus;
    } catch (error) {
      if (error.toString().startsWith(`EntityNotFound: Could not find any entity of type "KanbanStatus" matching`)) {
        if (isForward) {
          throw new TaskCannotForwardError();
        } else {
          throw new TaskCannotBackwardError();
        }
      }

      if (error.toString().startsWith(`EntityNotFound: Could not find any entity of type "Task" matching`)) {
        throw new TaskNotExistError();
      }

      if (error.toString().startsWith(`EntityNotFound: Could not find any entity of type "UserKanban" matching`)) {
        throw new TaskPermissionDeniedError();
      }
      throw error;
    }
  }

  /**
   * Delete task by updating isDeleted.
   *
   * @param {string} id - Task id.
   * @param {string} userId - Task id.
   */
  static async deleteTask(id: string, userId: string) {
    const task = await DBService.getInstance()
      .getConnection()
      .getRepository(Task)
      .findOne({
        select: ['kanbanId'],
        where: {
          id,
          isDeleted: false
        }
      });

    if (!task) {
      throw new TaskNotExistError();
    }

    const userKanban = await TaskRepository.checkUserKanbanRelation(userId, task.kanbanId);
    if (!userKanban) {
      throw new TaskPermissionDeniedError();
    }

    await DBService.getInstance().getConnection().getRepository(Task).update(
      {
        id
      },
      {
        isDeleted: true,
        lastModified: userId,
        updatedAt: new Date()
      }
    );
  }

  /**
   * Get tasks by kanban id.
   *
   * @param {string} kanbanId - Kanban id.
   * @param {string} userId - User id.
   */
  static async getTasksByKanbanId(kanbanId: string, userId: string): Promise<Task[]> {
    const userKanban = await TaskRepository.checkUserKanbanRelation(userId, kanbanId);
    if (!userKanban) {
      throw new TaskPermissionDeniedError();
    }

    const tasks = await DBService.getInstance()
      .getConnection()
      .getRepository(Task)
      .find({
        select: ['id', 'name', 'status'],
        where: {
          isDeleted: false
        },
        order: {
          id: 'ASC'
        }
      });

    return tasks;
  }
}
