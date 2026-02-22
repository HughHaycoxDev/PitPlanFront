import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEvent } from '../models/api-event.model';
import { AuthService } from './auth.service';
import { Register, RegisterReply, RegistrationResponse } from '../models/register.model';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private api = 'http://localhost:8000/events/';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  getEvents(): Observable<ApiEvent[]> {
    return this.http.get<ApiEvent[]>(this.api, { headers: this.getHeaders() });
  }

  register(body: Register): Observable<RegisterReply> {
    return this.http.post<RegisterReply>(this.api + "register", body, { headers: this.getHeaders() });
  }

  getRegistrationsByEventAndTeam(eventId: number, teamId: number): Observable<RegistrationResponse[]> {
    return this.http.get<RegistrationResponse[]>(
      `${this.api}registrations/event/${eventId}/team/${teamId}`,
      { headers: this.getHeaders() }
    );
  }
}
