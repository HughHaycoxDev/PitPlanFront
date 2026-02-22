import { Component } from '@angular/core';

@Component({
  selector: 'app-race-plan',
  imports: [],
  templateUrl: './race-plan.component.html',
  styleUrl: './race-plan.component.scss',
})
export class RacePlanComponent {
  constructor() {
    const navigation = window.history.state;
    console.log(navigation.racePlans);
  }
}
