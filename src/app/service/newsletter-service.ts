import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GlobalHandler} from '../utils/GlobalHandler';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private baseUrl = GlobalHandler.getInstance().getBaseUrl() + '/newsletter';

  constructor(private http: HttpClient) {}

  subscribe(email: string) {
    const url = `${this.baseUrl}/subscribe`;
    return this.http.post(url, email);
  }

  unsubscribe(email: string) {
    const url = `${this.baseUrl}/unsubscribe`;
    return this.http.post(url, email);
  }
}
