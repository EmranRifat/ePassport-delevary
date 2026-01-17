import { useState } from "react";
import { BrtaBookingLicenceResponse } from "../types";

export const useGetBrtaBookingLicence = (token?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BrtaBookingLicenceResponse | null>(null);

  const getBrtaBookingLicence =
    async (): Promise<BrtaBookingLicenceResponse> => {
      setLoading(true);
      setError(null);
    
      // https://brta2.bpodms.gov.bd/api/brtabookinglicencecheck
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_DMS_BASE_URL}/api/brtabookinglicencecheck`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }

        const apiResponse = await response.json();

        const normalizedResponse: BrtaBookingLicenceResponse = {
          ...apiResponse,
          success: apiResponse?.status_code === "200",
        };

        setData(normalizedResponse);
        return normalizedResponse;
      } catch (err: any) {
        const message =
          err?.message || "Unable to fetch BRTA booking licence";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    };

  return {
    getBrtaBookingLicence,
    loading,
    error,
    data,
  };
};
