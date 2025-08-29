import { Injectable } from '@angular/core';
import {GlobalHandler} from '../utils/GlobalHandler';
import {HttpClient} from '@angular/common/http';
import {ParkDto} from '../model/dto/ParkDto';

@Injectable({
  providedIn: 'root'
})
export class ParkService {
  private baseUrl = GlobalHandler.getInstance().getBaseUrl() + '/park';

  constructor(private http: HttpClient) {}

  getPark(parkId: string) {
    return this.http.get<ParkDto>(`${this.baseUrl}/${parkId}`);
  }

  getParks() {
    return this.http.get<ParkDto[]>(`${this.baseUrl}/all`);
  }

  createPark(image: File, name: string, isMarine: boolean) {
    return this.http.post<ParkDto>(this.baseUrl, {image: image, name: name, isMarine: isMarine});
  }

  updatePark(parkId: string, image: File, name: string, isMarine: boolean) {
    return this.http.put<ParkDto>(this.baseUrl, {id: parkId, image: image, name: name, isMarine: isMarine});

  }
}
