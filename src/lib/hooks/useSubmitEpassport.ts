import { useCallback, useState } from "react";
import { EpassportResponse, SubmitEpassportInput } from "../types";


const APP_CONSTANTS = {
  USER_GROUP: "POSTAGE_POS",
  EMTS_BRANCH_CODE: "121500",
  MY_BRANCH_CODE: "121500",
  SENDER_NAME: "Passport Personalization Complex",
  SENDER_ADDRESS: "Plot-4, Road-1, Sector-16(i), Diabari, Uttara, Dhaka-1711",
  ITEM_DESC: "ePassport_RPO",
  VAS_TYPE: "GEP",
} as const;





export const useSubmitEpassport = (token?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EpassportResponse | null>(null);

  // console.log("token ,,,,,,", token);

  const submitEpassport = useCallback(
    async (input: SubmitEpassportInput): Promise<EpassportResponse> => {
      setLoading(true);
      setError(null);

      try {

        const requestBody = {
          user_id: input.userId || "",
          user_group: APP_CONSTANTS.USER_GROUP,
          city_post_status: input.cityPostStatus ?? "",
          is_city_post: "No",
          isCharge: "Yes",
          is_bulk_mail: "No",

          emts_branch_code: "121500",
          my_branch_code: "121500",

          shift: input.shift ?? "",
          hnddevice: input.hnddevice ?? "",
          service_type: input.serviceType,
          printed_item_id: input.barcodeId,
          item_weight: String(input.itemWeight),

          isStation: "No",
          delivery_Branch_Code: "0",

          vas_type: APP_CONSTANTS.VAS_TYPE,
          set_ad: "No",
          vp_service: "No",
          vp_amount: "0",
          item_price: "0",
          insurance_price: "0",

          rec_name: input.recName,
          rec_contact: "0",
          rec_address: input.recAddress,

          sen_name: APP_CONSTANTS.SENDER_NAME,
          sen_contact: input.recPhoneNo || "",
          sen_address: APP_CONSTANTS.SENDER_ADDRESS,

          item_desc: APP_CONSTANTS.ITEM_DESC,
          image_src: "No",
          image_pod: "0",
          ad_pod_id: "0",
        };
        const payload = {
          token: input.token ?? token ?? "",
          request_body: requestBody,
        };

        console.log("[useSubmitEpassport] POST payload", payload);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_DMS_BASE_URL}/api/epassportsubmit`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },

            body: payload ? JSON.stringify(payload) : null,
          },
        );

        console.log("epassport response fetch-->>", response);

        const responseText = await response.text();
        console.log("[useSubmitEpassport] responseText", responseText);

        if (!response.ok) {
          console.error(
            "[useSubmitEpassport] API error status",
            response.status,
            "text",
            responseText,
          );
          throw new Error(
            `Request failed (${response.status}): ${responseText}`,
          );
        }

        if (!responseText?.trim()) {
          const emptyResponse: EpassportResponse = {
            success: true,
            message: "E-passport submitted successfully",
            status_code: "200",
          };
          setData(emptyResponse);
          return emptyResponse;
        }

        const apiResponse = JSON.parse(responseText);

        const normalizedResponse: EpassportResponse = {
          ...apiResponse,
          success: apiResponse?.status_code === "200", // Success if status_code is 200
        };

        setData(normalizedResponse);
        return normalizedResponse;
      } catch (err: any) {
        const message = err?.message || "Unable to submit ePassport data";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  return {
    submitEpassport,
    loading,
    error,
    data,
  };
};
