import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { UserProfile, ProfileResponse } from '../interfaces/userProfile';
import { Event } from '../interfaces/event';
import { Auth } from './auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://cultural-agenda.onrender.com/profiles';
  private authService = inject(Auth);

  async getProfileById(id: string): Promise<ProfileResponse> {
    return firstValueFrom(this.http.get<ProfileResponse>(`${this.apiUrl}/${id}`));
  }

  async updateProfile(profileData: UserProfile): Promise<ProfileResponse> {
    const token = await this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return firstValueFrom(
      this.http.put<ProfileResponse>(this.apiUrl, profileData, { headers })
    );
  }

  getProfileEvents(id: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/${id}/events`);
  }

  async getAttendingEvents(): Promise<Event[]> {
    const token = await this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return firstValueFrom(
      this.http.get<Event[]>(`${this.apiUrl}/me/attending`, { headers })
    );
  }

  async getMyProfile(): Promise<ProfileResponse> {
    const token = await this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const user = await this.authService.getUser();
    if(!user) throw new Error('Not authenticated');
    return firstValueFrom(
      this.http.get<ProfileResponse>(`${this.apiUrl}/${user.id}`, { headers })
    );
  }
}