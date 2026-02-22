import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-race-plan',
  imports: [SidebarComponent],
  templateUrl: './race-plan.component.html',
  styleUrl: './race-plan.component.scss',
})
export class RacePlanComponent {
  constructor() {
    const navigation = window.history.state;
    console.log(navigation.racePlans);
  }
}
