import {AbstractControl} from '@angular/forms';

export class GlobalHandler {
  private static instance: GlobalHandler;
  private baseUrl = 'http://localhost:8080/api/v1';

  private constructor() {}

  public static getInstance(): GlobalHandler {
    if (!GlobalHandler.instance) {
      GlobalHandler.instance = new GlobalHandler();
    }
    return GlobalHandler.instance;
  }

  public setLanguage(key: string, value: string): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getLanguage(key: string): string {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as string : 'it';
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public getErrorMessage(control: AbstractControl<any,any,any> | null): string {
    if (control?.errors?.['required']) {
      return 'Campo obbligatorio';
    }
    if (control?.errors?.['email']) {
      return 'Formato email non valido';
    }
    if (control?.errors?.['minlength']) {
      return `Minimo ${control.errors['minlength'].requiredLength} caratteri`;
    }
    if (control?.errors?.['maxlength']) {
      return `Massimo ${control.errors['maxlength'].requiredLength} caratteri`;
    }
    return 'Valore non valido';
  }
}
