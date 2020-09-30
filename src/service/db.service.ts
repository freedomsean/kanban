import { UserKanban } from './../model/user-kanban.model';
import { KanbanStatus } from './../model/kanban-status.model';
import { Task } from './../model/task.model';
import { Kanban } from './../model/kanban.model';
import { createConnection, Connection } from 'typeorm';
import { User } from '../model/user.model';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export interface DBConfig {
  dialect: string;
  host: string;
  port: number;
  user: string;
  password: string;
  usedDatabase: string;
  needToSync: boolean;
  poolSize: number;
}

export class DBMissingInitError extends Error {
  constructor() {
    super(`DBService never init.`);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, DBMissingInitError.prototype);
  }
}

export class DBService {
  private static dbService: DBService;
  private connection: Connection;

  static getInstance() {
    if (!DBService.dbService) {
      DBService.dbService = new DBService();
    }
    return DBService.dbService;
  }

  /**
   * Check whether is connected to DB.
   */
  hasConnection() {
    return this.connection && this.connection.isConnected;
  }

  /**
   * Close the connection, if it had.
   */
  async closeConnection() {
    if (this.hasConnection()) {
      await this.connection.close();
    }
  }

  /**
   * Init must be called before getConnection.
   *
   * @param {any} config - Database configuration.
   */
  async init(config: DBConfig) {
    if (this.hasConnection()) {
      await this.connection.close();
    }

    this.connection = await createConnection({
      type: config.dialect as any,
      host: config.host,
      port: config.port,
      username: config.user,
      password: config.password,
      database: config.usedDatabase,
      synchronize: config.needToSync,
      namingStrategy: new SnakeNamingStrategy(),
      entities: [User, Kanban, Task, KanbanStatus, UserKanban],
      logging: false,
      extra: {
        max: config.poolSize, // For pg.
        connectionLimit: config.poolSize // Fo mysql.
      }
    });
  }

  /**
   * Get database connection which is based on typeorm. It should be called after init.
   */
  getConnection() {
    if (!this.connection) {
      throw new DBMissingInitError();
    }

    return this.connection;
  }
}
