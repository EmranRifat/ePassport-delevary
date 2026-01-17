// Request type
export interface BarcodeCheckRequest {
    user_id: string;
    post_code: string;
}

// Pending booking request type
export interface PendingBookingRequest {
    user_id: string;
    barcode: string;
    booking_status: string;
}

// Pending booking response type
export interface PendingBookingResponse {
    status_code: string;
    message: string;
}

// Response type
export interface BarcodeCheckResponse {
    status_code: string;
    status?: string;
    message?: string;
    success?: boolean; // ✅ Add this property
    user_id?: string;
    insurance_id?: string | null;
    rpo_address?: string;
    phone?: string;
    post_code?: string;
    rpo_name?: string;
    barcode?: string | null;
    item_id?: string | null;
    total_charge?: string | null;
    service_type?: string | null;
    vas_type?: string | null;
    price?: string | null;
    insured?: string | null;
    booking_status?: string;
    created_at?: string;
    updated_at?: string;
}

export interface GetMissingBarcodeRequest {
  user_id: string;
  user_pass: string;
  barcode_qty: number;
  barcode_type: string;
}

export interface MissingBarcodeResponse {
  status?: string;
  status_code?: string;
  message?: string;
  barcode: string | null;
  success?: boolean;
}




export interface BookingDataRequest {
  user_id: string;
  user_group: string;
  city_post_status: "Yes" | "No";
  is_city_post: "Yes" | "No";
  emts_branch_code: string;
  my_branch_code: string;
  shift: string;
  hnddevice: string;
  service_type: string;
  printed_item_id: string;
  item_weight: number;
  isCharge: "Yes" | "No";
  isStation: "Yes" | "No";
  delivery_Branch_Code: string;
  vas_type: string;
  set_ad: "Yes" | "No";
  vp_service: "Yes" | "No";
  vp_amount: number;
  item_price: number;
  insurance_price: number;
  is_bulk_mail: "Yes" | "No";
  rec_name: string;
  rec_contact: string;
  rec_address: string;
  sen_name: string;
  sen_contact: string;
  sen_address: string;
  item_desc: string;
  image_src: "Yes" | "No";
  image_pod: number;
  ad_pod_id: number;
}
export interface BookingDataResponse {
  success: boolean;
  status?: string;
  status_code?: string;
  message?: string;
  barcode?: string | null;
  [key: string]: any;
}

export interface EpassportRequest {
  user_id: string;          // dynamic
  item_id: string;          // dynamic (barcode)
  total_charge: number;
  service_type: "Parcel";
  vas_type: "GEP";
  price: number;
  insured: number;
  booking_status: "Booked";
}

export interface EpassportResponse {
  status_code?: string;
  status?: string;
  message?: string;
  created_at?: string;
  updated_at?: string;
  success?: boolean;
}
export interface BrtaBookingLicenceResponse {
  status_code?: string;
  data?: string;   // "463"
  success?: boolean;
}

export interface StoreaDataRequest {
  user_id: string;
  insurance_id: string;
  rpo_address: string;
  phone: string;
  post_code: string;
  rpo_name: string;
  barcode: string;
  booking_status: "Init" | "Booked";
}

export interface StoreaDataRequestResponse {
  status_code?: string;
  message?: string;
  created_at?: string;
  success?: boolean;
}

