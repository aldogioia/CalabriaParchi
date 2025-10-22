import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GlobalHandler} from '../utils/GlobalHandler';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private baseUrl = GlobalHandler.getInstance().getBaseUrl() + '/newsletter';

  constructor(private http: HttpClient) {}

  getAllSubscribers() {
    return this.http.get<string[]>(this.baseUrl);
  }

  sendNewsletter(formData: FormData) {
    const url = `${this.baseUrl}/send`;
    return this.http.post(url, formData);
  }

  subscribe(email: string) {
    const url = `${this.baseUrl}/subscribe`;
    return this.http.post(url, { email: email });
  }

  unsubscribe(subscriberId: string) {
    const url = `${this.baseUrl}/unsubscribe`;
    return this.http.post(url, { id: subscriberId });
  }
}
