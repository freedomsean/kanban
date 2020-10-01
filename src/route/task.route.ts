import { TaskController } from '../controller/task.controller';
import { CreateTaskRequiredField } from '../constant/api-required-field.constant';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { Router } from 'express';
import { ValidateBodyMiddleware } from '../middleware/validate-body.middleware';

const task: Router = Router();

task.put('/:id/:direction(backward|forward)', AuthMiddleware, TaskController.moveTask);
task.delete('/:id', AuthMiddleware, TaskController.deleteTask);
task.post(
  '/',
  AuthMiddleware,
  ValidateBodyMiddleware.validateBodyDataExists([CreateTaskRequiredField.NAME, CreateTaskRequiredField.KANBAN_ID]),
  TaskController.createTask
);

export { task };
