import { ValidatorUtil, ValidationResult } from './../../util/validator.util';

describe('Test ValidatorUtil', () => {
  describe('Test validateIsDefined', () => {
    test('without error', () => {
      const result = ValidatorUtil.validateIsDefined(1, 'a');
      expect(result.isValid).toBe(true);
      expect(result.errors['a']).toBeFalsy();
    });

    test('with error', () => {
      const result = ValidatorUtil.validateIsDefined(undefined, 'b');
      expect(result.isValid).toBe(false);
      expect(result.errors['b']).toBeTruthy();
    });
  });

  describe('Test accumulateErrors', () => {
    test('Test accumulateErrors with oriResult is correct and newResult is wrong', () => {
      const result: ValidationResult = { isValid: true, errors: [] };
      const newResult = { isValid: false, errors: [{}] };
      const expected = { isValid: false, errors: [{}] };
      const finalValidation = ValidatorUtil.accumulateErrors(result, newResult);
      expect(JSON.stringify(finalValidation)).toBe(JSON.stringify(expected));
    });

    test('Test accumulateErrors with oriResult is wrong and newResult is correct', () => {
      const result: ValidationResult = { isValid: false, errors: [{ a: 1 }] };
      const newResult = { isValid: true, errors: [] };
      const expected = { isValid: false, errors: [{ a: 1 }] };
      const finalValidation = ValidatorUtil.accumulateErrors(result, newResult);
      expect(JSON.stringify(finalValidation)).toBe(JSON.stringify(expected));
    });

    test('Test accumulateErrors with oriResult is wrong and newResult is wrong', () => {
      const result: ValidationResult = { isValid: false, errors: [{ a: 1 }] };
      const newResult = { isValid: false, errors: [{}] };
      const expected = { isValid: false, errors: [{ a: 1 }, {}] };
      const finalValidation = ValidatorUtil.accumulateErrors(result, newResult);
      expect(JSON.stringify(finalValidation)).toBe(JSON.stringify(expected));
    });

    test('Test accumulateErrors with oriResult is correct and newResult is correct', () => {
      const result: ValidationResult = { isValid: true, errors: [] };
      const newResult = { isValid: true, errors: [] };
      const expected = { isValid: true, errors: [] };
      const finalValidation = ValidatorUtil.accumulateErrors(result, newResult);
      expect(JSON.stringify(finalValidation)).toBe(JSON.stringify(expected));
    });

    test('Test accumulateErrors without newResult and with correct oriResult which contains the errors are an array', () => {
      const result: ValidationResult = { isValid: true, errors: [] };
      const expected = { isValid: true, errors: [] };
      const finalValidation = ValidatorUtil.accumulateErrors(result);
      expect(JSON.stringify(finalValidation)).toBe(JSON.stringify(expected));
    });

    test('Test accumulateErrors without newResult and with wrong oriResult which contains the errors are an array', () => {
      const result: ValidationResult = { isValid: false, errors: [{ a: 1 }] };
      const expected = { isValid: false, errors: [{ a: 1 }] };
      const finalValidation = ValidatorUtil.accumulateErrors(result);
      expect(JSON.stringify(finalValidation)).toBe(JSON.stringify(expected));
    });

    test('Test accumulateErrors without newResult and with correct oriResult which contains the errors are not an array', () => {
      const result: ValidationResult = { isValid: true, errors: {} };
      const expected = { isValid: true, errors: [] };
      const finalValidation = ValidatorUtil.accumulateErrors(result);
      expect(JSON.stringify(finalValidation)).toBe(JSON.stringify(expected));
    });

    test('Test accumulateErrors without newResult and with wrong oriResult which contains the errors are not an array', () => {
      const result: ValidationResult = { isValid: false, errors: { a: 1 } };
      const expected = { isValid: false, errors: [{ a: 1 }] };
      const finalValidation = ValidatorUtil.accumulateErrors(result);
      expect(JSON.stringify(finalValidation)).toBe(JSON.stringify(expected));
    });
  });
});
