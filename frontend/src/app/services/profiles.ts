import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { UserProfile, ProfileResponse } from '../interfaces/userProfile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://cultural-agenda.onrender.com/profiles';

  async getProfileById(id: string): Promise<ProfileResponse> {
    return firstValueFrom(this.http.get<ProfileResponse>(`${this.apiUrl}/${id}`));
  }

  async updateProfile(profileData: UserProfile): Promise<ProfileResponse> {
    return firstValueFrom(this.http.put<ProfileResponse>(this.apiUrl, profileData));
  }
}