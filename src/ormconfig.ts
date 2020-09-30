import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Env } from './constant/env.constant';

const ORMConfig = {
  type: Env.DB_DIALECT,
  host: Env.DB_HOST,
  port: Env.DB_PORT,
  username: Env.DB_USER,
  password: Env.DB_PASSWORD,
  database: Env.DB_USED_DATABASE,
  synchronize: Env.DB_SYNC,
  extra: {
    max: Env.DB_POOL_MAX_CONNECTION,
    connectionLimit: Env.DB_POOL_MAX_CONNECTION
  },
  entities: [`dist/model/*`],
  cli: {
    entitiesDir: 'dist/model'
  },
  namingStrategy: new SnakeNamingStrategy()
};

// We use this type of export because of reasons:
// If we don't we receive this error: MissingDriverError: Wrong driver: "undefined" given.
// Explanation: https://github.com/typeorm/typeorm/issues/4068#issuecomment-530420886
export = ORMConfig;
