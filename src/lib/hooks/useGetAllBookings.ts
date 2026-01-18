import { useState } from "react";
import {
  GetAllBookingsRequest,
  AllBookingResponse,
} from "../types";

export const useGetAllBookings = ({
  token,
}: {
  token: string | undefined;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AllBookingResponse | null>(null);

  const getAllBookings = async ( requestData: GetAllBookingsRequest): Promise<AllBookingResponse> => {
    
    if (!token) {
      const message = "Authentication token missing";
      setError(message);
      return Promise.reject(new Error(message));
    }
    setLoading(true);
    setError(null);

    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DMS_BASE_URL}/api/paginationpassport`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const responseData = await response.json();

      const normalizedResponse: AllBookingResponse = {
        ...responseData,
        success:
          responseData?.status_code === "200" ||
          responseData?.status?.toLowerCase() === "success",
        current_page: Number(responseData.current_page),
        total_page: Number(responseData.total_page),
        passportissuedata:
          responseData.passportissuedata ?? [],
      };

      setData(normalizedResponse);
      return normalizedResponse;
    } catch (err: any) {
      const message =
        err?.message || "Failed to fetch booking list";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getAllBookings,
    loading,
    error,
    data,
  };
};
