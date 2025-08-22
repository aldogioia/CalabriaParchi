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

  public setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getItem<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : null;
  }

  private wishlistKey = 'wishlist';

  public addToWishlist(id: string): void {
    const current = this.getWishlist();
    if (!current.includes(id)) {
      current.push(id);
      this.setItem(this.wishlistKey, current);
    }
  }

  public removeFromWishlist(id: string): void {
    let current = this.getWishlist();
    current = current.filter(itemId => itemId !== id);
    this.setItem(this.wishlistKey, current);
  }

  public getWishlist(): string[] {
    return this.getItem<string[]>(this.wishlistKey) ?? [];
  }

  public clearWishlist(): void {
    localStorage.removeItem(this.wishlistKey);
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }
}
