import axios, { AxiosInstance } from 'axios';
import { store } from '../stores';
import { setTokens, clearTokens } from '../stores/authSlice';
import { refreshToken } from '../api/refreshToken';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '@env';

// ---------------------- Axios instance ----------------------
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ---------------------- Request Interceptor ----------------------
api.interceptors.request.use(config => {
  const token = store.getState().auth.accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ✅ DEBUG: Log request details
  console.log('🌐 API REQUEST:', {
    method: config.method?.toUpperCase(),
    url: config.url,
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url}`,
    headers: config.headers,
    data:
      config.data instanceof FormData
        ? 'FormData (see details below)'
        : config.data,
  });

  // ✅ DEBUG: Log FormData contents (if applicable)
  if (config.data instanceof FormData) {
    console.log('📦 FormData contents:');
    // Note: FormData không thể iterate trực tiếp trong React Native
    // Nhưng log này giúp biết là đang gửi FormData
  }

  return config;
});

// ---------------------- Response Interceptor ----------------------
api.interceptors.response.use(
  response => {
    // ✅ DEBUG: Log successful response
    console.log('✅ API RESPONSE:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  async error => {
    // ✅ DEBUG: Log error response
    console.error('❌ API ERROR:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      errorData: error.response?.data,
      errorMessage: error.message,
    });
    const originalRequest = error.config;

    // ✅ nếu token hết hạn (401), thử refresh 1 lần
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const state = store.getState().auth;
        const oldRefresh = state.refreshToken;
        const res = await refreshToken(oldRefresh ?? '');

        if (res.data?.access_token) {
          // ✅ cập nhật token mới vào Redux store
          store.dispatch(
            setTokens({
              accessToken: res.data.access_token,
              refreshToken: res.data.refresh_token ?? '',
              userId: state.userId ?? '',
              role: state.role ?? '',
            }),
          );

          // ✅ gắn lại token mới vào request cũ rồi gửi lại
          originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        // ❌ Refresh thất bại → logout + chuyển về login
        const navigate = useNavigation();
        store.dispatch(clearTokens());
        navigate.navigate('Login' as never);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
