import { v4 } from 'uuid';

export enum UUIDType {
  USER = 'US',
  KANBAN = 'KA',
  TASK = 'TA',
  KANBANSTATUS = 'KS'
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
