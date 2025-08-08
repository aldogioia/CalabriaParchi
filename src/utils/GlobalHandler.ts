export class GlobalHandler {
  private static instance: GlobalHandler;

  private constructor() {}

  public static getInstance(): GlobalHandler {
    if (!GlobalHandler.instance) {
      GlobalHandler.instance = new GlobalHandler();
    }
    return GlobalHandler.instance;
  }

  public setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public getItem(key: string): string | null {
    return localStorage.getItem(key);
  }
}
