import { Injectable } from '@angular/core';
import {GlobalHandler} from '../utils/GlobalHandler';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  private baseUrl = GlobalHandler.getInstance().getBaseUrl() + '/itinerary';

  constructor(private http: HttpClient) {}

  generateItinerary(ids: string[], email: string){
    return this.http.post(this.baseUrl, {params: {ids: ids, email: email}});
  }
}
