import { AxiosInstance } from "axios";
import { ListTimeSlotsByDateResponse, ListTimeSlotsByMonthResponse } from "../../types/response";
import api from "../../../../shared/configs/axios";

const endpoint = "/hospital/timeslots";

class TimeSlotClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- Get TimeSlots By Doctor And Date ----------------
  async getByDoctorAndDate(doctorId: string, date: string): Promise<ListTimeSlotsByDateResponse> {
    const response = await this.client.get<ListTimeSlotsByDateResponse>(
      `${endpoint}/doctor/${doctorId}/date`,
      {
        params: { date }, // format YYYY-MM-DD
      },
    );
    return response.data;
  }

  // ---------------- Get TimeSlots By Doctor And Month ----------------
  async getByDoctorAndMonth(
    doctorId: string,
    month: string,
  ): Promise<ListTimeSlotsByMonthResponse> {
    const response = await this.client.get<ListTimeSlotsByMonthResponse>(
      `${endpoint}/doctor/${doctorId}/month`,
      {
        params: { month }, // format YYYY-MM
      },
    );
    return response.data;
  }
}

const TimeSlotApi = new TimeSlotClient();
export { TimeSlotApi };
