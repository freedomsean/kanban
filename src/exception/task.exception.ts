export class NoKanbanStatusError extends Error {
  constructor() {
    super(`No any kanban status is in this kanban.`);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, NoKanbanStatusError.prototype);
  }
}

export class TaskCannotForwardError extends Error {
  constructor() {
    super(`Task cannot forward any more.`);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, TaskCannotForwardError.prototype);
  }
}

export class TaskCannotBackwardError extends Error {
  constructor() {
    super(`Task cannot backward any more.`);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, TaskCannotBackwardError.prototype);
  }
}

export class TaskNotExistError extends Error {
  constructor() {
    super(`Task does not exist.`);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, TaskNotExistError.prototype);
  }
}

export class TaskPermissionDeniedError extends Error {
  constructor() {
    super(`Task does not belong to the user.`);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, TaskPermissionDeniedError.prototype);
  }
}
