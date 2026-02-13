import { Component, OnInit } from '@angular/core';
import { TeamsService } from '../../utilities/services/teams/teams.service';

@Component({
  selector: 'app-teams',
  imports: [],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss',
})
export class TeamsComponent implements OnInit {

  constructor(private teamsService: TeamsService) { }

  ngOnInit(): void {
      console.log(this.teamsService.getTeams().subscribe({
        next: (data) => console.log('Teams data:', data),
        error: (error) => console.error('Error fetching teams:', error)
      }));
  }
}
