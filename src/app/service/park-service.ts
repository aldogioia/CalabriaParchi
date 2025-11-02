import { Injectable } from '@angular/core';
import { GlobalHandler } from '../utils/GlobalHandler';
import { HttpClient } from '@angular/common/http';
import { ParkDto } from '../model/dto/ParkDto';
import { AuthService } from './auth-service';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParkService {
  private baseUrl = GlobalHandler.getInstance().getBaseUrl() + '/park';
  private parksCache$: BehaviorSubject<ParkDto[] | null> = new BehaviorSubject<ParkDto[] | null>(null);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private loadParksFromApi(filtered: boolean): Observable<ParkDto[]> {
    if (filtered) {
      if (this.authService.getUserRoleFromToken() === 'ROLE_SUPER_ADMIN') {
        return this.http.get<ParkDto[]>(`${this.baseUrl}/all`);
      } else {
        const parkId = this.authService.getParkIdFromToken();
        if (parkId != null) {
          return this.getPark(parkId).pipe(map(park => [park]));
        } else {
          return of([]);
        }
      }
    } else {
      return this.http.get<ParkDto[]>(`${this.baseUrl}/all`);
    }
  }

  getPark(parkId: string) {
    return this.http.get<ParkDto>(`${this.baseUrl}/${parkId}`);
  }

  getParks(filtered: boolean = false, forceRefresh: boolean = false): Observable<ParkDto[]> {
    if (!forceRefresh && this.parksCache$.value !== null) {
      return this.parksCache$.asObservable().pipe(
        map(parks => parks ?? [])
      );
    }

    return this.loadParksFromApi(filtered).pipe(
      tap(parks => this.parksCache$.next(parks))
    );
  }

  createPark(formData: FormData) {
    return this.http.post<ParkDto>(this.baseUrl, formData).pipe(
      tap(() => this.refreshCache())
    );
  }

  updatePark(formData: FormData) {
    return this.http.put<ParkDto>(this.baseUrl, formData).pipe(
      tap(() => this.refreshCache())
    );
  }

  deletePark(parkId: string) {
    return this.http.delete<void>(`${this.baseUrl}/${parkId}`).pipe(
      tap(() => this.refreshCache())
    );
  }

  refreshCache(filtered: boolean = false): void {
    this.loadParksFromApi(filtered).subscribe(parks => this.parksCache$.next(parks));
  }

  clearCache(): void {
    this.parksCache$.next(null);
  }
}
