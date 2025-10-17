import { Patient } from './patient';
import { Hospital } from './hospital';
import { Doctor } from './doctor';
import { TimeSlot } from './timeslot';
import { Drug } from './drug';
import { ApiResponse } from '../../../shared/types/response';
import { Service } from './service';

type GetPatientResponse = ApiResponse<Patient>;

//Hospital
type CreateHospitalResponse = ApiResponse<Hospital>;
type GetHospitalByIdResponse = ApiResponse<Hospital>;
type UpdateHospitalResponse = ApiResponse<Hospital>;
type DeleteHospitalResponse = ApiResponse<null>;
type ListHospitalsResponse = ApiResponse<Hospital[]>;
type ListCitiesResponse = ApiResponse<string[]>;
type ListWardsByCityResponse = ApiResponse<string[]>;
type SearchByAddressResponse = ApiResponse<Hospital[]>;
type ListByCityAndWardResponse = ApiResponse<Hospital[]>;
type ListNearbyHospitalsResponse = ApiResponse<Hospital[]>;

// Doctor
type GetDoctorByIdResponse = ApiResponse<Doctor>;
type GetDoctorByUserIdResponse = ApiResponse<Doctor>;
type ListDoctorsResponse = ApiResponse<Doctor[]>;
type ListDoctorsByHospitalResponse = ApiResponse<Doctor[]>;

// Time Slot
type ListTimeSlotsByDateResponse = ApiResponse<TimeSlot[]>;
type ListTimeSlotsByMonthResponse = ApiResponse<TimeSlot[]>;
type ListTimeSlotsByDoctorIdResponse = ApiResponse<TimeSlot[]>;

// Drug
type GetDrugByIdResponse = ApiResponse<Drug>;
type ListDrugsResponse = ApiResponse<Drug[]>;

//Service
type ListServicesResponse = ApiResponse<Service[]>;

export type {
  GetPatientResponse,
  CreateHospitalResponse,
  GetHospitalByIdResponse,
  UpdateHospitalResponse,
  DeleteHospitalResponse,
  ListHospitalsResponse,
  ListCitiesResponse,
  ListWardsByCityResponse,
  SearchByAddressResponse,
  ListByCityAndWardResponse,
  ListNearbyHospitalsResponse,
  GetDoctorByIdResponse,
  GetDoctorByUserIdResponse,
  ListDoctorsResponse,
  ListDoctorsByHospitalResponse,
  ListTimeSlotsByDateResponse,
  ListTimeSlotsByMonthResponse,
  GetDrugByIdResponse,
  ListDrugsResponse,
  ListServicesResponse,
  ListTimeSlotsByDoctorIdResponse,
};
