import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";

interface EPassportReportPayload {
  user_id: string;
  start_date: string; // DD-MM-YYYY
  end_date: string;
}

interface EPassportReportItem {
  id: number;
  user_id: string;
  insurance_id: string | null;
  rpo_address: string;
  phone: string;
  post_code: string;
  rpo_name: string;
  barcode: string;
  item_id: string;
  total_charge: string;
  service_type: string;
  vas_type: string;
  price: string;
  insured: string;
  booking_status: string;
  created_at: string;
  pending_date: string;
  booking_date: string;
  delivered_date: string | null;
  updated_at: string;
  is_check_today: number;
  push_status: number;
}

interface EPassportReportResponse {
  status_code: string;
  status: string;
  total: number;
  data: EPassportReportItem[];
  message?: string;
}

const postEPassportReport = async (payload: EPassportReportPayload ): Promise<EPassportReportResponse> => {
 
    // const url = `${process.env.NEXT_PUBLIC_API_DMS_BASE_URL}/api/epassportreport`;
    const url = `${process.env.NEXT_PUBLIC_API_DMS_BASE_URL}/api/operator/epassportreport`;
    const token = Cookies.get("auth-token") || "";

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    // credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data: EPassportReportResponse = await response.json();
  console.log("print_report_fetch-->",data)


  
  if (data.status_code !== "200" || data.status !== "success") {
    throw new Error(data.message || "Failed to fetch report");
  }

  return data;
};





export const usePostEPassportReport = () => {
  return useMutation<EPassportReportResponse, Error, EPassportReportPayload>({
    mutationFn: postEPassportReport,
  });
};