import { useState } from "react";
import { StoreaDataRequest, StoreaDataRequestResponse } from "../types";

export const useStoreMissingData = (token?: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<StoreaDataRequestResponse | null>(null);




    const storeMissingData = async (requestData: StoreaDataRequest ): Promise<StoreaDataRequestResponse> => {
        setLoading(true); setError(null);

        try {
            const headers: Record<string, string> = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            console.log("Submitting missing booking data:", requestData);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_DMS_BASE_URL}/api/epassportstore`,
                {
                    method: "POST",
                    headers,
                    body: JSON.stringify(requestData),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `Request failed (${response.status}): ${errorText}`
                );
            }

            const responseText = await response.text();
            console.log("MissingStoreResFetch --->,", responseText)
            // ✅ Handle empty body safely
            if (!responseText || responseText.trim() === "") {
                const emptySuccess: StoreaDataRequestResponse = {
                    status_code: "200",
                    message: "Success",
                    success: true,
                };

                setData(emptySuccess);
                return emptySuccess;
            }

            const apiResponse = JSON.parse(responseText);

            const normalizedResponse: StoreaDataRequestResponse = {
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
        storeMissingData,
        loading,
        error,
        data,
    };
};
