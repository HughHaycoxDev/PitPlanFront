import { FullCalendarModule } from '@fullcalendar/angular';
import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../utilities/services/auth.service';
import { ApiEvent } from '../../utilities/models/api-event.model';
import { EventsService } from '../../utilities/services/events.service';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import { User } from '../../utilities/models/user.model';

@Component({
  selector: 'app-dashboard',
  imports: [SidebarComponent, CommonModule, FullCalendarModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  user!: User;
  events: any[] = [];
  yearGridData: any[] = [];
  tableViewData: any[] = [];
  dayRowHeight = 28;
  days = Array.from({length: 31});
  
  calendarOptions: CalendarOptions = {};
  
  constructor(private auth: AuthService, private eventsService: EventsService) {}

  ngOnInit(): void {
    // Get the username from the JWT token
    const username = this.auth.getUsername();

    // If the token doesn't contain a username, log and stop initialization
    if (!username) {
      console.warn('No user found in JWT.');
      return;
    }

    // Set the minimal user object used by the template and kick off events load
    this.user = { display_name: username };
    this.loadEvents();
  }

  /**
   * Loads the Events and maps them to add them to the calendarOptions
   */
  private loadEvents(): void {
    // Subscribe to events stream and map results for calendar and views
    this.eventsService.getEvents().subscribe({
      next: (data) => {
        // Map API event objects into calendar-friendly shapes where needed.
        this.events = data.map((ev) => ({
          id: ev.id,
          title: ev.event_name,
          start: ev.start_date,
          end: ev.end_date,
          allDay: true,
          extendedProps: { raw: ev },
        }));

        // Update FullCalendar options with the loaded events. We merge onto
        // existing options to preserve any previously set configuration.
        this.calendarOptions = {
          ...this.calendarOptions,
          events: this.events,
        };

        // Rebuild derived views after events arrive
        this.generateYearGridData();
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
        // Use ISO date string (YYYY-MM-DD) for consistent comparisons
        const dateStr = date.toISOString().split('T')[0];

        // Find events that start exactly on this date. This intentionally
        // matches start date only (not multi-day spans) for the year grid
        // summary — the table view logic handles multi-day ranges.
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
          // Use UTC to avoid timezone shifts when converting to ISO date
          const date = new Date(Date.UTC(startYear, startMonth + i, day));
          const dateStr = date.toISOString().split('T')[0];
          const dayEvents = this.getEventsForDay(dateStr);

          daysArray.push({
            day,
            date: dateStr,
            hasEvents: dayEvents.length > 0,
            events: dayEvents,
            // Mark whether this date matches today's date (local)
            isToday: dateStr === today.toISOString().split('T')[0]
          });
        } else {
          // Pad remaining slots for months with fewer than `maxDays`
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

  private getEventsForDay(dateStr: string): any[] {
    // Return events that overlap the given date string (inclusive).
    // Both start and end are normalized to YYYY-MM-DD for safe comparison.
    return this.events.filter(event => {
      const eventStart = new Date(event.start).toISOString().split('T')[0];
      const eventEnd = new Date(event.end).toISOString().split('T')[0];
      return dateStr >= eventStart && dateStr <= eventEnd;
    });
  }

  handleEventClick(arg: any) {
    console.log('event clicked', arg.event);
  }

  getPositionedEventsForMonth(monthData: any) {
    const positioned: any[] = [];

    const monthStart = new Date(monthData.year, monthData.monthNumber - 1, 1);
    const monthEnd = new Date(monthData.year, monthData.monthNumber, 0);

    this.events.forEach(event => {

      // Normalize start/end to Date objects for comparisons
      const start = new Date(event.start);
      const end = new Date(event.end);

      // Skip events that fall completely outside the requested month
      if (end < monthStart || start > monthEnd) return;

      // Clip multi-day events to the bounds of the month being rendered
      const effectiveStart = start < monthStart ? monthStart : start;
      const effectiveEnd = end > monthEnd ? monthEnd : end;

      // Convert to 0-based day indices 
      const startDay = effectiveStart.getDate() - 1;
      const endDay = effectiveEnd.getDate() - 1;

      const duration = endDay - startDay + 1;

      // Return the positioned event used by the month table renderer
      positioned.push({
        id: event.id,
        title: event.title,
        top: startDay * this.dayRowHeight,
        height: duration * this.dayRowHeight
      });
    });

    return positioned;
  }
}
