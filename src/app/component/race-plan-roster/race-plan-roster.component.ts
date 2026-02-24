import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DriverRosterService } from '../../utilities/services/driver-roster.service';
import { DriverRoster } from '../../utilities/models/driver_roster.model';
import { WebSocketService, WebSocketMessage } from '../../utilities/services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-race-plan-roster',
  imports: [FormsModule],
  templateUrl: './race-plan-roster.component.html',
  styleUrl: './race-plan-roster.component.scss',
})
export class RacePlanRosterComponent implements OnInit, OnDestroy {

  drivers: DriverRoster[] = [];
  racePlanId: number | null = null;
  private wsSubscription: Subscription | null = null;

  constructor(
    private driverRosterService: DriverRosterService,
    private wsService: WebSocketService
  ) {}

  ngOnInit() {

    const racePlan = localStorage.getItem('racePlan');

    if (!racePlan) {
      console.error('RacePlan not found in storage');
      return;
    }

    this.racePlanId = +JSON.parse(racePlan).id;

    this.driverRosterService
      .getRaceRosterByRacePlan(this.racePlanId)
      .subscribe({
        next: (drivers) => {
          this.drivers = drivers;
          console.log(drivers);
        },
        error: (error) => {
          console.error(error);
        }
      });

    // Connect to WebSocket for real-time updates
    if (this.racePlanId) {
      this.wsService.connect(this.racePlanId);
      
      // Subscribe to WebSocket messages
      this.wsSubscription = this.wsService.messages$.subscribe({
        next: (message: WebSocketMessage) => {
          this.handleWebSocketMessage(message);
        },
        error: (error) => {
          console.error('WebSocket error:', error);
        }
      });
    }
  }

  ngOnDestroy(): void {
    // Disconnect WebSocket when component is destroyed
    this.wsService.disconnect();
    
    // Unsubscribe from messages
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleWebSocketMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'driver_updated':
        this.handleDriverUpdated(message.data);
        break;
      case 'driver_deleted':
        this.handleDriverDeleted(message.data);
        break;
      case 'driver_added':
        this.handleDriverAdded(message.data);
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  /**
   * Handle driver update from WebSocket
   */
  private handleDriverUpdated(driverData: DriverRoster): void {
    const index = this.drivers.findIndex(d => d.id === driverData.id);
    if (index !== -1) {
      // Update existing driver
      this.drivers[index] = driverData;
      console.log('Driver updated via WebSocket:', driverData);
    }
  }

  /**
   * Handle driver deletion from WebSocket
   */
  private handleDriverDeleted(data: { driver_id: number }): void {
    const index = this.drivers.findIndex(d => d.id === data.driver_id);
    if (index !== -1) {
      this.drivers.splice(index, 1);
      console.log('Driver deleted via WebSocket:', data.driver_id);
    }
  }

  /**
   * Handle new driver added from WebSocket
   */
  private handleDriverAdded(driverData: DriverRoster): void {
    // Check if driver already exists (to avoid duplicates)
    const exists = this.drivers.some(d => d.id === driverData.id);
    if (!exists) {
      this.drivers.push(driverData);
      console.log('Driver added via WebSocket:', driverData);
    }
  }

  addDriver() {
    console.log('Add driver clicked');
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
        // // Remove from local array instead of page reload
        // const index = this.drivers.findIndex(d => d.id === driver.id);
        // if (index !== -1) {
        //   this.drivers.splice(index, 1);
        // }
      },
      error: (error) => {
        console.error('Error deleting driver', error);
      }
    });
  }
}
