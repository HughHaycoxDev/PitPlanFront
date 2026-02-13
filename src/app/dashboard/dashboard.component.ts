import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

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

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('No token found in localStorage.');
      return;
    }

    const payload = this.decodeJWT(token);

    if (payload?.sub) {
      this.user = { display_name: payload.sub };
    }
  }

  private decodeJWT(token: string): any {
    try {
      const base64 = token.split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          )
          .join('')
      );

      return JSON.parse(json);
    } catch (err) {
      console.error('JWT decode error:', err);
      return null;
    }
  }
}
