import { Doctor } from "./doctor";
import { Hospital } from "./hospital";
import { Patient } from "./patient";
import { TimeSlot } from "./timeslot";

export interface Appointment {
  appointment_id: string;
  appointment_code: string;
  patient_id: string;
  hospital_id: string;
  doctor_id: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED"
    | "PENDING_ONLINE"
    | "CONFIRMED_ONLINE"
    | "COMPLETED_ONLINE";
  notes: string;
  created_at: string;
  updated_at: string;
  book_user_id: string;
  service_name: string;
  time_slots: TimeSlot[];
  patient: Patient;
  doctor: Doctor;
  hospital: Hospital;
  related_record_id: string | null;
}

export type LabelStatus = {
  label: string;
  color: string;
};

export const statusLabels: Record<Appointment["status"], LabelStatus> = {
  PENDING: { label: "Chờ xác nhận", color: "orange" },
  CONFIRMED: { label: "Đã xác nhận", color: "blue" },
  COMPLETED: { label: "Đã hoàn tất", color: "green" },
  CANCELLED: { label: "Đã hủy", color: "red" },
  PENDING_ONLINE: { label: "Chờ tư vấn trực tuyến", color: "purple" },
  CONFIRMED_ONLINE: { label: "Đang tư vấn trực tuyến", color: "cyan" },
  COMPLETED_ONLINE: { label: "Hoàn tất tư vấn trực tuyến", color: "teal" },
};
