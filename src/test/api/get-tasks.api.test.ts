import { MockLib } from './../mock.lib';
import * as supertest from 'supertest';

import { HttpStatusCode } from './../../constant/response-msg.constant';
import { TOKEN_TYPE_BEARER } from './../../constant/token.constant';
import { ApiTestingLib } from './../api-testing.lib';
import { TestingLib } from './../testing.lib';

describe('Test Kanban API', () => {
  let main: { app: any; server: any };
  let token = '';
  beforeEach(async () => {
    MockLib.mockAMQPServiceInit();
    await TestingLib.connectToDB();
    await TestingLib.createTestTask();
    main = await ApiTestingLib.startHttpServer();
    token = await ApiTestingLib.login(main);
  });

  afterEach(async () => {
    MockLib.restoreAllMocks();
    await ApiTestingLib.closeHttpServer(main.server);
    await TestingLib.deleteTestUser();
    await TestingLib.closeDBConnection();
    token = '';
  });

  describe('Test GET /v1/kanbans/:id/tasks', () => {
    const END_POINT = `/v1/kanbans/${TestingLib.TEST_KANBAN}/tasks`;
    test('happy path', async () => {
      const testing = await supertest(main.app)
        .get(END_POINT)
        .set('Authorization', TOKEN_TYPE_BEARER + ' ' + token)
        .expect(HttpStatusCode.OK);

      expect(Array.isArray(testing.body.data)).toBeTruthy();
      expect(testing.body.data.length).toBe(1);
      expect(testing.body.data[0].id).toBe(TestingLib.TEST_TASK);
      expect(testing.body.data[0].name).toBe(TestingLib.TEST_TASK);
      expect(testing.body.data[0].status).toBe(TestingLib.TEST_KANBAN_STATUS[0].id);
    });

    test('permission denied', async () => {
      await supertest(main.app)
        .get(`/v1/kanbans/${TestingLib.NOT_EXISTED_TEST_KANBAN}/tasks`)
        .set('Authorization', TOKEN_TYPE_BEARER + ' ' + token)
        .expect(HttpStatusCode.FORBIDDEN);
    });

    test('missing token', async () => {
      await supertest(main.app).get(END_POINT).expect(HttpStatusCode.UNAUTHORIZED);
    });
  });
});
