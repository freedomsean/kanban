import { KanbanStatus } from './../model/kanban-status.model';
import { KanbanStatusRepository } from './../repository/kanban-status.repository';

export class KanbanStatusService {
  /**
   * Get statuses by kanban id.
   *
   * @param {string} kanbanId - Kanban id.
   * @param {string} userId - User id.
   */
  static async getStatusesByKanbanId(kanbanId: string, userId: string): Promise<KanbanStatus[]> {
    return await KanbanStatusRepository.getStatusesByKanbanId(kanbanId, userId);
  }
}
