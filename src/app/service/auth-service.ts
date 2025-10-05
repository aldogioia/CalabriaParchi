import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap, throwError} from 'rxjs';
import {GlobalHandler} from '../utils/GlobalHandler';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = GlobalHandler.getInstance().getBaseUrl() + '/auth';
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  constructor(private http: HttpClient) {}

  signIn(signInData: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/sign-in`, signInData)
      .pipe(tap(response => {
        console.log('[AuthService] signIn response:', response);
        if (response.accessToken && response.refreshToken) {
          this.setTokens(response.accessToken, response.refreshToken);
        } else {
          console.error('[AuthService] Tokens mancanti nella risposta!');
        }
      })
    );
  }

  refreshToken(): Observable<{ accessToken: string; refreshToken?: string }> {
    const refresh = this.getRefreshToken();
    if (!refresh) {
      console.warn('[AuthService] Nessun refresh token disponibile');
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<{ accessToken: string; refreshToken?: string }>(
      `${this.baseUrl}/refresh`,
      {},
      {
        headers: { 'X-Refresh-Token': refresh }
      }
    ).pipe(
      tap(res => {
        if (res?.accessToken) {
          this.setAccessToken(res.accessToken);
          console.log('[AuthService] Nuovo access token salvato');
        }
        if (res?.refreshToken) {
          this.setRefreshToken(res.refreshToken);
          console.log('[AuthService] Nuovo refresh token salvato');
        }
      })
    );
  }


  signOut() {
    console.log('[AuthService] signOut');
    const accessToken = this.getAccessToken();
    if (!accessToken) return throwError(() => 'No access token');

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return throwError(() => 'No refresh token');

    const headers = { 'X-Refresh-Token': refreshToken, 'Authorization': accessToken };
    return this.http.post<any>(`${this.baseUrl}/sign-out`, {}, { headers: headers })
      .pipe(
        tap({
          next: () => {
            this.clearTokens();
            console.log('[AuthService] Token rimossi dopo signOut');
            window.location.href = '/';
          },
          error: (err) => {
            console.error('[AuthService] Errore durante signOut', err);
          }
        })
      );
  }

  setTokens(access: string, refresh: string) {
    localStorage.setItem(this.accessTokenKey, access);
    localStorage.setItem(this.refreshTokenKey, refresh);
  }

  setAccessToken(token: string) {
    localStorage.setItem(this.accessTokenKey, token);
  }

  setRefreshToken(token: string) {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  clearTokens() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }
}
