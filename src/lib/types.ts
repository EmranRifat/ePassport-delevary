import { RegionalPassportOffice } from "@/utils/address-util";

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
  user_id: string; // dynamic
  item_id: string; // dynamic (barcode)
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
  data?: string; // "463"
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

export interface AllBookingResponse {
  success: boolean;
  status_code: string;
  status: string;
  total_item: number;
  total_booked: number;
  total_delivered: number;
  current_page: number;
  total_page: number;
  passportissuedata: BookingItem[];
}
export interface BookingItem {
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
export interface GetAllBookingsRequest {
  user_id: string;
  start_date: string; // DD-MM-YYYY
  end_date: string; // DD-MM-YYYY
  page_no: number;
  par_page_data: number;
  status: "All" | "Booked" | "Delivered";
  rop_code?: string;
  rpo_name?: string;
  barcode?: string;
}
export interface PassportIssueData {
  user_id?: string;
  insurance_id?: string;
  rpo_address?: string;
  rpo_name?: string;
  phone?: string;
  post_code?: string;
  barcode?: string;
  item_id?: string;
  total_charge?: string;
  service_type?: string;
  vas_type?: string;
  price?: string;
  insured?: string;
  booking_status?: string;
  created_at?: string;
  updated_at?: string;
  booking_date?: string;
}

export interface DashboardResponse {
  status_code?: string;
  status?: string;
  total_item?: string;
  total_booked?: string;
  total_delivered?: string;
  total_page?: number;
  passportissuedata?: PassportIssueData[];
}
export interface BarcodeModalProps {
  showModal: boolean;
  selectedRPO: RegionalPassportOffice | null;
  initialBarcode?: string;
  barcodeLoading?: boolean;
  barcodeError?: string | null;
  status_code?: number | string;
  handleCloseModal: () => void;
  handleScan: () => void;
  handleOk: (barcode: string) => void;
  getTodayDate: () => string;
  handlePrint?: () => void;
  bookingErrorMessage?: string;
  bookingSuccessMessage?: string;
}
export interface PassportDataItem {
  barcode: string;
  booking_date: string;
  booking_status: string;
  created_at: string;
  delivered_date: string | null;
  id: number;
  insurance_id: string | null;
  insured: string;
  is_check_today: number;
  item_id: string;
  pending_date: string;
  phone: string;
  post_code: string;
  price: string;
  push_status: number;
  rpo_address: string;
  rpo_name: string;
  service_type: string;
  total_charge: string;
  updated_at: string;
  user_id: string;
  vas_type: string;
}

export interface TableContentProps {
  data: any;
  loading: boolean;
  error: string | null;
  passportData: PassportDataItem[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setCurrentPage: (value: number) => void;
  setPageSize: (value: number) => void;
}
