import { Injectable } from '@angular/core';
import {GlobalHandler} from '../utils/GlobalHandler';
import {HttpClient} from '@angular/common/http';
import {InterestDto} from '../model/dto/InterestDto';
import {InterestType} from '../model/enum/InterestType';

@Injectable({
  providedIn: 'root'
})
export class InterestService {
  private baseUrl = GlobalHandler.getInstance().getBaseUrl() + '/interest';

  constructor(private http: HttpClient) {}

  getInterests() {
    return this.http.get<InterestDto[]>(`${this.baseUrl}/all`);
  }

  getSelectedInterests(ids: string[]) {
    return this.http.get<InterestDto[]>(`${this.baseUrl}/selected`, {params: {ids: ids}});
  }

  getInterestsLocationByParkId(parkId: string) {
    return this.http.get<InterestDto[]>(`${this.baseUrl}/${parkId}`, {params: {type: InterestType.LOCATION}});
  }

  getInterestsActivityByParkId(parkId: string) {
    return this.http.get<InterestDto[]>(`${this.baseUrl}/${parkId}`, {params: {type: InterestType.ACTIVITY}});
  }
}
