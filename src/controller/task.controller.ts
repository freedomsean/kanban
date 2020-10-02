import {
  TaskPermissionDeniedError,
  NoKanbanStatusError,
  TaskCannotBackwardError,
  TaskCannotForwardError,
  TaskNotExistError
} from './../exception/task.exception';
import { HttpStatusCode } from './../constant/response-msg.constant';
import {
  HttpSuccessResponse,
  HttpForbiddenResponse,
  HttpSystemErrorResponse,
  HttpConflictResponse,
  HttpNotFoundResponse
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

  static async moveTask(req: Request, res: Response, next: NextFunction) {
    const { id, direction } = req.params;
    const userId = req.user!.id;

    try {
      const info = await TaskService.moveTask(id, direction as any, userId);
      next(new HttpSuccessResponse(info, HttpStatusCode.OK));
    } catch (error) {
      if (error instanceof TaskPermissionDeniedError) {
        next(new HttpForbiddenResponse());
        return;
      }

      if (error instanceof TaskCannotForwardError || error instanceof TaskCannotBackwardError) {
        next(new HttpConflictResponse(error.toString()));
        return;
      }

      if (error instanceof TaskNotExistError) {
        next(new HttpNotFoundResponse());
        return;
      }

      next(new HttpSystemErrorResponse(error.toString()));
    }
  }

  static async deleteTask(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const userId = req.user!.id;

    try {
      const info = await TaskService.deleteTask(id, userId);
      next(new HttpSuccessResponse(info, HttpStatusCode.NO_CONTENT));
    } catch (error) {
      if (error instanceof TaskPermissionDeniedError) {
        next(new HttpForbiddenResponse());
        return;
      }

      if (error instanceof TaskNotExistError) {
        next(new HttpNotFoundResponse());
        return;
      }

      next(new HttpSystemErrorResponse(error.toString()));
    }
  }

  static async getTasksByKanbanId(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const userId = req.user!.id;

    try {
      const info = await TaskService.getTasksByKanbanId(id, userId);
      next(new HttpSuccessResponse(info, HttpStatusCode.OK));
    } catch (error) {
      if (error instanceof TaskPermissionDeniedError) {
        next(new HttpForbiddenResponse());
        return;
      }

      next(new HttpSystemErrorResponse(error.toString()));
    }
  }
}
