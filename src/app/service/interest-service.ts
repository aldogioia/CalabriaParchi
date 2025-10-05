import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { InterestDto } from '../model/dto/InterestDto';
import { GlobalHandler } from '../utils/GlobalHandler';
import {InterestType} from '../model/enum/InterestType';


@Injectable({
  providedIn: 'root'
})
export class InterestService {
  private baseUrl = GlobalHandler.getInstance().getBaseUrl() + '/interest';

  constructor(private http: HttpClient) {}

  getSelectedInterests(ids: string[]): Observable<InterestDto[]> {
    return this.http.get<InterestDto[]>(`${this.baseUrl}/selected`, { params: { ids } });
  }

  getInterests(parkId: string, type?: InterestType): Observable<InterestDto[]> {
    return this.http.get<InterestDto[]>(`${this.baseUrl}/${parkId}`, {params: type ? { type: type } : undefined});
  }

  searchInterests(keyword: string, parks: string[], tags: string[], categories: string[]): Observable<InterestDto[]> {
    const body = {
      keyword,
      parks,
      tags,
      categories
    };
    return this.http.post<InterestDto[]>(`${this.baseUrl}/search`, body);
  }

  createInterest(formData: FormData): Observable<InterestDto> {
    return this.http.post<InterestDto>(this.baseUrl, formData);
  }

  updateInterest(formData: FormData): Observable<InterestDto> {
    return this.http.put<InterestDto>(this.baseUrl, formData);
  }

  deleteInterest(interestId: string, parkId: string): Observable<void> {
    const url = `${this.baseUrl}/${interestId}/${parkId}`;
    return this.http.delete<void>(url);
  }
}
