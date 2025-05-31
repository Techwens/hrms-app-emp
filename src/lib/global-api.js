import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device"; // Alternative to `DeviceUtils` for Expo

// Storage Keys
const AUTH_STATUS_KEY = "tw_hrms_auth_status";
const TOKEN_KEY = "hrms_token";
const ADMIN_TOKEN_KEY = "tw_hrms_admin_token";
const USER_DATA_KEY = "tw_hrms_user_data";

// API Base URL setup
export const URL_OPTIONS = {
  API:
    process.env.NODE_ENV === "development"
      ? // ? "http://localhost:8899"
        "http://192.168.1.4:8899"
      : "https://api.nouee.com",
};

export const commonExtendedApi = "/v1";
export const BaseURL = URL_OPTIONS.API + commonExtendedApi;

// Enhanced token management
const getToken = async (customToken) => {
  if (customToken) return customToken;
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) return token;
  return await AsyncStorage.getItem(ADMIN_TOKEN_KEY);
};

// Get device info (basic alternative for React Native Expo)
const getDeviceInfo = () => {
  return {
    brand: Device.brand,
    modelName: Device.modelName,
    osName: Device.osName,
    osVersion: Device.osVersion,
  };
};

const api = axios.create({
  baseURL: BaseURL,
  timeout: 30000,
});

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await getToken(config.customToken);
    const deviceInfo = getDeviceInfo();

    config.headers["Device-Info"] = JSON.stringify(deviceInfo);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (you can enhance it further if needed)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const isAuthRelatedURL =
        originalRequest?.url?.includes("/signin") ||
        originalRequest?.url?.includes("/signup") ||
        originalRequest?.url?.includes("/forgot-password") ||
        originalRequest?.url?.includes("/reset-password");

      // Add custom logout handling here if needed
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default api;
