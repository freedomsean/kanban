import * as jwt from 'jsonwebtoken';
import * as supertest from 'supertest';

import { Env } from '../../constant/env.constant';
import { ApiTestingLib } from '../api-testing.lib';
import { TestingLib } from '../testing.lib';
import { HttpStatusCode } from './../../constant/response-msg.constant';

describe('Test Auth API', () => {
  let main: { app: any; server: any };
  beforeEach(async () => {
    await TestingLib.connectToDB();
    await TestingLib.createTestKanban();
    main = await ApiTestingLib.startHttpServer();
  });

  afterEach(async () => {
    await ApiTestingLib.closeHttpServer(main.server);
    await TestingLib.deleteTestUser();
    await TestingLib.closeDBConnection();
  });

  describe('Test /v1/auth/login', () => {
    const END_POINT = '/v1/auth/login';

    test('happy path', async () => {
      const testing = await supertest(main.app)
        .post(END_POINT)
        .send({
          username: TestingLib.TEST_USER,
          password: TestingLib.TEST_USER
        })
        .expect(HttpStatusCode.OK);
      expect(testing.body.data.user.id).toBe(TestingLib.TEST_USER);
      expect(testing.body.data.user.username).toBe(TestingLib.TEST_USER);
      expect(testing.body.data.user.defaultKanbanId).toBe(TestingLib.TEST_KANBAN);
      expect(Array.isArray(testing.body.data.user.kanbans)).toBeTruthy();
      expect(testing.body.data.user.kanbans[0].id).toBe(TestingLib.TEST_KANBAN);
      const jwtInfo: any = jwt.verify(testing.body.data.token, Env.JWT_SECRET);
      expect(jwtInfo.sub).toBe(TestingLib.TEST_USER);
    });

    test('wrong info', async () => {
      await supertest(main.app)
        .post(END_POINT)
        .send({
          username: TestingLib.NOT_EXISTED_TEST_USER,
          password: TestingLib.TEST_USER
        })
        .expect(HttpStatusCode.UNAUTHORIZED);
    });

    test('missing field', async () => {
      const testing = await supertest(main.app).post(END_POINT).send({}).expect(HttpStatusCode.UNPROCESSABLE_ENTITY);
      expect(testing.body.error.validateErrors.length).toBe(2);
    });
  });
});
