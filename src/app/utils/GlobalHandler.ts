import { AbstractControl } from '@angular/forms';

export class GlobalHandler {
  private static instance: GlobalHandler;
  private baseUrl = 'https://api.calabriaparchi.it/api/v1';
  private isItalianLang : boolean | undefined;

  private constructor() {}

  static getInstance(): GlobalHandler {
    if (!GlobalHandler.instance) {
      GlobalHandler.instance = new GlobalHandler();
    }
    return GlobalHandler.instance;
  }

  isItalian(): boolean {
    if (this.isItalianLang === undefined) {
      this.isItalianLang = this.getLanguage('language') === 'it';
    }
    return this.isItalianLang;
  }

  setLanguage(key: string, value: string): void {
    localStorage.setItem(key, value);
    window.location.reload();
  }

  getLanguage(key: string): string {
    return localStorage.getItem(key) ?? 'it';
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getErrorMessage(control: AbstractControl<any, any> | null): string {
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
    if (control?.errors?.['pattern']) {
      return 'La password deve contenere almeno 1 maiuscola, 1 minuscola, 1 numero e può contenere solo i seguenti caratteri speciali ? ! _ - @ #';
    }
    return 'Valore non valido';
  }

  async handleFileInput(event: Event): Promise<{ file: File | null; url: string | null }> {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0] ?? null;

    if (!file) {
      return { file: null, url: null };
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === FileReader.DONE) {
          resolve({ file, url: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    });
  }

  async urlToFile(url: string, filename: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }
}
