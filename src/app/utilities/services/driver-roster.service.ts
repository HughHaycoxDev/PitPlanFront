import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { RacePlan } from '../models/race-plan.model';
import { DriverRoster } from '../models/driver_roster.model';

@Injectable({ providedIn: 'root' })
export class DriverRosterService {
  private api = 'http://localhost:8000/driver-roster/';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getRaceRosterByRacePlan(race_plan_id: number): Observable<DriverRoster[]> {
    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.get<DriverRoster[]>(this.api + "list-by-race-plan/" + race_plan_id, {headers});
  }
}
