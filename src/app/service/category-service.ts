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

  addCategory(category: { name: string, englishName: string }) {
    return this.http.post<CategoryDto>(this.baseUrl, category);
  }

  updateCategory(category: { id: string, englishName: string, name: string }) {
    return this.http.put<CategoryDto>(this.baseUrl, category);
  }

  deleteCategory(categoryId: string) {
    return this.http.delete<void>(`${this.baseUrl}/${categoryId}`);
  }
}
