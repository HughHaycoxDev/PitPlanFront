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
  racePlanId: number = 0;

  constructor(private driverRosterService: DriverRosterService) {}

  ngOnInit() {

    const racePlan = localStorage.getItem('racePlan');

    if (!racePlan) {
      console.error('RacePlan not found in storage');
      return;
    }

    const racePlanId = JSON.parse(racePlan).id;
    this.racePlanId = racePlanId;

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
    this.driverRosterService.createDriverOnDriverRoster(this.racePlanId).subscribe({
      next: (response) => {
        console.log('Driver created successfully', response);
        window.location.reload();
      },
      error: (error) => {
        console.error('Error creating driver', error);
      }
    });
  }

  updateDriver(driver: DriverRoster) {
    console.log('Auto save driver changes', driver);
    this.driverRosterService.updateDriverOnDriverRoster(driver).subscribe({
      next: (response) => {
        console.log('Driver updated successfully', response);
      },
      error: (error) => {
        console.error('Error updating driver', error);
      }
    });
  }

  deleteDriver(driver: DriverRoster) {
    console.log('Delete driver', driver);
    this.driverRosterService.deleteDriverOnDriverRoster(driver).subscribe({
      next: (response) => {
        console.log('Driver deleted successfully', response);
        window.location.reload();
      },
      error: (error) => {
        console.error('Error deleting driver', error);
      }
    });
  }
}
