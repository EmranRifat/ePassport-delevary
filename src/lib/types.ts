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
