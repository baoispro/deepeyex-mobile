import { AxiosInstance } from 'axios';
import api from '../../../../shared/configs/axios';

// ---------------------- Types ----------------------
export interface BookingRequest {
  patient_id: string;
  doctor_id: string;
  hospital_id: string;
  slot_ids: string[]; // danh sách SlotID
  book_user_id: string;
  notes?: string;
  order_items: OrderItemRequest[];
  payment_status: 'PENDING' | 'PAID' | 'CANCELED' | 'DELIVERED';
  service_name: string;
}

export interface OrderItemRequest {
  drug_id?: string; // optional, nullable
  service_id?: string; // optional, nullable
  item_name: string; // gộp tên thuốc + dịch vụ
  quantity: number;
  price: number;
}

export interface BookingResponse {
  appointment: Appointment;
  order: Order;
}

export interface Appointment {
  appointment_id: string;
  appointment_code: string;
  patient_id: string;
  hospital_id: string;
  doctor_id: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED';
  notes?: string;
  created_at: string;
  updated_at: string;
  checked_in_at?: string;
  book_user_id: string;
}

export interface Order {
  order_id: string;
  patient_id: string;
  appointment_id: string;
  book_user_id: string;
  status: 'PENDING' | 'PAID' | 'CANCELED' | 'DELIVERED';
  total_price: number;
  created_at: string;
  updated_at: string;
  items: OrderItemRequest[];
}

// ---------------------- API Client ----------------------
const endpoint = '/hospital/bookings';

class BookingClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- Create Booking ----------------
  async createBooking(req: BookingRequest): Promise<BookingResponse> {
    const response = await this.client.post<BookingResponse>(endpoint, req);
    return response.data;
  }
}

const BookingApi = new BookingClient();
export { BookingApi };
