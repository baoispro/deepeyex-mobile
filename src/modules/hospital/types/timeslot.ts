export type TimeSlot = {
  slot_id: string;
  doctor_id: string;
  start_time: string; // ISO datetime
  end_time: string; // ISO datetime
  is_booked: boolean;
};
