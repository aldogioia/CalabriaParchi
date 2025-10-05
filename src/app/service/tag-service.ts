import { Injectable } from '@angular/core';
import {GlobalHandler} from '../utils/GlobalHandler';
import {HttpClient} from '@angular/common/http';
import {TagDto} from '../model/dto/TagDto';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private baseUrl = GlobalHandler.getInstance().getBaseUrl() + '/tag';

  constructor(private http: HttpClient) {}

  getTags() {
    return this.http.get<TagDto[]>(this.baseUrl);
  }

  addTag(tag: { name: string, englishName: string, color: string }) {
    return this.http.post<TagDto>(this.baseUrl, tag);
  }

  updateTag(tag: { id: string, name: string, englishName: string, color: string }) {
    return this.http.put<TagDto>(this.baseUrl, tag);
  }

  deleteTag(tagId: string) {
    return this.http.delete<void>(`${this.baseUrl}/${tagId}`);
  }
}
