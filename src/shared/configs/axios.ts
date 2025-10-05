import axios, { AxiosInstance } from "axios";
import Config from "react-native-config";
import { store } from "../stores";
import { setTokens, clearTokens } from "../stores/authSlice";
import { refreshToken } from "../api/refreshToken";
import { useNavigation } from "@react-navigation/native";

// ---------------------- Axios instance ----------------------
const api: AxiosInstance = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ---------------------- Request Interceptor ----------------------
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------------- Response Interceptor ----------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ nếu token hết hạn (401), thử refresh 1 lần
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const state = store.getState().auth;
        const oldRefresh = state.refreshToken;
        const res = await refreshToken(oldRefresh ?? "");
        
        if (res.data?.access_token) {
          // ✅ cập nhật token mới vào Redux store
          store.dispatch(
            setTokens({
              accessToken: res.data.access_token,
              refreshToken: res.data.refresh_token ?? "",
              userId: state.userId ?? "",
              role: state.role ?? "",
            }),
          );

          // ✅ gắn lại token mới vào request cũ rồi gửi lại
          originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        // ❌ Refresh thất bại → logout + chuyển về login
        const navigate = useNavigation()
        store.dispatch(clearTokens());
        navigate.navigate("Login")
      }
    }

    return Promise.reject(error);
  },
);

export default api;
