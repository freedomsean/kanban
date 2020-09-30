import { DBMissingInitError, DBService } from './../../service/db.service';
import * as typeorm from 'typeorm';

describe('Test DBService', () => {
  describe('Test getInstance', () => {
    test('happy path', () => {
      expect(DBService.getInstance()).toBeInstanceOf(DBService);
    });
  });

  describe('Test getConnection', () => {
    test('without init', () => {
      expect(() => DBService.getInstance().getConnection()).toThrowError(DBMissingInitError);
    });

    test('with init', async () => {
      jest.spyOn(typeorm, 'createConnection').mockReturnValueOnce({} as any);
      await DBService.getInstance().init({
        dialect: 'string',
        host: 'string',
        port: 1,
        user: 'string',
        password: 'string',
        usedDatabase: 'string',
        needToSync: false,
        poolSize: 10
      });

      expect(DBService.getInstance().getConnection()).toBeTruthy();
      jest.restoreAllMocks();
    });
  });
});
