import { Task } from './../model/task.model';
import { KanbanStatus } from './../model/kanban-status.model';
import { UUIDType } from './../service/uuid.service';
import { PasswordService } from './../service/password.service';
import { Env } from '../constant/env.constant';
import { User } from '../model/user.model';
import { DBService } from './../service/db.service';
import { Kanban } from '../model/kanban.model';
import { UserKanban } from '../model/user-kanban.model';

export class TestingLib {
  static readonly TEST_USER = UUIDType.USER + 'testing';
  static readonly NOT_EXISTED_TEST_USER = UUIDType.USER + 'not_existed';

  static readonly TEST_KANBAN = UUIDType.KANBAN + 'testing';
  static readonly NOT_EXISTED_TEST_KANBAN = UUIDType.KANBAN + 'not_existed';

  static readonly TEST_KANBAN_STATUS: { id: string; name: string }[] = [
    { id: UUIDType.KANBANSTATUS + 'testing1', name: 'Backlog' },
    { id: UUIDType.KANBANSTATUS + 'testing2', name: 'To Do' },
    { id: UUIDType.KANBANSTATUS + 'testing3', name: 'Ongoing' },
    { id: UUIDType.KANBANSTATUS + 'testing4', name: 'Done' }
  ];

  static readonly TEST_TASK = UUIDType.TASK + 'testing';
  static readonly NOT_EXISTED_TEST_TASK = UUIDType.TASK + 'not_existed';

  static async connectToDB() {
    await DBService.getInstance().init({
      dialect: Env.DB_DIALECT,
      host: Env.DB_HOST,
      port: Env.DB_PORT,
      user: Env.DB_USER,
      password: Env.DB_PASSWORD,
      usedDatabase: Env.DB_USED_DATABASE,
      needToSync: Env.DB_SYNC,
      poolSize: Env.DB_POOL_MAX_CONNECTION
    });
  }

  static async closeDBConnection() {
    await DBService.getInstance().closeConnection();
  }

  static async createTestUser() {
    await DBService.getInstance()
      .getConnection()
      .getRepository(User)
      .insert({
        id: TestingLib.TEST_USER,
        username: TestingLib.TEST_USER,
        password: PasswordService.generateSecureHash(TestingLib.TEST_USER),
        isDeleted: false
      });
  }

  static async createTestKanban() {
    await TestingLib.createTestUser();

    await DBService.getInstance().getConnection().getRepository(Kanban).insert({
      id: TestingLib.TEST_KANBAN,
      name: TestingLib.TEST_KANBAN
    });

    for (let i = 0; i < TestingLib.TEST_KANBAN_STATUS.length; i++) {
      await DBService.getInstance()
        .getConnection()
        .getRepository(KanbanStatus)
        .insert({
          ...TestingLib.TEST_KANBAN_STATUS[i],
          order: i,
          kanbanId: TestingLib.TEST_KANBAN
        });
    }

    await DBService.getInstance().getConnection().getRepository(UserKanban).insert({
      kanbanId: TestingLib.TEST_KANBAN,
      userId: TestingLib.TEST_USER,
      type: 'admin'
    });

    await DBService.getInstance().getConnection().getRepository(User).update(
      {
        id: TestingLib.TEST_USER
      },
      {
        defaultKanbanId: TestingLib.TEST_KANBAN
      }
    );
  }

  static async createTestTask() {
    await TestingLib.createTestKanban();
    await DBService.getInstance().getConnection().getRepository(Task).insert({
      id: TestingLib.TEST_TASK,
      name: TestingLib.TEST_TASK,
      status: TestingLib.TEST_KANBAN_STATUS[0].id,
      lastModified: TestingLib.TEST_USER,
      kanbanId: TestingLib.TEST_KANBAN
    });
  }

  static async deleteTestTask() {
    await DBService.getInstance().getConnection().getRepository(Task).delete({
      lastModified: TestingLib.TEST_USER
    });
  }

  static async deleteTestKanban() {
    await TestingLib.deleteTestTask();
    await DBService.getInstance()
      .getConnection()
      .getRepository(UserKanban)
      .delete({ kanbanId: TestingLib.TEST_KANBAN });

    await DBService.getInstance()
      .getConnection()
      .getRepository(KanbanStatus)
      .delete({ kanbanId: TestingLib.TEST_KANBAN });

    await DBService.getInstance().getConnection().getRepository(Kanban).delete({ id: TestingLib.TEST_KANBAN });
  }

  static async deleteTestUser() {
    await TestingLib.deleteTestKanban();
    await DBService.getInstance().getConnection().getRepository(User).delete({
      id: TestingLib.TEST_USER
    });
  }
}
