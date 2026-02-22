import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { RacePlan } from '../models/race-plan.model';

@Injectable({ providedIn: 'root' })
export class RacePlanService {
  private api = 'http://localhost:8000/race-plan/';

  constructor(private http: HttpClient, private auth: AuthService) {}

  createRacePlan(body: RacePlan): Observable<RacePlan> {
    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.post<RacePlan>(this.api + "create", body, {headers})
  }

  getRacePlanByTeamAndEvent(team_id: number, event_id: number): Observable<RacePlan> {
    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.get<RacePlan>(this.api + "list/team/" + team_id + "/event/" + event_id, {headers})
  }
}
