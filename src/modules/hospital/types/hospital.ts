import { Doctor } from "./doctor";

export type Hospital = {
  hospital_id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  image: string;
  created_at: string;
  updated_at: string;
  Doctors?: Doctor[];
  slug: string;
  url_map: string;
  ward: string;
  city: string;
};
