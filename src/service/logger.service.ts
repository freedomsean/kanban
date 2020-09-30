import * as winston from 'winston';
import { Logger } from 'winston';
import * as fluentNodeLogger from 'fluent-logger';
import * as os from 'os';
import { Env, ENV_TEST_MODE } from '../constant/env.constant';

export class LoggerService {
  private static loggerService: LoggerService;
  private logger: Logger;

  static getInstance() {
    if (!LoggerService.loggerService) {
      LoggerService.loggerService = new LoggerService();
    }
    return LoggerService.loggerService;
  }

  constructor() {
    const transports =
      Env.NODE_ENV === ENV_TEST_MODE
        ? [new winston.transports.Console()]
        : [
            new (fluentNodeLogger.support.winstonTransport())(Env.FLUENTD_TAG, {
              host: Env.FLUENTD_HOST,
              port: Env.FLUENTD_PORT,
              timeout: Env.FLUENTD_TIMEOUT,
              requireAckResponse: false,
              security: {
                clientHostname: os.hostname(),
                sharedKey: Env.FLUENTD_SHARED_KEY
              }
            })
          ];

    this.logger = winston.createLogger({
      transports
    });
  }

  /**
   * Add info into log.
   *
   * @param {any} message - Message.
   */
  info(message: any) {
    this.logger.info(message);
  }

  /**
   * Add error into log.
   *
   * @param {any} message - Message.
   */
  error(message: any) {
    this.logger.error(message);
  }

  /**
   * End the logger.
   */
  end() {
    return new Promise((resolve) => {
      this.logger.end(() => {
        resolve();
      });
    });
  }
}
