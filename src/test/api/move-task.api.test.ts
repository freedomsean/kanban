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
    await TestingLib.connectToDB();
    await TestingLib.createTestTask();
    main = await ApiTestingLib.startHttpServer();
    token = await ApiTestingLib.login(main);
  });

  afterEach(async () => {
    await ApiTestingLib.closeHttpServer(main.server);
    await TestingLib.deleteTestUser();
    await TestingLib.closeDBConnection();
    token = '';
  });

  describe('Test PUT /v1/tasks/:id/:directions', () => {
    const doHappyPathTesting = async (direction: string, newStatusIndex: number) => {
      const testing = await supertest(main.app)
        .put(`/v1/tasks/${TestingLib.TEST_TASK}/${direction}`)
        .set('Authorization', TOKEN_TYPE_BEARER + ' ' + token)
        .expect(HttpStatusCode.OK);
      expect(testing.body.data.id).toBe(TestingLib.TEST_KANBAN_STATUS[newStatusIndex].id);
      expect(testing.body.data.name).toBe(TestingLib.TEST_KANBAN_STATUS[newStatusIndex].name);

      const task = await DBService.getInstance().getConnection().getRepository(Task).findOne(TestingLib.TEST_TASK);
      expect(task!.status).toBe(TestingLib.TEST_KANBAN_STATUS[newStatusIndex].id);
      expect(task!.updatedAt.getTime()).toBeGreaterThan(task!.createdAt.getTime());
    };

    const doAchiveLimitedMovingTesting = async (direction: string) => {
      await supertest(main.app)
        .put(`/v1/tasks/${TestingLib.TEST_TASK}/${direction}`)
        .set('Authorization', TOKEN_TYPE_BEARER + ' ' + token)
        .expect(HttpStatusCode.CONFLICT);
    };

    test('forward happy path', async () => {
      await doHappyPathTesting('forward', 1);
    });

    test('backward happy path', async () => {
      await TestingLib.changeTaskStatus(TestingLib.TEST_KANBAN_STATUS.length - 1);
      await doHappyPathTesting('backward', TestingLib.TEST_KANBAN_STATUS.length - 2);
    });

    test('forward achieve limit', async () => {
      await TestingLib.changeTaskStatus(TestingLib.TEST_KANBAN_STATUS.length - 1);
      await doAchiveLimitedMovingTesting('forward');
    });

    test('backward achieve limit', async () => {
      await doAchiveLimitedMovingTesting('backward');
    });

    test('task does not exist', async () => {
      await supertest(main.app)
        .put(`/v1/tasks/${TestingLib.NOT_EXISTED_TEST_TASK}/backward`)
        .set('Authorization', TOKEN_TYPE_BEARER + ' ' + token)
        .expect(HttpStatusCode.NOT_FOUND);
    });

    test('missing token', async () => {
      await supertest(main.app)
        .put(`/v1/tasks/${TestingLib.NOT_EXISTED_TEST_TASK}/backward`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });

    test('wrong direction', async () => {
      await supertest(main.app).put(`/v1/tasks/${TestingLib.TEST_TASK}/back`).expect(HttpStatusCode.NOT_FOUND);
    });
  });
});
