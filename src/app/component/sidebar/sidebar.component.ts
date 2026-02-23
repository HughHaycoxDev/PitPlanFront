import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeamsService } from '../../utilities/services/teams/teams.service';
import { Team } from '../../utilities/models/team.model';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  teams: Team[] = [];

  constructor(private teamsSercive: TeamsService) { }

  ngOnInit(): void {
      this.teamsSercive.getTeams().subscribe({
        next: (data) => {
          this.teams = data;
        },
        error: (error) => console.error('Error fetching teams:', error)
      });
  }
}
