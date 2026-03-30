import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CreateEventDTO, Event } from '../interfaces/event';
import { Auth } from './auth';
import { from, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private apiUrl = `${environment.apiUrl}/events`;

  createEvent(event: CreateEventDTO): Observable<Event> {
    return from(this.auth.getToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post<Event>(this.apiUrl, event, { headers });
      })
    )
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  attendEvent(eventId: string): Observable<object> {
    return from(this.auth.getToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
        return this.http.post(`${this.apiUrl}/${eventId}/attend`, {}, {headers});
      })
    );
  }

  unattendEvent(eventId: string): Observable<void> {
    return from(this.auth.getToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.delete<void>(`${this.apiUrl}/${eventId}/attend`, { headers });
      })
    );
  }

  checkAttendance(eventId: string): Observable<{ attending: boolean}> {
    return from(this.auth.getToken()).pipe(
    switchMap(token => {
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      return this.http.get<{ attending: boolean }>(`${this.apiUrl}/${eventId}/attend`, { headers });
    })
  );
  }

  updateEvent(id: string, event: CreateEventDTO): Observable<Event> {
    return from(this.auth.getToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.put<Event>(`${this.apiUrl}/${id}`, event, { headers });
      })
    );
  }

  deleteEvent(id: string): Observable<void> {
    return from(this.auth.getToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
      })
    );
  }

}
