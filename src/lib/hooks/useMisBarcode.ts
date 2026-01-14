import { useState } from "react";
import {
  GetMissingBarcodeRequest,
  MissingBarcodeResponse,
} from "../types";

export const useGetMissingBarcode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MissingBarcodeResponse | null>(null);

  const getMissingBarcode = async (requestData: GetMissingBarcodeRequest): Promise<MissingBarcodeResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/passport_get_barcode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      // ✅ Normalize success
      const isSuccess =
        responseData?.status?.toLowerCase() === "success" ||
        responseData?.status_code === "200";

      // ✅ Clean barcode (API returns quoted string)
      const cleanedBarcode =
        typeof responseData?.barcode === "string"
          ? responseData.barcode.replace(/"/g, "")
          : null;

      const normalizedResponse: MissingBarcodeResponse = {
        ...responseData,
        success: isSuccess,
        barcode: cleanedBarcode,
      };

      // ❗ Missing barcode is NOT an error
      if (!cleanedBarcode) {
        setError(responseData?.message || "Barcode not available");
      }

      setData(normalizedResponse);
      return normalizedResponse;
    } catch (err: any) {
      const errorMessage =
        err?.message || "Network error occurred";

      setError(errorMessage);
      throw err; // only real failures
    } finally {
      setLoading(false);
    }
  };

  return {
    getMissingBarcode,
    loading,
    error,
    data,
  };
};
