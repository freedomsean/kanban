import { AMQPService } from './service/amqp.service';
import { DBService } from './service/db.service';
import { LoggerService } from './service/logger.service';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as compression from 'compression';
import * as passport from 'passport';
import { PassportService } from './service/passport.service';
import { Env } from './constant/env.constant';
import { ErrorHandler } from './middleware/error-handler.middleware';
import { v1 } from './route/v1';

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

(async () => {
  try {
    await AMQPService.getInstance().init({
      protocol: Env.AMQP_PROTOCOL,
      host: Env.AMQP_HOST,
      port: Env.AMQP_PORT,
      user: Env.AMQP_USER,
      password: Env.AMQP_PASSWORD
    });
  } catch (error) {
    LoggerService.getInstance().error(`AMQP cannot be connected.` + error.toString());

    // Force to stop the current process.
    process.exit(22);
  }
})();

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
app.use('/v1', v1);
app.use('/docs', express.static('static'));

// To process all response.
app.use(ErrorHandler);

const server = app.listen(Env.HTTP_SERVER_PORT, () => {
  LoggerService.getInstance().info(`Server running on port ${Env.HTTP_SERVER_PORT} - Worker ${process.pid} started \n`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    DBService.getInstance().closeConnection();
    AMQPService.getInstance().closeConnection();
    LoggerService.getInstance().end();
  });
});

module.exports = {
  app,
  server
};
