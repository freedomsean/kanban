export interface ValidationResult {
  errors: any;
  isValid: boolean;
}

export class ValidatorUtil {
  /**
   * Accumulate Validation Results.
   *
   * @param {any} oriResult - Original result.
   * @param {any} newResult - New result.
   */
  static accumulateErrors(oriResult: ValidationResult, newResult?: ValidationResult): ValidationResult {
    if (!newResult) {
      return {
        isValid: oriResult.isValid,
        errors: Object.keys(oriResult.errors).length > 0 ? [].concat(oriResult.errors) : []
      };
    }

    const isValid = oriResult.isValid && newResult.isValid;
    const errors = newResult.isValid ? oriResult.errors : oriResult.errors.concat(newResult.errors);
    return { isValid, errors };
  }

  /**
   * Validate whether the given value is undefined.
   *
   * @param {any} val - Value.
   * @param {string} fieldName - Field name.
   */
  static validateIsDefined(val: any, fieldName: string) {
    const errors: any = {};
    const isValid = typeof val !== 'undefined';

    if (!isValid) {
      errors[fieldName] = `the field: ${fieldName} is empty`;
    }

    return {
      errors,
      isValid
    };
  }
}
