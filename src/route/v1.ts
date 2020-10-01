import { Router } from 'express';
import { auth } from './auth.route';
import { kanban } from './kanban.route';
import { task } from './task.route';

const v1: Router = Router();

v1.use('/auth', auth);
v1.use('/tasks', task);
v1.use('/kanbans', kanban);

export { v1 };
