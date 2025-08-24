import { Injectable } from '@angular/core';
import {GlobalHandler} from '../utils/GlobalHandler';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  private baseUrl = GlobalHandler.getInstance().getBaseUrl() + '/itinerary';

  private wishlistKey = 'wishlist';
  private wishlistSubject = new BehaviorSubject<string[]>(this.loadWishlist());
  wishlist$ = this.wishlistSubject.asObservable();

  constructor(private http: HttpClient) {}

  generateItinerary(ids: string[], email: string){
    return this.http.post(this.baseUrl,ids, {params: {email: email}});
  }

  private loadWishlist(): string[] {
    const value = localStorage.getItem(this.wishlistKey);
    return value ? JSON.parse(value) : [];
  }

  private saveWishlist(ids: string[]): void {
    localStorage.setItem(this.wishlistKey, JSON.stringify(ids));
    this.wishlistSubject.next(ids);
  }

  public toggleWishlist(id: string): void {
    const current = this.loadWishlist();
    if (current.includes(id)) {
      this.removeFromWishlist(id);
    } else {
      this.addToWishlist(id);
    }
  }

  private addToWishlist(id: string): void {
    const current = this.loadWishlist();
    current.push(id);
    this.saveWishlist(current);
  }

  private removeFromWishlist(id: string): void {
    let current = this.loadWishlist();
    current = current.filter(itemId => itemId !== id);
    this.saveWishlist(current);
  }

  public isInWishlist(id: string): boolean {
    const current = this.loadWishlist();
    return current.includes(id);
  }

  public clearWishlist(): void {
    localStorage.removeItem(this.wishlistKey);
    this.wishlistSubject.next([]);
  }
}
