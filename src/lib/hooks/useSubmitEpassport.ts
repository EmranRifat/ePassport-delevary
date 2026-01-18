import { useState } from "react";
import { EpassportRequest, EpassportResponse } from "../types";

export const useSubmitEpassport = (token?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EpassportResponse | null>(null);



  const submitEpassport = async (
    requestData: EpassportRequest
  ): Promise<EpassportResponse> => {
    setLoading(true);
    setError(null);

    try {
      const payload: EpassportRequest = {
        ...requestData,
      };

      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DMS_BASE_URL}/api/epassportsubmit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(payload),
        }
      );


      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Request failed (${response.status}): ${errorText}`);
      }

      const responseText = await response.text();
      console.log("Raw response text:", responseText);

      // Handle empty response
      if (!responseText || responseText.trim() === "") {
        console.log("Empty response received, treating as success");
        const emptyResponse: EpassportResponse = {
          success: true,
          message: "E-passport submitted successfully",
          status_code: "200",
        };
        setData(emptyResponse);
        return emptyResponse;
      }

      const apiResponse = JSON.parse(responseText);
      console.log("Parsed API response:", apiResponse);

      // ✅ Normalize API response
      const normalizedResponse: EpassportResponse = {
        ...apiResponse,
        success:
          apiResponse?.status_code === "200" ||
          apiResponse?.status?.toLowerCase() === "success",
      };

      setData(normalizedResponse);
      return normalizedResponse;
    } catch (err: any) {
      const message =
        err?.message || "Unable to submit ePassport data";
      setError(message);
      throw err; // only real failures
    } finally {
      setLoading(false);
    }
  };

  return {
    submitEpassport,
    loading,
    error,
    data,
  };
};
