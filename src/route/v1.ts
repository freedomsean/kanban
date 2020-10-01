import { Router } from 'express';
import { auth } from './auth.route';
import { task } from './task.route';

const v1: Router = Router();

v1.use('/auth', auth);
v1.use('/tasks', task);

export { v1 };
