// Passport Dashboard Response
export interface PassportDashboardResponse {
    statusCode?: string;
    status?: string;
    message?: string;
    data?: PassportDashboardData;
}

export interface PassportDashboardData {
    totalPassports?: number;
    pendingPassports?: number;
    issuedPassports?: number;
    deliveredPassports?: number;
    // Add other dashboard fields as needed
}

// Passport Issue Data
export interface PassportIssueData {
    passportNo?: string;
    applicantName?: string;
    issueDate?: string;
    deliveryStatus?: string;
    trackingNumber?: string;
    // Add other fields as needed
}

// Regional Passport Office
export interface RegionalPassportOffice {
    officeCode?: string;
    officeName?: string;
    address?: string;
    contactNumber?: string;
}

export interface PassportBookingResponse {
  id: number;
  user_id: string;
  booking_date: string;  
  booking_status: string;
  barcode: string;
  item_id: string;
  post_code: string;//bookin id
  rpo_name: string;
  rpo_address: string;
  service_type: string;
  created_at: string; // ISO date
  updated_at: string; // ISO date
  //   phone: string;
//   vas_type: string;
//   insurance_id: string;
//   insured: "0" | "1";
//   price: string;
//   total_charge: string;
//   push_status: number;
//   is_check_today: number;
//   pending_date: string | null;
//   delivered_date: string | null;
  
}

