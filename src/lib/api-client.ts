import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_CONSTANTS, STORAGE_KEYS } from '@/utils/constants';
import { ErrorResponse } from '@/types';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_CONSTANTS.BASE_URL_REMOTE,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor function
const requestInterceptor = (config: InternalAxiosRequestConfig) => {
    // Add token to headers if available
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    // Log request (development only)
    if (process.env.NODE_ENV === 'development') {
        console.log('🚀 Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: config.data,
        });
    }

    return config;
};

const requestErrorInterceptor = (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
};

// Response interceptor functions
const responseInterceptor = (response: AxiosResponse) => {
    // Log response (development only)
    if (process.env.NODE_ENV === 'development') {
        console.log('✅ Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data,
        });
    }

    return response;
};

const responseErrorInterceptor = (error: AxiosError<ErrorResponse>) => {
    // Handle error responses
    if (error.response) {
        const { status, data } = error.response;

        console.error('❌ Response Error:', {
            status,
            message: data?.message || error.message,
            url: error.config?.url,
        });

        // Handle 401 Unauthorized - redirect to login
        if (status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.clear();
                window.location.href = '/login';
            }
        }
    } else if (error.request) {
        console.error('❌ Network Error:', error.message);
    } else {
        console.error('❌ Error:', error.message);
    }

    return Promise.reject(error);
};

// Apply interceptors to apiClient
apiClient.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
apiClient.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

// API methods
export const api = {
    get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
        apiClient.get<T>(url, config),

    post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        apiClient.post<T>(url, data, config),

    put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        apiClient.put<T>(url, data, config),

    delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
        apiClient.delete<T>(url, config),

    patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        apiClient.patch<T>(url, data, config),
};

// DMS API client (separate base URL)
export const dmsApiClient: AxiosInstance = axios.create({
    baseURL: API_CONSTANTS.BASE_URL_DMS_PROXY,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Apply same interceptors to DMS client
dmsApiClient.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
dmsApiClient.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

export const dmsApi = {
    get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
        dmsApiClient.get<T>(url, config),

    post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        dmsApiClient.post<T>(url, data, config),

    put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        dmsApiClient.put<T>(url, data, config),

    delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
        dmsApiClient.delete<T>(url, config),
};

export default apiClient;
