import { KanbanStatus } from './../model/kanban-status.model';
import { Task } from './../model/task.model';
import { TaskRepository } from '../repository/task.repository';

export class TaskService {
  /**
   * Create task.
   *
   * @param {string} name - Task name.
   * @param {string} userId - User id.
   * @param {string} kanbanId - Kanban id.
   */
  static async createTask(name: string, userId: string, kanbanId: string): Promise<Task | undefined> {
    return await TaskRepository.createTask(name, userId, kanbanId);
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
    return await TaskRepository.moveTask(id, direction, userId);
  }

  /**
   * Delete task by updating isDeleted.
   *
   * @param {string} id - Task id.
   * @param {string} userId - Task id.
   */
  static async deleteTask(id: string, userId: string) {
    await TaskRepository.deleteTask(id, userId);
  }

  /**
   * Get tasks by kanban id.
   *
   * @param {string} kanbanId - Kanban id.
   * @param {string} userId - User id.
   */
  static async getTasksByKanbanId(kanbanId: string, userId: string): Promise<Task[]> {
    return await TaskRepository.getTasksByKanbanId(kanbanId, userId);
  }
}
