import { v4 } from 'uuid';

export enum UUIDType {
  User = 'US',
  Kanban = 'KA',
  Task = 'TA',
  KanbanStatus = 'KS'
}

export class UUIDService {
  /**
   * Generate unique id by type.
   *
   * @param {any} type - Type.
   */
  static generateUniqueId(type: UUIDType): string {
    return type + v4();
  }
}
