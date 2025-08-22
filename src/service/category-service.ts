import { Injectable } from '@angular/core';
import {GlobalHandler} from '../utils/GlobalHandler';
import {HttpClient} from '@angular/common/http';
import {CategoryDto} from '../model/dto/CategoryDto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = GlobalHandler.getInstance().getBaseUrl() + '/category';

  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<CategoryDto[]>(this.baseUrl);
  }
}
