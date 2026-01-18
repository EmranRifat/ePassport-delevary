// bookingBasePayload.ts

import { BookingDataRequest } from "@/lib/types";

export const BOOKING_BASE_PAYLOAD: Omit<BookingDataRequest,
  "user_id" | "printed_item_id"
> = {
  user_group: "POSTAGE_POS",
  city_post_status: "Yes",
  is_city_post: "No",
  emts_branch_code: "121500",
  my_branch_code: "121500",
  shift: "D",
  hnddevice: "9",
  service_type: "Parcel",
  item_weight: 1000,
  isCharge: "Yes",
  isStation: "No",
  delivery_Branch_Code: "0",
  vas_type: "GEP",
  set_ad: "No",
  vp_service: "No",
  vp_amount: 0,
  item_price: 0,
  insurance_price: 0,
  is_bulk_mail: "No",
  rec_name: "0",
  rec_contact: "0",
  rec_address: "Regional Passport Office, Chandgaon (ctg) 4102",
  sen_name: "Passport Personalization Complex",
  sen_contact: "01733393350",
  sen_address: "Plot-4, Road-1, Sector-16(i), Diabari, Uttara, Dhaka-1711",
  item_desc: "ePassport_RPO",
  image_src: "No",
  image_pod: 0,
  ad_pod_id: 0,
};
