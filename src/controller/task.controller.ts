import { TaskPermissionDeniedError, NoKanbanStatusError } from './../exception/task.exception';
import { HttpStatusCode } from './../constant/response-msg.constant';
import {
  HttpSuccessResponse,
  HttpForbiddenResponse,
  HttpSystemErrorResponse,
  HttpConflictResponse
} from './../middleware/http-response';
import { TaskService } from './../service/task.service';
import { Request, Response, NextFunction } from 'express';

export class TaskController {
  static async createTask(req: Request, res: Response, next: NextFunction) {
    const { name, kanbanId } = req.body;
    const userId = req.user!.id;

    try {
      const info = await TaskService.createTask(name, userId, kanbanId);
      next(new HttpSuccessResponse(info, HttpStatusCode.CREATED));
    } catch (error) {
      if (error instanceof TaskPermissionDeniedError) {
        next(new HttpForbiddenResponse());
        return;
      }

      if (error instanceof NoKanbanStatusError) {
        next(new HttpConflictResponse(error.toString()));
        return;
      }

      next(new HttpSystemErrorResponse(error.toString()));
    }
  }
}
