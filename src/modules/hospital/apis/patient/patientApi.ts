import { AxiosInstance } from 'axios';
import api from '../../../../shared/configs/axios';
import { GetPatientResponse } from '../../types/response';
import { Gender } from '../../enums/gender';
import { Patient } from '../../types/patient';

export type CreatePatientRequest = {
  user_id: string;
  full_name: string;
  dob: string; // YYYY-MM-DD
  gender: Gender;
  address?: string;
  phone?: string;
  email?: string;
  avatar?: File;
};

export type UpdatePatientRequest = Partial<CreatePatientRequest>;

export type SuccessResponse<T = unknown> = {
  status: number;
  message: string;
  data?: T;
};

export type ErrorResponse = {
  status: number;
  message: string;
};

class PatientClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- Create ----------------
  async create(form: CreatePatientRequest): Promise<SuccessResponse<Patient>> {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    const response = await this.client.post<SuccessResponse<Patient>>(
      '/patients',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data;
  }

  // ---------------- List ----------------
  async list(): Promise<SuccessResponse<Patient[]>> {
    const response = await this.client.get<SuccessResponse<Patient[]>>(
      '/patients',
    );
    return response.data;
  }

  // ---------------- Get By UserID ----------------
  async getByUserID(userId: string): Promise<GetPatientResponse> {
    const response = await this.client.get<GetPatientResponse>(
      `/hospital/patients/user/${userId}`,
    );
    return response.data;
  }

  // ---------------- Get By PatientID ----------------
  async getByID(patientId: string): Promise<SuccessResponse<Patient>> {
    const response = await this.client.get<SuccessResponse<Patient>>(
      `/patients/${patientId}`,
    );
    return response.data;
  }

  // ---------------- Update ----------------
  async update(
    patientId: string,
    form: UpdatePatientRequest,
  ): Promise<SuccessResponse<Patient>> {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    const response = await this.client.put<SuccessResponse<Patient>>(
      `/patients/${patientId}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data;
  }

  // ---------------- Delete ----------------
  async delete(patientId: string): Promise<SuccessResponse> {
    const response = await this.client.delete<SuccessResponse>(
      `/patients/${patientId}`,
    );
    return response.data;
  }
}

const PatientApi = new PatientClient();
export { PatientApi };
