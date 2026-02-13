import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../../models/team.model';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  constructor(private auth: AuthService, private http: HttpClient) {}

  getTeams() : Observable<Team[]> {
      const token = this.auth.getToken();
      if (!token) {
        return new Observable(observer => {
          observer.error('No auth token found');
          observer.complete();
        })
      };

      return this.http.get<Team[]>('http://localhost:8000/teams', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  }
}
