import { Doctor } from './doctor';

export type TimeSlot = {
  slot_id: string;
  doctor_id: string;
  start_time: string; // ISO datetime
  end_time: string; // ISO datetime
  capacity: number;
  created_at: string;
  updated_at: string;
  appointment_id?: string;
  doctor?: Doctor;
};
