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
}
