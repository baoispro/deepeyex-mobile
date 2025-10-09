import { AxiosInstance } from 'axios';
import api from '../../../../shared/configs/axios';

// ---------- Types ----------
export interface OrderItem {
  service_id: number;
  item_name: string;
  quantity: number;
  price: number;
}

export interface SendEmailRequest {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text?: string;
}

export interface SendAppointmentConfirmationRequest {
  to_email: string;
  patient_name: string;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  appointment_code: string;
  order_items: OrderItem[];
}

export interface SendAppointmentReminderRequest {
  to_email: string;
  patient_name: string;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
}

export interface SendPrescriptionRequest {
  to_email: string;
  patient_name: string;
  prescription_details: string;
}

// ---------- Client ----------
class EmailClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // 📨 Gửi email tùy chỉnh
  async sendEmail(payload: SendEmailRequest) {
    const response = await this.client.post('/emails/send', payload);
    return response.data;
  }

  // ✅ Gửi email xác nhận lịch hẹn
  async sendAppointmentConfirmation(
    payload: SendAppointmentConfirmationRequest,
  ) {
    const response = await this.client.post(
      '/hospital/emails/appointment-confirmation',
      payload,
    );
    return response.data;
  }

  // ⏰ Gửi email nhắc nhở lịch hẹn
  async sendAppointmentReminder(payload: SendAppointmentReminderRequest) {
    const response = await this.client.post(
      '/emails/appointment-reminder',
      payload,
    );
    return response.data;
  }

  // 💊 Gửi email đơn thuốc
  async sendPrescription(payload: SendPrescriptionRequest) {
    const response = await this.client.post('/emails/prescription', payload);
    return response.data;
  }
}

const SendEmailApi = new EmailClient();
export { SendEmailApi };
