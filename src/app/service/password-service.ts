import { Injectable } from '@angular/core';
import {AdminDto} from '../model/dto/AdminDto';
import {GlobalHandler} from '../utils/GlobalHandler';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  baseUrl = GlobalHandler.getInstance().getBaseUrl() + '/password';

  constructor(private http: HttpClient) { }

  requestPasswordReset(emailDto: { email: string }) {
    return this.http.post(this.baseUrl + '/request-reset', emailDto);
  }

  resetPassword(resetPasswordDto: { email: string, newPassword: string, verificationToken: string }) {
    return this.http.patch<AdminDto>(this.baseUrl + '/reset', resetPasswordDto);
  }

  updatePassword(updatePasswordDto: { userId: string, oldPassword: string, newPassword: string }) {
    return this.http.patch<AdminDto>(this.baseUrl + '/update', updatePasswordDto);
  }

}
