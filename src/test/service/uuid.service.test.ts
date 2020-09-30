import { UUIDService, UUIDType } from '../../service/uuid.service';

describe('Test UUIDService', () => {
  describe('Test generateUniqueId', () => {
    test('happy path', () => {
      expect(UUIDService.generateUniqueId(UUIDType.User).startsWith(UUIDType.User));
      expect(UUIDService.generateUniqueId(UUIDType.Kanban).startsWith(UUIDType.Kanban));
      expect(UUIDService.generateUniqueId(UUIDType.Task).startsWith(UUIDType.Task));
    });
  });
});
