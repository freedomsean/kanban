export class LoginInfoError extends Error {
  constructor() {
    super(`login info is wrong.`);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, LoginInfoError.prototype);
  }
}
