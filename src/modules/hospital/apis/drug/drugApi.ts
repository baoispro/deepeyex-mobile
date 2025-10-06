// src/apis/DrugApi.ts
import { AxiosInstance } from 'axios';
import { GetDrugByIdResponse, ListDrugsResponse } from '../../types/response';
import api from '../../../../shared/configs/axios';

const endpoint = '/hospital/drugs';

class DrugClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- List All Drugs ----------------
  async getAll(): Promise<ListDrugsResponse> {
    const response = await this.client.get<ListDrugsResponse>(endpoint);
    return response.data;
  }

  // ---------------- Get Drug By ID ----------------
  async getById(drugId: string): Promise<GetDrugByIdResponse> {
    const response = await this.client.get<GetDrugByIdResponse>(
      `${endpoint}/${drugId}`,
    );
    return response.data;
  }
}

const DrugApi = new DrugClient();
export { DrugApi };
