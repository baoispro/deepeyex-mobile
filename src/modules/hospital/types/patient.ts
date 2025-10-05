import { Gender } from "../enums/gender";

export type Patient = {
  patient_id: string;
  user_id: string;
  full_name: string;
  dob: string; // ISO date string
  gender: Gender;
  address?: string;
  phone?: string;
  email?: string;
  image?: string;
};
