import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GlobalHandler} from '../utils/GlobalHandler';
import {AdminDto} from '../model/dto/AdminDto';

@Injectable({
  providedIn: 'root'
})
export class AdminsService {
  baseUrl = GlobalHandler.getInstance().getBaseUrl() + '/admin';

  constructor(private http: HttpClient) { }

  getAdmins() {
    return this.http.get<AdminDto[]>(this.baseUrl);
  }

  addAdmin(admin: { parkId: string, name: string, surname: string, phoneNumber: string, email: string }) {
    return this.http.post<AdminDto>(this.baseUrl, admin);
  }

  updateAdmin(admin: { id: string, parkId: string, name: string, surname: string, phoneNumber: string, email: string }) {
    return this.http.put<AdminDto>(this.baseUrl, admin);
  }

  deleteAdmin(id: string) {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url);
  }
}
