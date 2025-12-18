export enum QueryKeyEnum {
  Patient = 'patients',
  Hospital = 'hospitals',
  Doctor = 'doctors',
  User = 'users',
  Predict = 'predict',
  TimeSlot = 'timeSlot',
  Drug = 'drugs',
  Service = 'services',
  Order = 'orders',
  Appointment = 'appointments',
  AppointmentsByPatient = 'appointments_by_patient',
  MedicalRecords = 'medical_records',
  Prescription = 'prescriptions',
  Notification = 'notifications',
}

export const QueryKey = QueryKeyEnum;
