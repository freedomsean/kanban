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
    LoggerService.getInstance().info({
      path: req.path,
      user: req.user,
      params: req.params,
      query: req.query,
      body: req.body,
      response: data
    });
    res.status(data.statusCode).json(data.toJson());
  } else {
    res.json(data);
  }
}
