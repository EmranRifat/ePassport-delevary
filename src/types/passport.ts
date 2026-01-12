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
