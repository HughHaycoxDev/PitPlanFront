export interface Track {
  track_id: number;
  track_name: string;
  category: string;
  config_name: string;
  logo: string;
  pit_road_speed_limit: number;
  small_image: string;
  id: number;
}

export interface Car {
  car_id: number;
  car_name: string;
  logo: string;
  tank_size: number;
  id: number;
}

export interface TimeSlot {
  slot_time: string;
}

export interface ApiEvent {
  id: number;
  event_name: string;
  event_description: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  duration_minutes: number;
  track: Track;
  cars: Car[];
  time_slots: TimeSlot[];
}
