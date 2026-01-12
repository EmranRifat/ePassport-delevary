// Login Response Type
export interface LoginResponse {
    status_code?: string;
    status?: string;
    message?: string;
    name?: string;
    user_id?: string;
    user_password?: string;
    user_group?: string;
    hnddevice?: string;
    email?: string;
    bar_user_id?: string;
    bar_user_pass?: string;
    barcode_qty?: string;
    barcode_type?: string;
    created_at?: string;
    updated_at?: string;
    token?: string;
    // Legacy fields for backward compatibility
    branchCode?: string;
    myEmtsBranchCode?: string;
    rmsCode?: string;
    shift?: string;
    cityPostStatus?: string;
}

// Login Request Type
export interface LoginRequest {
    email: string;
    password: string;
    role_id: string;
    deviceImei?: string;
}

// DMS Login Request Type
export interface DmsLoginRequest {
    user_id: string;
    password: string;
    user_group: string;
    hnddevice: string;
}

// DMS Login Response Type
export interface DmsLoginResponse {
    status_code: string;
    status: string;
    branch_code?: string;
    my_emts_branch_code?: string;
    rms_code?: string;
    shift?: string;
    city_post_status?: string;
    token: string;
}
