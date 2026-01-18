import { useState } from "react";
import { BookingDataRequest, BookingDataResponse } from "../types";

export const useSubmitBookingData = (token?: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<BookingDataResponse | null>(null);

    const bookingBarcodeSubmit = async (
        requestData: BookingDataRequest
    ): Promise<BookingDataResponse> => {
        setLoading(true);
        setError(null);

        try {
            const headers: Record<string, string> = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
                console.log("Token added to Authorization header:", token);
            } else {
                console.warn("No token provided for booking submission");
            }

        const response = await fetch(`${process.env.NEXT_PUBLIC_EKDAK_BASE_URL}/app_dommail_internal_api/public/ws/bookingreq`,
                {
                    method: "POST",
                    headers,
                    body: JSON.stringify(requestData),
                }
            );

            if (!response.ok) {
                throw new Error(`Request failed (${response.status})`);
            }

            const apiResponse = await response.json();

            // ✅ Normalize API response
            const normalizedResponse: BookingDataResponse = {
                ...apiResponse,
                success:
                    apiResponse?.status_code === "200" ||
                    apiResponse?.status?.toLowerCase() === "success",
            };

            setData(normalizedResponse);
            return normalizedResponse;
        } catch (err: any) {
            const message =
                err?.message || "Unable to submit booking data";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        bookingBarcodeSubmit,
        loading,
        error,
        data,
    };
};
