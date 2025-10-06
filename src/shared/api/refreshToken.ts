import axios from 'axios';
import { ApiResponse } from '../types/response';
import {API_BASE_URL} from '@env'

// tạo 1 axios instance "raw" (không interceptor) để tránh loop

export type TokenResponse = {
  access_token: string;
  access_expire: string;
  refresh_token: string;
  refresh_expire: string;
};

const rawAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export async function refreshToken(oldRefreshToken: string) {
  const res = await rawAxios.post<ApiResponse<TokenResponse>>(
    '/public/mobile/refresh',
    {
      refresh_token: oldRefreshToken, // body theo backend yêu cầu
    },
  );
  return res.data;
}
