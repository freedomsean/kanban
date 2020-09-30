import { Router } from 'express';
import { auth } from './auth';

const v1: Router = Router();

v1.use('/auth', auth);

export { v1 };
