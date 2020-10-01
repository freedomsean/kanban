import { KanbanStatusController } from './../controller/kanban-status.controller';
import { TaskController } from '../controller/task.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { Router } from 'express';

const kanban: Router = Router();

kanban.get('/:id/tasks', AuthMiddleware, TaskController.getTasksByKanbanId);
kanban.get('/:id/statuses', AuthMiddleware, KanbanStatusController.getStatusesByKanbanId);

export { kanban };
