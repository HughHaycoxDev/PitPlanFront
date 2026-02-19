import { Register } from './../../utilities/models/register.model';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Team } from '../../utilities/models/team.model';
import { TeamsService } from '../../utilities/services/teams/teams.service';
import { Car, TimeSlot } from '../../utilities/models/api-event.model';
import { EventsService } from '../../utilities/services/events.service';
import { RacePlanService } from '../../utilities/services/race-plan.service';
import { RacePlan } from '../../utilities/models/race-plan.model';

@Component({
  selector: 'app-event-details-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-details-sidebar.component.html',
  styleUrls: ['./event-details-sidebar.component.scss'],
})
export class EventDetailsSidebarComponent implements OnInit {
  @Input() isOpen = false;
  @Input() event: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() apply = new EventEmitter<{
    event: any;
    selectedTeam: Team | null;
    selectedCar: Car | null;
    selectedTimeSlot: TimeSlot | null;
  }>();

  teams: Team[] = [];
  cars: Car[] = [];
  timeSlots: TimeSlot[] = [];

  selectedTeam: Team | null = null;
  selectedCar: Car | null = null;
  selectedTimeSlot: TimeSlot | null = null;

  loading = false;
  error: string | null = null;

  constructor(private teamsService: TeamsService, private eventsService: EventsService, private racePlanService: RacePlanService) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  private loadTeams(): void {
    this.loading = true;
    this.error = null;
    this.teamsService.getTeams().subscribe({
      next: (data) => {
        this.teams = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load teams', err);
        this.error = 'Failed to load teams';
        this.loading = false;
      },
    });
  }

  onTeamChange(): void {
    // Reset car and timeslot selections when team changes
    this.selectedCar = null;
    this.selectedTimeSlot = null;
    this.cars = [];
    this.timeSlots = [];

    if (this.selectedTeam && this.event) {
      // Load cars for this team from the event
      // Assuming event.cars is an array of Car objects
      this.cars = this.event.cars || [];
    }
  }

  onCarChange(): void {
    // Reset timeslot selection when car changes
    this.selectedTimeSlot = null;
    this.timeSlots = [];

    if (this.selectedCar && this.event) {
      // Load timeslots from the event
      // Assuming event.time_slots is an array of TimeSlot objects
      this.timeSlots = this.event.time_slots || [];
    }
  }

  onApply(): void {
    this.apply.emit({
      event: this.event,
      selectedTeam: this.selectedTeam,
      selectedCar: this.selectedCar,
      selectedTimeSlot: this.selectedTimeSlot,
    });
    const register = {
        event_id: this.event.id,
        team_id: this.selectedTeam?.team_id,
        time_slot: this.selectedTimeSlot?.slot_time,
        car_id: this.selectedCar?.id,
        user_id: 341977
    } as Register

    this.eventsService.register(register).subscribe();

  }

  onClose(): void {
    this.close.emit();
  }

  onCreateRacePlan(): void {

    const racePlan = {
      team_id: this.selectedTeam?.team_id,
      car_id: this.selectedCar?.id,
      time_slot: this.selectedTimeSlot?.slot_time
    } as RacePlan

    this.racePlanService.createRacePlan(racePlan).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.error('Failed to create race plan', err);
      }
    });

  }
}
