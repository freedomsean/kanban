export class KanbanPermissionDeniedError extends Error {
  constructor() {
    super(`Kanban does not belong to the user.`);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, KanbanPermissionDeniedError.prototype);
  }
}
