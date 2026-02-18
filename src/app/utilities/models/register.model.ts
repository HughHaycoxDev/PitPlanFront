import { TimeSlot } from "./api-event.model";

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