import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GlobalHandler} from '../utils/GlobalHandler';
import {ExperiencePostDto} from '../model/dto/ExperiencePostDto';

@Injectable({
  providedIn: 'root'
})
export class ShareExperienceService{
  private baseUrl = GlobalHandler.getInstance().getBaseUrl() + '/experience-post';

  constructor(private http: HttpClient) {}

  getExperiencePostByPark(parkId: string) {
    const url = `${this.baseUrl}/${parkId}`;
    return this.http.get<ExperiencePostDto[]>(url);
  }

  share(formData: FormData) {
    return this.http.post(this.baseUrl, formData);
  }
}
