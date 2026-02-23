export interface DriverRoster {
  id: number;
  color: string;
  name: string;
  stints: number;
  fair_share: boolean;
  gmt_offset: number;
  i_rating: number;
  lap_time: number;
  factor: number;
  preference: string;
  race_plan_id: number;
}