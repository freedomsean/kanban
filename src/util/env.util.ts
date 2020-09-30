export class EnvIsNotGivenError extends Error {
  constructor(envName: string) {
    super(`ENV: ${envName} is not given`);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, EnvIsNotGivenError.prototype);
  }
}

export class EnvUtil {
  /**
   * Get env by the given name.
   *
   * @param {string} envName - Env name.
   */
  static getEnv(envName: string): string {
    const data: string | undefined = process.env[envName];
    if (typeof data === 'undefined') {
      throw new EnvIsNotGivenError(envName);
    }
    return data;
  }
}
