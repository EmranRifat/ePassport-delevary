// License Data Body Type
export interface LicenseDataBody {
    licenseNo?: string;
    nid?: string;
    mobile?: string;
}

// License Data Response Type
export interface LicenseDataResponse {
    statusCode?: string;
    status?: string;
    message?: string;
    data?: LicenseData;
}

export interface LicenseData {
    licenseNo?: string;
    name?: string;
    nid?: string;
    mobile?: string;
    address?: string;
    issueDate?: string;
    expiryDate?: string;
    // Add other license fields as needed
}

// License Issue Response
export interface LicenseIssueResponse {
    statusCode?: string;
    status?: string;
    message?: string;
    data?: LicenseIssueData;
}

export interface LicenseIssueData {
    licenseNo?: string;
    issueDate?: string;
    deliveryStatus?: string;
    // Add other fields as needed
}
