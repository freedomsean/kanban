import { ENV_TEST_MODE, Env } from '../constant/env.constant';
import { LoggerService } from '../service/logger.service';
import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from './http-response';

/**
 * The middleware to process the response, to make all response have the same structure.
 *
 * @param {any} data - Processed data.
 * @param {Request} req - Express.req.
 * @param {Response} res - Express.res.
 * @param {NextFunction} next - Express.next.
 */
export function ErrorHandler(data: any, req: Request, res: Response, next: NextFunction) {
  if (data instanceof HttpResponse) {
    if (Env.NODE_ENV !== ENV_TEST_MODE) {
      LoggerService.getInstance().info({});
    }
    res.status(data.statusCode).json(data.toJson());
  } else {
    res.json(data);
  }
}
