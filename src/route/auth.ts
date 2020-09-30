import { LoginRequiredField } from '../constant/api-required-field.constant';
import { AuthController } from '../controller/auth.controller';
import { Router } from 'express';
import { ValidateBodyMiddleware } from '../middleware/validate-body.middleware';

const auth: Router = Router();

auth.post(
  '/login',
  ValidateBodyMiddleware.validateBodyDataExists([LoginRequiredField.USERNAME, LoginRequiredField.PASSWORD]),
  AuthController.login
);

export { auth };
