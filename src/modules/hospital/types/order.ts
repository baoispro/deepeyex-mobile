import { Appointment } from '../apis/booking/bookingApi';
import { Patient } from './patient';

export interface OrderItem {
  order_item_id: string;
  order_id: string;
  drug_id: string;
  service_id: string;
  item_name: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type DeliveryMethod = 'PICKUP' | 'HOME_DELIVERY';

export interface Order {
  order_id: string;
  patient_id: string;
  appointment_id: string;
  book_user_id: string;
  created_at: string;
  status: OrderStatus;
  total_amount: number;
  delivery_method: DeliveryMethod;
  delivery_fee: number;
  order_items: OrderItem[];
  patient: Patient;
  appointment: Appointment;
}

export interface OrdersResponse {
  status: number;
  message: string;
  data: Order[];
}

export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Đã hoàn tất',
  CANCELLED: 'Đã hủy',
};

export const deliveryMethodLabels: Record<DeliveryMethod, string> = {
  PICKUP: 'Nhận tại cơ sở',
  HOME_DELIVERY: 'Giao hàng tận nơi',
};
