import { useState } from 'react';
import { api } from '@/lib/api-client';
import { PendingBookingRequest, PendingBookingResponse } from '../types';

export const usePrintServerRes = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<PendingBookingResponse | null>(null);

    const submitPrintStatusServer = async (requestData: PendingBookingRequest): Promise<PendingBookingResponse> => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.post<PendingBookingResponse>(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/epassportpanding`,
                requestData
            );

            const responseData = response.data;

            // Check for success
            const isSuccess = responseData.status_code === '200';

            if (!isSuccess) {
                const errorMsg = responseData.message || 'Pending booking submission failed';
                setError(errorMsg);
                throw new Error(errorMsg);
            }

            setData(responseData);
            return responseData;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'An error occurred';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        submitPrintStatusServer,
        loading,
        error,
        data,
    };
};
