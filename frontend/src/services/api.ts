import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import type { ApiError } from '../types/api';

/**
 * TrendFlow AI Axios API Client
 * Configured to interface with the FastAPI backend.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor (e.g. for attaching auth tokens or trace IDs)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add custom header or token if available
    const token = localStorage.getItem('tw_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for unified error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<{ detail?: string; message?: string }>) => {
    const formattedError: ApiError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'An unexpected API error occurred',
      detail: error.response?.data?.detail,
    };

    console.error(`[API Error ${formattedError.status}]:`, formattedError.message, formattedError.detail);
    return Promise.reject(formattedError);
  }
);

export default apiClient;
