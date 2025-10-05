// src/apis/authApi.ts
import { AxiosInstance } from 'axios';
import api from '../../../shared/configs/axios';

// ----------- Types -----------

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  firebase_uid?: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginFirebaseRequest = {
  firebase_uid: string;
  email: string;
};

export type TokenResponse = {
  access_token: string;
  access_expire: string;
  refresh_token: string;
  refresh_expire: string;
  user_id?: string;
  role?: string;
};

export type SuccessResponse<T = unknown> = {
  status: number;
  message: string;
  data?: T;
};

export type ErrorResponse = {
  status: number;
  message: string;
};

// ----------- Client Class -----------

class AuthClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- Register ----------------
  async register(
    form: RegisterRequest,
  ): Promise<SuccessResponse<{ id: string; username: string; email: string }>> {
    const response = await this.client.post<
      SuccessResponse<{ id: string; username: string; email: string }>
    >('/public/register', form);
    return response.data;
  }

  // 🔹 Login (Mobile)
  async login(form: LoginRequest): Promise<SuccessResponse<TokenResponse>> {
    const response = await this.client.post<SuccessResponse<TokenResponse>>(
      '/public/mobile/login',
      form,
    );
    return response.data;
  }

  // 🔹 Login Firebase (Mobile)
  async loginFirebase(
    form: LoginFirebaseRequest,
  ): Promise<SuccessResponse<TokenResponse>> {
    const response = await this.client.post<SuccessResponse<TokenResponse>>(
      '/public/mobile/login/firebase',
      form,
    );
    return response.data;
  }

  // 🔹 Refresh Token (Mobile)
  async refresh(refreshToken: string): Promise<SuccessResponse<TokenResponse>> {
    const response = await this.client.post<SuccessResponse<TokenResponse>>(
      '/public/mobile/refresh',
      { refresh_token: refreshToken },
    );
    return response.data;
  }

  // 🔹 Logout (Mobile)
  async logout(refreshToken: string): Promise<SuccessResponse> {
    const response = await this.client.post<SuccessResponse>(
      '/public/mobile/logout',
      {
        refresh_token: refreshToken,
      },
    );
    return response.data;
  }

  // 🔹 Lấy thông tin người dùng (dùng access token)
  async me(): Promise<SuccessResponse<{ user_id: string; role: string }>> {
    const response = await this.client.get<
      SuccessResponse<{ user_id: string; role: string }>
    >('/private/me');
    return response.data;
  }
}

const AuthApi = new AuthClient();
export { AuthApi };
