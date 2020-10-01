import { NextFunction, Request, Response } from 'express';

import { HttpStatusCode } from './../constant/response-msg.constant';
import { KanbanPermissionDeniedError } from './../exception/kanban.exception';
import { HttpForbiddenResponse, HttpSuccessResponse, HttpSystemErrorResponse } from './../middleware/http-response';
import { KanbanStatusRepository } from './../repository/kanban-status.repository';

export class KanbanStatusController {
  static async getStatusesByKanbanId(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const userId = req.user!.id;

    try {
      const info = await KanbanStatusRepository.getStatusesByKanbanId(id, userId);
      next(new HttpSuccessResponse(info, HttpStatusCode.OK));
    } catch (error) {
      if (error instanceof KanbanPermissionDeniedError) {
        next(new HttpForbiddenResponse());
        return;
      }

      next(new HttpSystemErrorResponse(error.toString()));
    }
  }
}
