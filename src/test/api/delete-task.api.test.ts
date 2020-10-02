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
    MockLib.mockNotificationServiceDeleteTask();
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

  describe('Test DELETE /v1/tasks/:id', () => {
    const END_POINT = `/v1/tasks/${TestingLib.TEST_TASK}`;
    test('happy path', async () => {
      await supertest(main.app)
        .delete(END_POINT)
        .set('Authorization', TOKEN_TYPE_BEARER + ' ' + token)
        .expect(HttpStatusCode.NO_CONTENT);

      const task = await DBService.getInstance().getConnection().getRepository(Task).findOne(TestingLib.TEST_TASK);
      expect(task!.isDeleted).toBeTruthy();
      expect(task!.lastModified).toBe(TestingLib.TEST_USER);
      expect(task!.updatedAt.getTime()).toBeGreaterThan(task!.createdAt.getTime());
    });

    test('task does not exist', async () => {
      await supertest(main.app)
        .delete(`/v1/tasks/${TestingLib.NOT_EXISTED_TEST_TASK}`)
        .set('Authorization', TOKEN_TYPE_BEARER + ' ' + token)
        .expect(HttpStatusCode.NOT_FOUND);
    });

    test('missing token', async () => {
      await supertest(main.app).delete(END_POINT).expect(HttpStatusCode.UNAUTHORIZED);
    });
  });
});
