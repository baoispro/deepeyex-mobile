import api from "../../../../shared/configs/axios";
import { AxiosInstance } from "axios";
import {
  CreateHospitalResponse,
  DeleteHospitalResponse,
  ListHospitalsResponse,
  UpdateHospitalResponse,
  GetHospitalByIdResponse,
  ListCitiesResponse,
  ListWardsByCityResponse,
  SearchByAddressResponse,
  ListByCityAndWardResponse,
  ListNearbyHospitalsResponse,
} from "../../types/response";

const endpoint = "/hospital/hospitals";

class HospitalClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- Create Hospital ----------------
  async create(form: FormData): Promise<CreateHospitalResponse> {
    const response = await this.client.post<CreateHospitalResponse>(endpoint, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  // ---------------- List All Hospitals ----------------
  async getAll(): Promise<ListHospitalsResponse> {
    const response = await this.client.get<ListHospitalsResponse>(endpoint);
    return response.data;
  }

  // ---------------- Get Hospital By ID ----------------
  async getById(hospitalId: string): Promise<GetHospitalByIdResponse> {
    const response = await this.client.get<GetHospitalByIdResponse>(`${endpoint}/${hospitalId}`);
    return response.data;
  }

  // ---------------- Update Hospital ----------------
  async update(hospitalId: string, updateData: FormData): Promise<UpdateHospitalResponse> {
    const response = await this.client.put<UpdateHospitalResponse>(
      `${endpoint}/${hospitalId}`,
      updateData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  }

  // ---------------- Delete Hospital ----------------
  async delete(hospitalId: string): Promise<DeleteHospitalResponse> {
    const response = await this.client.delete<DeleteHospitalResponse>(`${endpoint}/${hospitalId}`);
    return response.data;
  }

  // ---------------- List Cities ----------------
  async listCities(): Promise<ListCitiesResponse> {
    const response = await this.client.get<ListCitiesResponse>(`${endpoint}/cities`);
    return response.data;
  }

  // ---------------- List Wards By City ----------------
  async listWardsByCity(city: string): Promise<ListWardsByCityResponse> {
    const response = await this.client.get<ListWardsByCityResponse>(`${endpoint}/wards`, {
      params: { city },
    });
    return response.data;
  }

  // ---------------- Search By Address ----------------
  async searchByAddress(keyword: string): Promise<SearchByAddressResponse> {
    const response = await this.client.get<SearchByAddressResponse>(`${endpoint}/search/address`, {
      params: { keyword },
    });
    return response.data;
  }

  // ---------------- List By City And Ward ----------------
  async filter(city?: string, ward?: string): Promise<ListByCityAndWardResponse> {
    const response = await this.client.get<ListByCityAndWardResponse>(`${endpoint}/filter`, {
      params: { city, ward },
    });
    return response.data;
  }

  async findNearby(
    latitude: number,
    longitude: number,
    radius_km: number,
  ): Promise<ListNearbyHospitalsResponse> {
    const response = await this.client.post<ListNearbyHospitalsResponse>(`${endpoint}/nearby`, {
      latitude,
      longitude,
      radius_km,
    });
    return response.data;
  }

  async getBySlug(slug: string): Promise<GetHospitalByIdResponse> {
    const response = await this.client.get<GetHospitalByIdResponse>(`${endpoint}/slug/${slug}`);
    return response.data;
  }
}

const HospitalApi = new HospitalClient();
export { HospitalApi };
