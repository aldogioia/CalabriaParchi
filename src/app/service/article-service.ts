import { Injectable } from '@angular/core';
import {GlobalHandler} from '../utils/GlobalHandler';
import {HttpClient} from '@angular/common/http';
import {ArticleDto} from '../model/dto/ArticleDto';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private baseUrl = GlobalHandler.getInstance().getBaseUrl() + '/article';

  constructor(private http: HttpClient) {}

  getArticlesByParkId(parkId: string) {
    return this.http.get<ArticleDto[]>(`${this.baseUrl}/${parkId}`);
  }

  createArticle(formData: FormData) {
    return this.http.post<ArticleDto>(this.baseUrl, formData);
  }

  updateArticle(formData: FormData) {
    return this.http.put<ArticleDto>(this.baseUrl, formData);
  }

  deleteArticle(articleId: string, parkId: string) {
    return this.http.delete<void>(`${this.baseUrl}/${articleId}/${parkId}`);
  }
}
