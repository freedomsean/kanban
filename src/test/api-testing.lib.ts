import { HttpStatusCode } from './../constant/response-msg.constant';
import { TestingLib } from './testing.lib';
import * as supertest from 'supertest';
import * as http from 'http';

export class ApiTestingLib {
  static startHttpServer(): Promise<{ app: any; server: any }> {
    return new Promise((resolve) => {
      const app = require('../app');
      // Do setTimeout, to make sure db is connected.
      setTimeout(() => {
        resolve(app);
      }, 2000);
    });
  }

  static closeHttpServer(server: http.Server): Promise<void> {
    return new Promise((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  }

  static async login(main: any): Promise<string> {
    const testing = await supertest(main.app)
      .post('/v1/auth/login')
      .send({
        username: TestingLib.TEST_USER,
        password: TestingLib.TEST_USER
      })
      .expect(HttpStatusCode.OK);
    return testing.body.data.token;
  }
}
