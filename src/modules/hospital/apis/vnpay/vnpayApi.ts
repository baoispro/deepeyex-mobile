import { AxiosInstance } from 'axios';
import api from '../../../../shared/configs/axios';
import { ApiResponse } from '../../../../shared/types/response';

const endpoint = '/hospital/vnpay';

// ---------------- REQUEST TYPES ----------------
export interface CreatePaymentRequest {
  amount: number;
  orderId: string;
}

// ---------------- RESPONSE TYPES ----------------
export interface CreatePaymentResponse {
  paymentUrl: string;
}

export interface VnpayReturnResponse {
  orderId: string;
  status: 'success' | 'failed';
  code?: string;
}

class VnpayClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  /**
   * Tạo URL thanh toán VNPay
   * @param data - Thông tin thanh toán
   * @returns Payment URL
   */
  async createPaymentURL(
    data: CreatePaymentRequest,
  ): Promise<ApiResponse<CreatePaymentResponse>> {
    const response = await this.client.post<ApiResponse<CreatePaymentResponse>>(
      `${endpoint}/create-payment`,
      data,
    );
    return response.data;
  }

  /**
   * Xác thực callback từ VNPay
   * @param queryParams - Query params từ VNPay
   * @returns Kết quả thanh toán
   */
  async verifyReturn(
    queryParams: string,
  ): Promise<ApiResponse<VnpayReturnResponse>> {
    const response = await this.client.get<ApiResponse<VnpayReturnResponse>>(
      `${endpoint}/return${queryParams}`,
    );
    return response.data;
  }
}

const VnpayApi = new VnpayClient();
export { VnpayApi };
