import { TaskController } from '../controller/task.controller';
import { CreateTaskRequiredField } from '../constant/api-required-field.constant';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { AuthController } from '../controller/auth.controller';
import { Router } from 'express';
import { ValidateBodyMiddleware } from '../middleware/validate-body.middleware';

const task: Router = Router();

task.put('/:id/:direction', AuthMiddleware, AuthController.login);
task.delete('/:id', AuthMiddleware, AuthController.login);
task.post(
  '/',
  AuthMiddleware,
  ValidateBodyMiddleware.validateBodyDataExists([CreateTaskRequiredField.NAME, CreateTaskRequiredField.KANBAN_ID]),
  TaskController.createTask
);

export { task };
