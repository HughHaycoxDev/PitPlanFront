import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../utilities/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [SidebarComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  user: any = null;
  events: any[] = [];
  nextRace: any = null;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    const username = this.auth.getUsername();

    if (!username) {
      console.warn('No user found in JWT.');
      return;
    }

    this.user = { display_name: username };
  }
}
