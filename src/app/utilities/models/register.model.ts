import { TimeSlot, Car } from "./api-event.model";
import { Team } from "./team.model";

export interface Register {
  event_id: number;
  user_id: number;
  team_id: number;
  time_slot: string;
  car_id: number;
}

export interface RegisterReply {
  event_id: number;
  user_id: number;
  team_id: number;
  time_slot: string;
  car_id: number;
  registered_at: string;
}

export interface RegistrationResponse {
  id: number;
  event: any;
  display_name: string;
  team: Team;
  time_slot: TimeSlot;
  car: Car;
  registered_at: string;
}
