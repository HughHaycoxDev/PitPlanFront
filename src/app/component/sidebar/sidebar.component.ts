import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeamsService } from '../../utilities/services/teams/teams.service';
import { Team } from '../../utilities/models/team.model';
import { CommonModule, NgFor } from '@angular/common';
import { ThemeService } from '../../utilities/services/theme-service.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  teams: Team[] = [];
  isDark: boolean = false;

  constructor(private teamsSercive: TeamsService, private themeService: ThemeService) { }

  ngOnInit(): void {
      this.isDark = this.themeService.isDark();
      this.teamsSercive.getTeams().subscribe({
        next: (data) => {
          this.teams = data;
        },
        error: (error) => console.error('Error fetching teams:', error)
      });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDark = this.themeService.isDark();
  }
}
