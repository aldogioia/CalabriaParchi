import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GlobalHandler} from '../utils/GlobalHandler';
import {ExperiencePostDto} from '../model/dto/ExperiencePostDto';

@Injectable({
  providedIn: 'root'
})
export class ExperiencePostService{
  private baseUrl = GlobalHandler.getInstance().getBaseUrl() + '/experience-post';

  constructor(private http: HttpClient) {}

  getAcceptedExperiencePostByPark(parkId: string) {
    const url = `${this.baseUrl}/accepted/${parkId}`;
    return this.http.get<ExperiencePostDto[]>(url);
  }

  getPendingExperiencePostByPark(parkId: string) {
    const url = `${this.baseUrl}/pending/${parkId}`;
    return this.http.get<ExperiencePostDto[]>(url);
  }

  createExperiencePost(formData: FormData) {
    return this.http.post(this.baseUrl, formData);
  }

  updateExperiencePostStatus(status: 'ACCEPTED' | 'REJECTED', id: string, parkId: string) {
    const url = `${this.baseUrl}/${id}/${parkId}`;
    return this.http.patch(url, null, { params: { status } });
  }
}
