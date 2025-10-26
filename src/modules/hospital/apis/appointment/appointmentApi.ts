import { AxiosInstance } from "axios";
import {
  CancelAppointmentResponse,
  CreateFollowUpResponse,
  ListAppointmentsResponse,
  UpdateAppointmentStatusResponse,
} from "../../types/response";
import api from "../../../../shared/configs/axios";

export interface CreateFollowUpRequest {
  patient_id: string;
  doctor_id: string;
  hospital_id: string;
  book_user_id: string;
  slot_ids: string[];
  notes?: string;
  service_name: string;
  related_record_id: string;
}

class AppointmentClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  /**
   * Get appointments by patient ID
   * @param patientId - Patient ID
   * @param params - Optional filters (status, date, sort)
   * @returns Appointments list
   */
  async getAppointmentsByPatientId(
    patientId: string,
    params?: {
      status?: string;
      date?: string;
      sort?: string;
    },
  ): Promise<ListAppointmentsResponse> {
    const response = await this.client.get<ListAppointmentsResponse>(
      `/hospital/appointments/patient/${patientId}`,
      { params },
    );
    return response.data;
  }

  //Update status appointment
  async updateStatusAppointment(
    appointmentId: string,
    status: string,
  ): Promise<UpdateAppointmentStatusResponse> {
    const response = await this.client.put<UpdateAppointmentStatusResponse>(
      `/hospital/appointments/${appointmentId}/status`,
      { status },
    );
    return response.data;
  }

  async getOnlineAppointments(params: {
    book_user_id?: string;
    doctorId?: string;
  }): Promise<ListAppointmentsResponse> {
    const response = await this.client.get<ListAppointmentsResponse>(
      `/hospital/appointments/online`,
      { params },
    );
    return response.data;
  }

  async createFollowUpAppointment(payload: CreateFollowUpRequest): Promise<CreateFollowUpResponse> {
    const response = await this.client.post<CreateFollowUpResponse>(
      `/hospital/appointments/follow-up`,
      payload,
    );
    return response.data;
  }

  async cancelAppointment(appointmentId: string): Promise<CancelAppointmentResponse> {
    const response = await this.client.put<CancelAppointmentResponse>(
      `/hospital/appointments/${appointmentId}/cancel`,
    );
    return response.data;
  }
}

const AppointmentApi = new AppointmentClient();
export { AppointmentApi };
