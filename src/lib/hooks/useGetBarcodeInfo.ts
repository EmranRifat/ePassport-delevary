import { useState } from "react";
import { BarcodeCheckRequest, BarcodeCheckResponse } from "../types";

export const useGetBarcodeData = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<BarcodeCheckResponse | null>(null);

    const GetBarcodeInfo = async (requestData: BarcodeCheckRequest): Promise<BarcodeCheckResponse> => {
        setLoading(true); setError(null);

        try {
            // Using native fetch instead of api-client
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_DMS_BASE_URL}/api/epassportchack`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData: BarcodeCheckResponse = await response.json();

            // ✅ Normalize success
            const isSuccess =
                responseData.status?.toLowerCase() === "success" ||
                responseData.status_code === "200";

            const normalizedResponse: BarcodeCheckResponse = {
                ...responseData,
                success: isSuccess,
                barcode: responseData.barcode ?? null,
            };

            // Check if the response indicates failure
            if (!isSuccess || responseData.status_code === "404") {
                const errorMessage = responseData.message || "Data not found";
                setError(errorMessage);
                setData(normalizedResponse);
                return normalizedResponse;
            }

            setData(normalizedResponse);

            return normalizedResponse;
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Network error occurred";

            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        GetBarcodeInfo,
        loading,
        error,
        data,
    };
};
