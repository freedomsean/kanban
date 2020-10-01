import { KanbanPermissionDeniedError } from './../exception/kanban.exception';
import { TaskRepository } from './task.repository';
import { DBService } from './../service/db.service';
import { KanbanStatus } from './../model/kanban-status.model';

export class KanbanStatusRepository {
  /**
   * Get statuses by kanban id.
   *
   * @param {string} kanbanId - Kanban id.
   * @param {string} userId - User id.
   */
  static async getStatusesByKanbanId(kanbanId: string, userId: string): Promise<KanbanStatus[]> {
    const userKanban = await TaskRepository.checkUserKanbanRelation(userId, kanbanId);
    if (!userKanban) {
      throw new KanbanPermissionDeniedError();
    }

    const statuses = await DBService.getInstance()
      .getConnection()
      .getRepository(KanbanStatus)
      .find({
        select: ['id', 'name', 'order'],
        where: {
          isDeleted: false,
          kanbanId
        },
        order: {
          order: 'ASC'
        }
      });
    return statuses;
  }
}
