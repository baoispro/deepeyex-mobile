import { AxiosInstance } from 'axios';
import api from '../../../../shared/configs/axios';
import { ApiResponse } from '../../../../shared/types/response';
import { OrdersResponse } from '../../types/order';

const endpoint = '/hospital/orders';
// ---------------- ENUM ----------------
export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELED' | 'DELIVERED';

// ---------------- SUB TYPES ----------------
export interface OrderItem {
  id: string; // ID item trong order
  order_id: string; // ID order chứa item
  item_id: string; // ID sản phẩm hoặc dịch vụ
  item_name: string; // Tên sản phẩm/dịch vụ
  quantity: number; // Số lượng
  price: number; // Đơn giá
  total_price: number; // Tổng giá (quantity * price)
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

export interface DeliveryInfo {
  address?: string; // Địa chỉ giao hàng (nếu có)
  phone?: string; // SĐT người nhận
  note?: string; // Ghi chú giao hàng
  method?: 'PICKUP' | 'HOME_DELIVERY'; // Hình thức nhận hàng
}

// ---------------- MAIN ORDER ----------------
export interface Order {
  order_id: string;
  patient_id: string;
  appointment_id?: string | null;
  book_user_id: string;
  status: OrderStatus;
  total_amount: number;
  items: OrderItem[];
  delivery_info?: DeliveryInfo | null;
  created_at: string;
  updated_at: string;
}

// ---------------- REQUEST TYPES ----------------
export interface OrderItemRequest {
  item_id?: string;
  service_id?: string;
  quantity: number;
  price: number;
  drug_id?: string;
  item_name: string;
}

export interface CreateOrderRequest {
  patient_id: string;
  appointment_id?: string;
  book_user_id: string;
  items: OrderItemRequest[];
  delivery_info?: DeliveryInfo;
}

class OrderClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  /**
   * Tạo đơn hàng mới
   * @param data - Thông tin đơn hàng
   * @returns Order object
   */
  async createOrder(data: CreateOrderRequest): Promise<ApiResponse<Order>> {
    const response = await this.client.post<ApiResponse<Order>>(endpoint, data);
    return response.data;
  }

  /**
   * Lấy danh sách orders theo patient_id
   * @param patientId - Patient ID
   * @returns Orders list
   */
  async getOrdersByPatientId(patientId: string): Promise<OrdersResponse> {
    const response = await this.client.get<OrdersResponse>(
      `${endpoint}/patient/${patientId}`,
    );
    return response.data;
  }

  /**
   * Cập nhật trạng thái đơn hàng
   * @param orderId - Order ID
   * @param status - New status
   * @returns Updated order
   */
  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const response = await this.client.put<Order>(
      `${endpoint}/${orderId}/status`,
      { status },
    );
    return response.data;
  }
}

const OrderApi = new OrderClient();
export { OrderApi };
