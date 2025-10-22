import { Injectable } from '@angular/core';
import {GlobalHandler} from '../utils/GlobalHandler';
import {HttpClient} from '@angular/common/http';
import {GuideDto} from '../model/dto/GuideDto';

@Injectable({
  providedIn: 'root'
})
export class GuideService {
  private baseUrl = GlobalHandler.getInstance().getBaseUrl() + '/guide';

  constructor(private http: HttpClient) {}

  getAllGuideByParkId(parkId: string) {
    const url = `${this.baseUrl}/${parkId}`;
    return this.http.get<GuideDto[]>(url);
  }

  createGuide(formData: FormData) {
    return this.http.post<GuideDto>(this.baseUrl, formData);
  }

  deleteGuide(id: string, parkId: string) {
    const url = `${this.baseUrl}/${id}/${parkId}`;
    return this.http.delete(url);
  }
}
