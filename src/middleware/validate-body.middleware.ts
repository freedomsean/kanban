import { ValidatorUtil, ValidationResult } from '../util/validator.util';
import { Request, Response, NextFunction } from 'express';
import { HttpUnprocessableEntityResponse } from './http-response';

export class ValidateBodyMiddleware {
  /**
   * Check the specific key exists.
   *
   * @param {string[]} keys - Keys.
   */
  static validateBodyDataExists(keys: string[]): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
      let validation: ValidationResult = { isValid: true, errors: [] };
      for (const key of keys) {
        validation = ValidatorUtil.accumulateErrors(validation, ValidatorUtil.validateIsDefined(req.body[key], key));
      }

      if (!validation.isValid) {
        next(new HttpUnprocessableEntityResponse(validation.errors));
      } else {
        next();
      }
    };
  }
}
