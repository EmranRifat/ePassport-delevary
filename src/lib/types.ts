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
    user_id?: string;
    insurance_id?: string | null;
    rpo_address?: string;
    phone?: string;
    post_code?: string;
    rpo_name?: string;
    barcode?: string;
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