import { Specialty } from "../enums/specialty";

export type Doctor = {
  doctor_id: string;
  user_id: string;
  full_name: string;
  phone: string;
  email: string;
  image: string;
  specialty: Specialty;
  hospital_id: string;
  created_at: string;
  updated_at: string;
  slug: string;
};
