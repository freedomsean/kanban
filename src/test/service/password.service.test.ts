import { PasswordService } from '../../service/password.service';
import * as bcrypt from 'bcryptjs';
import { Env } from '../../constant/env.constant';

describe('Test PasswordService', () => {
  test('Test compareSecureHash', () => {
    const password = 'testing';
    const salt = bcrypt.genSaltSync(Env.SALT_ROUNDS);
    const hash = bcrypt.hashSync(password, salt);
    expect(PasswordService.compareSecureHash(password, hash)).toBeTruthy();
    expect(PasswordService.compareSecureHash(password + password, hash)).toBeFalsy();
  });

  test('Test generateSecureHash', () => {
    const password = 'testing';
    const hash = PasswordService.generateSecureHash(password);
    expect(bcrypt.compareSync(password, hash)).toBeTruthy();
  });
});
