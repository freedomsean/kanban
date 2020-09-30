import { EnvUtil } from '../util/env.util';
import * as dotenv from 'dotenv';
dotenv.config();

// Common Env
const NODE_ENV = 'NODE_ENV';

// HTTP Server
const HTTP_SERVER_PORT = 'HTTP_SERVER_PORT';

// Database Config
const DB_DIALECT = 'DB_DIALECT';
const DB_HOST = 'DB_HOST';
const DB_PORT = 'DB_PORT';
const DB_USER = 'DB_USER';
const DB_PASSWORD = 'DB_PASSWORD';
const DB_USED_DATABASE = 'DB_USED_DATABASE';
const DB_POOL_MAX_CONNECTION = 'DB_POOL_MAX_CONNECTION';
const DB_SYNC = 'DB_SYNC';

// Auth Config
const JWT_SECRET = 'JWT_SECRET';
const SALT_ROUNDS = 'SALT_ROUNDS';
const JWT_EXPIRES_IN = 'JWT_EXPIRES_IN';

// Fluentd Config
const FLUENTD_HOST = 'FLUENTD_HOST';
const FLUENTD_PORT = 'FLUENTD_PORT';
const FLUENTD_TIMEOUT = 'FLUENTD_TIMEOUT';
const FLUENTD_SHARED_KEY = 'FLUENTD_SHARED_KEY';
const FLUENTD_TAG = 'FLUENTD_TAG';

interface DBConfig {
  DB_DIALECT: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_USED_DATABASE: string;
  DB_POOL_MAX_CONNECTION: number;
  DB_SYNC: boolean;
}

interface AuthConfig {
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  SALT_ROUNDS: number;
}

interface FluentdConfig {
  FLUENTD_HOST: string;
  FLUENTD_PORT: number;
  FLUENTD_TIMEOUT: number;
  FLUENTD_SHARED_KEY: string;
  FLUENTD_TAG: string;
}

export interface EnvObj extends DBConfig, AuthConfig, FluentdConfig {
  NODE_ENV: string;
  HTTP_SERVER_PORT: number;
}

export const ENV_PRODUCTION_MODE = 'production';
export const ENV_TEST_MODE = 'test';

export const Env: EnvObj = {
  [NODE_ENV]: EnvUtil.getEnv(NODE_ENV),
  [HTTP_SERVER_PORT]: parseInt(EnvUtil.getEnv(HTTP_SERVER_PORT)),
  [DB_DIALECT]: EnvUtil.getEnv(DB_DIALECT),
  [DB_HOST]: EnvUtil.getEnv(DB_HOST),
  [DB_PORT]: parseInt(EnvUtil.getEnv(DB_PORT)),
  [DB_USER]: EnvUtil.getEnv(DB_USER),
  [DB_PASSWORD]: EnvUtil.getEnv(DB_PASSWORD),
  [DB_USED_DATABASE]: EnvUtil.getEnv(DB_USED_DATABASE),
  [DB_POOL_MAX_CONNECTION]: parseInt(EnvUtil.getEnv(DB_POOL_MAX_CONNECTION)),
  [DB_SYNC]: EnvUtil.getEnv(DB_SYNC) === 'true' && EnvUtil.getEnv(NODE_ENV) !== ENV_PRODUCTION_MODE,
  [JWT_SECRET]: EnvUtil.getEnv(JWT_SECRET),
  [JWT_EXPIRES_IN]: EnvUtil.getEnv(JWT_EXPIRES_IN),
  [SALT_ROUNDS]: parseInt(EnvUtil.getEnv(SALT_ROUNDS)),
  [FLUENTD_HOST]: EnvUtil.getEnv(FLUENTD_HOST),
  [FLUENTD_PORT]: parseInt(EnvUtil.getEnv(FLUENTD_PORT)),
  [FLUENTD_TIMEOUT]: parseInt(EnvUtil.getEnv(FLUENTD_TIMEOUT)),
  [FLUENTD_SHARED_KEY]: EnvUtil.getEnv(FLUENTD_SHARED_KEY),
  [FLUENTD_TAG]: EnvUtil.getEnv(FLUENTD_TAG)
};
