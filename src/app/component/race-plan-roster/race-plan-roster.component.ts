import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DriverRosterService } from '../../utilities/services/driver-roster.service';
import { DriverRoster } from '../../utilities/models/driver_roster.model';

interface Driver {
  color: string;
  name: string;
  stints: number;
  fairShare: boolean;
  gmtOffset: number;
  iRating: number;
  lapTime: number;
  factor: number;
  preference: string;
}

@Component({
  selector: 'app-race-plan-roster',
  imports: [FormsModule],
  templateUrl: './race-plan-roster.component.html',
  styleUrl: './race-plan-roster.component.scss',
})
export class RacePlanRosterComponent {

  drivers: DriverRoster[] = [];

  constructor(private driverRosterService: DriverRosterService) {}

  ngOnInit() {

    const racePlanId = localStorage.getItem('racePlanId');

    if (!racePlanId) {
      console.error('RacePlanId not found in storage');
      return;
    }

    this.driverRosterService
      .getRaceRosterByRacePlan(+racePlanId)
      .subscribe({
        next: (drivers) => {
          this.drivers = drivers;
          console.log(drivers);
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  addDriver() {
    console.log('Add driver clicked');
  }

  updateDriver() {
    console.log('Auto save driver changes');
  }

  deleteDriver(index: number) {
    console.log('Delete driver', index);
  }
}
