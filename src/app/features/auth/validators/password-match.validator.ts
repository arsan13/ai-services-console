import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(
  passwordControlName: string = 'password',
  confirmPasswordControlName: string = 'confirmPassword'
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordControlName)?.value;
    const confirmPasswordControl = control.get(confirmPasswordControlName);
    const confirmPassword = confirmPasswordControl?.value;

    if (!confirmPasswordControl) {
      return null;
    }

    const currentErrors = confirmPasswordControl.errors ?? {};
    const { passwordMismatch, ...otherErrors } = currentErrors;

    if (!password || !confirmPassword) {
      confirmPasswordControl.setErrors(Object.keys(otherErrors).length > 0 ? otherErrors : null);
      return null;
    }

    if (password !== confirmPassword) {
      confirmPasswordControl.setErrors({ ...otherErrors, passwordMismatch: true });
      return { passwordMismatch: true };
    }

    confirmPasswordControl.setErrors(Object.keys(otherErrors).length > 0 ? otherErrors : null);
    return null;
  };
}
