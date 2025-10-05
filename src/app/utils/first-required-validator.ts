import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function firstRequiredValidator(isFirst: boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (isFirst && (!control.value || !control.value.trim())) {
      return { required: true };
    }
    return null;
  };
}
