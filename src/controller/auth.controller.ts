import { LoginInfoError } from './../exception/auth.exception';
import { HttpSuccessResponse, HttpSystemErrorResponse, HttpUnauthorizedResponse } from './../middleware/http-response';
import { AuthService } from './../service/auth.service';
import { Request, Response, NextFunction } from 'express';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;

    try {
      const info = await AuthService.login(username, password);
      next(new HttpSuccessResponse(info));
    } catch (error) {
      if (error instanceof LoginInfoError) {
        next(new HttpUnauthorizedResponse());
        return;
      }
      next(new HttpSystemErrorResponse(error.toString()));
    }
  }
}
