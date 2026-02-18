import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEvent } from '../models/api-event.model';
import { AuthService } from './auth.service';
import { Register, RegisterReply } from '../models/register.model';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private api = 'http://localhost:8000/events/';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getEvents(): Observable<ApiEvent[]> {
    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.get<ApiEvent[]>(this.api, { headers });
  }

  register(body: Register): Observable<RegisterReply> {
    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.post<RegisterReply>(this.api + "register", body, {headers})
  }
}
