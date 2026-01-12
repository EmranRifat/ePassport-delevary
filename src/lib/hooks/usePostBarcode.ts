import { useState } from 'react';
import { api } from '@/lib/api-client';
import { BarcodeCheckRequest, BarcodeCheckResponse } from '../types';



export const usePostBarcode = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<BarcodeCheckResponse | null>(null);

    const postBarcode = async (requestData: BarcodeCheckRequest): Promise<BarcodeCheckResponse> => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.post<BarcodeCheckResponse>(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/epassportchack`,
                requestData
            );

            const responseData = response.data

            // Check for success
            const isSuccess =
                responseData.status?.toLowerCase() === 'success' ||
                responseData.status_code === '200';

            if (!isSuccess) {
                const errorMsg = responseData.message || 'Barcode check failed';
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
        postBarcode,
        loading,
        error,
        data,
    };
};
