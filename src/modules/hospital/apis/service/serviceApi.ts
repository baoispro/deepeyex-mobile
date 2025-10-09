import { AxiosInstance } from 'axios';
import api from '../../../../shared/configs/axios';
import { ListServicesResponse } from '../../types/response';

class ServiceClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  async getServicesByDoctorId(doctorId: string): Promise<ListServicesResponse> {
    const response = await this.client.get(
      `/hospital/doctors/${doctorId}/services`,
    );
    return response.data;
  }
}

const ServiceApi = new ServiceClient();
export { ServiceApi };
