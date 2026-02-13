import { FullCalendarModule } from '@fullcalendar/angular';
import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../utilities/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { ApiEvent } from '../../utilities/models/api-event.model';
import { EventsService } from '../../utilities/services/events.service';
import { CalendarOptions } from '@fullcalendar/core/index.js';

@Component({
  selector: 'app-dashboard',
  imports: [SidebarComponent, CommonModule, FullCalendarModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  user: any = null;
  events: any[] = [];
  nextRace: any = null;
  viewMode: 'multiMonth' | 'yearGrid' | 'tableView' = 'tableView';
  yearGridData: any[] = [];
  tableViewData: any[] = [];
  
  calendarOptions: CalendarOptions = {};
  
  constructor(private auth: AuthService, private eventsService: EventsService) {}

  ngOnInit(): void {
    const username = this.auth.getUsername();

    if (!username) {
      console.warn('No user found in JWT.');
      return;
    }

    this.user = { display_name: username };
    this.loadEvents();
  }

  private loadEvents(): void {
    const api = 'http://localhost:8000/events/';
    this.eventsService.getEvents().subscribe({
      next: (data) => {
        this.events = data.map((ev) => ({
          id: ev.id,
          title: ev.event_name,
          start: ev.start_date,
          end: ev.end_date,
          allDay: true,
          extendedProps: { raw: ev },
        }));

        console.log(this.events)

        // Set calendar options with events
        this.calendarOptions = {
          ...this.calendarOptions,
          events: this.events,
        };

        // Generate year grid data
        this.generateYearGridData();
        // Generate table view data
        this.generateTableViewData();
      },
      error: (err) => console.error('Failed to load events', err),
    });
  }

  private generateYearGridData(): void {
    const year = new Date().getFullYear();
    const monthsData = [];

    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(year, month, 1);
      const monthName = monthDate.toLocaleString('default', { month: 'long' });
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      const daysArray = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];
        const dayEvents = this.events.filter(event => {
          const eventStart = new Date(event.start).toISOString().split('T')[0];
          return eventStart === dateStr;
        });

        daysArray.push({
          day,
          date: dateStr,
          dayOfWeek: date.toLocaleString('default', { weekday: 'short' }),
          events: dayEvents
        });
      }

      monthsData.push({
        month: monthName,
        monthNumber: month + 1,
        year,
        days: daysArray
      });
    }

    this.yearGridData = monthsData;
  }

  private generateTableViewData(): void {
    const today = new Date();
    const startMonth = today.getMonth();
    const startYear = today.getFullYear();
    const monthsData = [];
    const maxDays = 31;

    // Generate next 4 months
    for (let i = 0; i < 4; i++) {
      const monthDate = new Date(startYear, startMonth + i, 1);
      const monthName = monthDate.toLocaleString('default', { month: 'short' });
      const daysInMonth = new Date(startYear, startMonth + i + 1, 0).getDate();

      const daysArray = [];
      for (let day = 1; day <= maxDays; day++) {
        if (day <= daysInMonth) {
          const date = new Date(startYear, startMonth + i, day);
          const dateStr = date.toISOString().split('T')[0];
          const dayEvents = this.events.filter(event => {
            const eventStart = new Date(event.start).toISOString().split('T')[0];
            return eventStart === dateStr;
          });

          daysArray.push({
            day,
            date: dateStr,
            hasEvents: dayEvents.length > 0,
            events: dayEvents,
            isToday: dateStr === today.toISOString().split('T')[0]
          });
        } else {
          daysArray.push({
            day: null,
            date: null,
            hasEvents: false,
            events: [],
            isToday: false
          });
        }
      }

      monthsData.push({
        month: monthName,
        monthNumber: startMonth + i + 1,
        year: startYear,
        daysInMonth,
        days: daysArray
      });
    }

    this.tableViewData = monthsData;
  }

  handleEventClick(arg: any) {
    console.log('event clicked', arg.event);
  }

  toggleViewMode() {
    const views: Array<'multiMonth' | 'yearGrid' | 'tableView'> = ['tableView', 'yearGrid', 'multiMonth'];
    const currentIndex = views.indexOf(this.viewMode);
    this.viewMode = views[(currentIndex + 1) % views.length];
  }

  getViewModeLabel(): string {
    const labels: Record<string, string> = {
      'tableView': '4-Month Grid',
      'yearGrid': 'Year Overview',
      'multiMonth': 'Multi-Month'
    };
    return labels[this.viewMode];
  }
}
