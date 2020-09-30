import { HttpStatusCode } from '../../constant/response-msg.constant';
import { ErrorHandler } from '../../middleware/error-handler.middleware';
import { HttpSuccessResponse, HttpSystemErrorResponse } from '../../middleware/http-response';
import * as express from 'express';
import { Express, Response, NextFunction } from 'express';
import * as supertest from 'supertest';

const successTemplate: any = {
  data: {}
};

const errorTemplate: any = {
  error: {}
};

const API_SUCCESS_WITHOUT_CODE = '/success_without_code';
const API_SYSTEM_ERROR = '/system_error';

describe('ErrorHandler', () => {
  let app: Express | undefined;

  beforeAll(() => {
    app = express();
    app.get(API_SUCCESS_WITHOUT_CODE, (req: express.Request, res: Response, next: NextFunction) => {
      next(new HttpSuccessResponse({ abc: 123 }));
    });

    app.get(API_SYSTEM_ERROR, (req: express.Request, res: Response, next: NextFunction) => {
      next(new HttpSystemErrorResponse({ lll: 123 }));
    });

    app.use(ErrorHandler);
  });

  afterAll(() => {
    app = undefined;
  });

  const requestTest = async (url: string, statusCode: number, expectedData: any) => {
    const res = await supertest(app).get(url).expect('Content-Type', /json/).expect(statusCode);
    expect(res.text).toBe(JSON.stringify(expectedData));
  };

  describe('Test success response', () => {
    test('Test success response with default code', async () => {
      successTemplate.data = { abc: 123 };
      await requestTest(API_SUCCESS_WITHOUT_CODE, HttpStatusCode.OK, successTemplate);
    });
  });

  describe('Test system error response', () => {
    test('Test  system error response', async () => {
      errorTemplate.error = { lll: 123 };
      await requestTest(API_SYSTEM_ERROR, HttpStatusCode.INTERNAL_SERVER_ERROR, errorTemplate);
    });
  });
});
