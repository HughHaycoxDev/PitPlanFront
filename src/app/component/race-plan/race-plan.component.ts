import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RacePlanAvailabilityComponent } from '../race-plan-availability/race-plan-availability.component';
import { RacePlanOverviewComponent } from '../race-plan-overview/race-plan-overview.component';
import { RacePlanRosterComponent } from '../race-plan-roster/race-plan-roster.component';
import { RacePlanScheduleComponent } from '../race-plan-schedule/race-plan-schedule.component';

@Component({
  selector: 'app-race-plan',
  imports: [
    SidebarComponent, 
    RouterOutlet, 
    CommonModule, 
    RacePlanAvailabilityComponent, 
    RacePlanOverviewComponent, 
    RacePlanRosterComponent,
    RacePlanScheduleComponent
  ],
  templateUrl: './race-plan.component.html',
  styleUrl: './race-plan.component.scss',
})
export class RacePlanComponent {
  constructor() {
    const navigation = window.history.state;
    console.log(navigation.racePlans);
  }

  activeTab: string = 'overview';

  setTab(tab: string) {
    this.activeTab = tab;
  }
}
