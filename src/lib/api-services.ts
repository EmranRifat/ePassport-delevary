import { api, dmsApi } from '@/lib/api-client';
import { API_CONSTANTS } from '@/utils/constants';
import {
    LoginRequest,
    LoginResponse,
    DmsLoginRequest,
    DmsLoginResponse,
    BookingBody,
    BookingResponse,
    LicenseDataBody,
    LicenseDataResponse,
    LicenseIssueResponse,
    PassportDashboardResponse
} from '@/types';

// Authentication API
export const authApi = {


    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>(
            `${process.env.NEXT_PUBLIC_API_DMS_BASE_URL}/api/passportoperator-login`,
            data
        );
        return response.data;
    },





    dmsLogin: async (data: DmsLoginRequest): Promise<DmsLoginResponse> => {
        const response = await dmsApi.post<DmsLoginResponse>(
            `${process.env.NEXT_PUBLIC_EKDAK_BASE_URL}/app_dommail_internal_api/public/ws/login`,
            data
        );
        return response.data;
    },

    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.clear();
            // Remove all auth cookies
            document.cookie = 'auth-token=; path=/; max-age=0';
            document.cookie = 'user_id=; path=/; max-age=0';
            document.cookie = 'branch_code=; path=/; max-age=0';
            document.cookie = 'my_emts_branch_code=; path=/; max-age=0';
            document.cookie = 'rms_code=; path=/; max-age=0';
            document.cookie = 'shift=; path=/; max-age=0';
            document.cookie = 'city_post_status=; path=/; max-age=0';
        }
    },
};










// Booking API
export const bookingApi = {
    createBooking: async (data: BookingBody) => {
        const response = await dmsApi.post<BookingResponse>(
            API_CONSTANTS.DMS_BOOKING_URL,
            data
        );
        return response.data;
    },

    getBookingDetails: async (trackingNumber: string) => {
        const response = await api.get<BookingResponse>(
            `${API_CONSTANTS.DMS_BOOKING_URL}/${trackingNumber}`
        );
        return response.data;
    },
};

// License API
export const licenseApi = {
    getLicenseData: async (data: LicenseDataBody) => {
        const response = await api.post<LicenseDataResponse>(
            API_CONSTANTS.LICENSE_DATA_URL,
            data
        );
        return response.data;
    },

    updateLicenseDelivery: async (licenseNo: string, deliveryData: Record<string, unknown>) => {
        const response = await api.put<LicenseIssueResponse>(
            `${API_CONSTANTS.LICENSE_DATA_URL}/${licenseNo}`,
            deliveryData
        );
        return response.data;
    },
};

// Passport API
export const passportApi = {
    getDashboard: async () => {
        const response = await api.get<PassportDashboardResponse>(
            '/api/passport/dashboard'
        );
        return response.data;
    },

    getPassportDetails: async (passportNo: string) => {
        const response = await api.get(`/api/passport/${passportNo}`);
        return response.data;
    },

    updatePassportDelivery: async (passportNo: string, deliveryData: Record<string, unknown>) => {
        const response = await api.put(
            `/api/passport/${passportNo}/delivery`,
            deliveryData
        );
        return response.data;
    },
};
