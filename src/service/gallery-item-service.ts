import { Injectable } from '@angular/core';
import {GlobalHandler} from '../utils/GlobalHandler';
import {HttpClient} from '@angular/common/http';
import {GalleryItemDto} from '../model/dto/GalleryItemDto';

@Injectable({
  providedIn: 'root'
})
export class GalleryItemService {
  private baseUrl = GlobalHandler.getInstance().getBaseUrl() + '/gallery-item';

  constructor(private http: HttpClient) {}

  getGalleryItemsByParkId(parkId: string) {
    return this.http.get<GalleryItemDto[]>(`${this.baseUrl}/${parkId}`);
  }
}
