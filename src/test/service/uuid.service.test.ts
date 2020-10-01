import { UUIDService, UUIDType } from '../../service/uuid.service';

describe('Test UUIDService', () => {
  describe('Test generateUniqueId', () => {
    test('happy path', () => {
      expect(UUIDService.generateUniqueId(UUIDType.USER).startsWith(UUIDType.USER));
      expect(UUIDService.generateUniqueId(UUIDType.KANBAN).startsWith(UUIDType.KANBAN));
      expect(UUIDService.generateUniqueId(UUIDType.TASK).startsWith(UUIDType.TASK));
    });
  });
});
