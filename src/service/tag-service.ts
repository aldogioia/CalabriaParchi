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
}
