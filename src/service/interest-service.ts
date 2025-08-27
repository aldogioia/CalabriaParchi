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

  getInterests(keyword: string, parks: string[], tags: string[], categories: string[]): Observable<InterestDto[]> {
    const body = {
      keyword,
      parks,
      tags,
      categories
    };
    return this.http.post<InterestDto[]>(`${this.baseUrl}/search`, body);
  }

  getSelectedInterests(ids: string[]): Observable<InterestDto[]> {
    return this.http.get<InterestDto[]>(`${this.baseUrl}/selected`, { params: { ids } });
  }

  getInterestsLocationByParkId(parkId: string): Observable<InterestDto[]> {
    return this.http.get<InterestDto[]>(`${this.baseUrl}/${parkId}`, { params: { type: InterestType.LOCATION } });
  }

  getInterestsActivityByParkId(parkId: string): Observable<InterestDto[]> {
    return this.http.get<InterestDto[]>(`${this.baseUrl}/${parkId}`, { params: { type: InterestType.ACTIVITY } });
  }
}
