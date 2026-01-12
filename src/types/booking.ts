// Booking Body Type
export interface BookingBody {
    branchCode?: string;
    myEmtsBranchCode?: string;
    rmsCode?: string;
    shift?: string;
    trackingNumber?: string;
    userId?: string;
    userPassword?: string;
    deviceImei?: string;
}

// Booking Response Type
export interface BookingResponse {
    statusCode?: string;
    status?: string;
    message?: string;
    data?: BookingData;
}

export interface BookingData {
    trackingNumber?: string;
    branchCode?: string;
    bookingDate?: string;
    // Add other booking data fields as needed
}
