import { MockLib } from './../mock.lib';
import { Task } from './../../model/task.model';
import { DBService } from './../../service/db.service';
import { TOKEN_TYPE_BEARER } from './../../constant/token.constant';
import { TestingLib } from './../testing.lib';
import { ApiTestingLib } from './../api-testing.lib';
import * as supertest from 'supertest';

import { HttpStatusCode } from './../../constant/response-msg.constant';

describe('Test Task API', () => {
  let main: { app: any; server: any };
  let token = '';
  beforeEach(async () => {
    MockLib.mockAMQPServiceInit();
    MockLib.mockNotificationServiceCreateTask();
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

  describe('Test POST /v1/tasks', () => {
    const END_POINT = '/v1/tasks';

    test('happy path', async () => {
      const testing = await supertest(main.app)
        .post(END_POINT)
        .set('Authorization', TOKEN_TYPE_BEARER + ' ' + token)
        .send({
          name: TestingLib.TEST_NEW_TASK,
          kanbanId: TestingLib.TEST_KANBAN
        })
        .expect(HttpStatusCode.CREATED);
      expect(testing.body.data.name).toBe(TestingLib.TEST_NEW_TASK);
      expect(testing.body.data.lastModified).toBe(TestingLib.TEST_USER);

      const task = await DBService.getInstance().getConnection().getRepository(Task).findOne({
        name: TestingLib.TEST_NEW_TASK
      });
      expect(task).toBeTruthy();
    });

    test('forbidden', async () => {
      await supertest(main.app)
        .post(END_POINT)
        .set('Authorization', TOKEN_TYPE_BEARER + ' ' + token)
        .send({
          name: TestingLib.TEST_NEW_TASK,
          kanbanId: TestingLib.NOT_EXISTED_TEST_KANBAN
        })
        .expect(HttpStatusCode.FORBIDDEN);
    });

    test('unauthorized', async () => {
      await supertest(main.app)
        .post(END_POINT)
        .send({
          name: TestingLib.TEST_NEW_TASK,
          kanbanId: TestingLib.TEST_KANBAN
        })
        .expect(HttpStatusCode.UNAUTHORIZED);
    });

    test('missing parameters', async () => {
      await supertest(main.app)
        .post(END_POINT)
        .set('Authorization', TOKEN_TYPE_BEARER + ' ' + token)
        .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);
    });
  });
});
