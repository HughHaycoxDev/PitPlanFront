import { Register, RegistrationResponse } from './../../utilities/models/register.model';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Team } from '../../utilities/models/team.model';
import { TeamsService } from '../../utilities/services/teams/teams.service';
import { Car, TimeSlot } from '../../utilities/models/api-event.model';
import { EventsService } from '../../utilities/services/events.service';
import { RacePlanService } from '../../utilities/services/race-plan.service';
import { RacePlan } from '../../utilities/models/race-plan.model';
import { Router } from '@angular/router';
import { AuthService } from '../../utilities/services/auth.service';

interface RegistrationsByTeam {
  team: Team;
  registrations: RegistrationResponse[];
}

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
  racePlan: RacePlan | null = null;

  loading = false;
  error: string | null = null;

  // View registrations
  showRegistrations = false;
  registrationsLoading = false;
  registrationsError: string | null = null;
  registrationsByTeam: RegistrationsByTeam[] = [];

  constructor(private teamsService: TeamsService, 
    private eventsService: EventsService,
    private auth: AuthService, 
    private racePlanService: RacePlanService, 
    private router: Router) {}

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
      // Search if any race plan exists for this team and event to let the user view it
      this.racePlanService.getRacePlanByTeamAndEvent(this.selectedTeam.team_id, this.event.id).subscribe({
        next: (data) => {
          console.log(data);
          this.racePlan = data;
        },
        error: (err) => {
          this.racePlan = null;
        }
      });
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
    const register = {
        event_id: this.event.id,
        team_id: this.selectedTeam?.team_id,
        time_slot: this.selectedTimeSlot?.slot_time,
        car_id: this.selectedCar?.id,
        user_id: this.auth.getId(),
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
      time_slot: this.selectedTimeSlot?.slot_time,
      event_id: this.event.id
    } as RacePlan

    this.racePlanService.createRacePlan(racePlan).subscribe({
            next: (data) => {
              this.router.navigate(['/race-plan'], {
                state: { racePlans: data } 
                });
            },
            error: (err) => {
              console.error('Failed to create race plan', err);
            }
    });

  }

  onViewRacePlan(): void {

    if (!this.selectedTeam) {
      this.error = 'Team cannot be retrieved';
      return;
    } else {
      this.racePlanService.getRacePlanByTeamAndEvent(this.selectedTeam.team_id, this.event.id).subscribe({
            next: (data) => {
              this.router.navigate(['/race-plan'], {
                state: { racePlans: data } 
                });
            },
            error: (err) => {
              console.error('Failed to get race plans', err);
            }
      });
    }
  }

  // View registrations functionality
  onViewRegistrations(): void {
    this.showRegistrations = true;
    this.loadRegistrations();
  }

  onBackToRegistration(): void {
    this.showRegistrations = false;
    this.registrationsByTeam = [];
    this.registrationsError = null;
  }

  private loadRegistrations(): void {
    if (!this.event) return;

    this.registrationsLoading = true;
    this.registrationsError = null;

    // Load registrations for each team the user is in
    const teamIds = this.teams.map(t => t.team_id);
    const registrationPromises: Promise<{ team: Team; registrations: RegistrationResponse[] }>[] = [];

    for (const team of this.teams) {
      const promise = new Promise<{ team: Team; registrations: RegistrationResponse[] }>((resolve, reject) => {
        this.eventsService.getRegistrationsByEventAndTeam(this.event.id, team.team_id).subscribe({
          next: (registrations) => {
            resolve({ team, registrations });
          },
          error: (err) => {
            console.error(`Failed to load registrations for team ${team.team_id}`, err);
            resolve({ team, registrations: [] }); // Resolve with empty array on error
          },
        });
      });
      registrationPromises.push(promise);
    }

    Promise.all(registrationPromises).then(results => {
      // Filter out teams with no registrations
      this.registrationsByTeam = results
        .filter(r => r.registrations.length > 0)
        .map(r => ({
          team: r.team,
          registrations: r.registrations
        }));
      this.registrationsLoading = false;
    });
  }
}
