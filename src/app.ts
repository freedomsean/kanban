import { DBService } from './service/db.service';
import { LoggerService } from './service/logger.service';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as compression from 'compression';
import * as passport from 'passport';
import { v1 } from './route/v1';
import { PassportService } from './service/passport.service';
import { Env } from './constant/env.constant';
import { ErrorHandler } from './middleware/error-handler.middleware';

const app: express.Application = express();

// Enable cors in dev mode
app.use(cors());

// Enable compression middleware
app.use(compression());

// Support application/json type post data
app.use(bodyParser.json());

// Support application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// Enable passport middleware
app.use(passport.initialize());

// Passport config
PassportService.config(passport);

// V1 Routers.
app.use('v1', v1);

// To process all response.
app.use(ErrorHandler);

(async () => {
  try {
    await DBService.getInstance().init({
      dialect: Env.DB_DIALECT,
      host: Env.DB_HOST,
      port: Env.DB_PORT,
      user: Env.DB_USER,
      password: Env.DB_PASSWORD,
      usedDatabase: Env.DB_USED_DATABASE,
      needToSync: Env.DB_SYNC,
      poolSize: Env.DB_POOL_MAX_CONNECTION
    });
  } catch (error) {
    LoggerService.getInstance().error(`Database cannot be connected.` + error.toString());

    // Force to stop the current process.
    process.exit(22);
  }
})();

const server = app.listen(Env.HTTP_SERVER_PORT, () => {
  LoggerService.getInstance().info(`Server running on port ${Env.HTTP_SERVER_PORT} - Worker ${process.pid} started \n`);
});

module.exports = { app, server };
