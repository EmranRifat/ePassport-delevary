// API Constants
export const API_CONSTANTS = {
    // Base URLs
    BASE_URL_REMOTE: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://brta2.bpodms.gov.bd',
    BASE_URL_DMS_PROXY: process.env.NEXT_PUBLIC_DMS_API_BASE_URL || 'https://bpodms.ekdak.com',

    // API Endpoints
    LOGIN_URL_LOCAL: '/api/passportoperator-login',
    DMS_LOGIN_URL: 'app_dommail_internal_api/public/ws/login',
    DMS_BOOKING_URL: 'app_dommail_internal_api/public/ws/bookingreq',
    LICENSE_DATA_URL: '/brta/api/bpo/license-delivery-info',

    // User Group
    USER_GROUP: 'POSTAGE_POS',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
    BRANCH_CODE: 'branchCode',
    MY_EMTS_BRANCH_CODE: 'myEmtsBranchCode',
    RMS_CODE: 'rmsCode',
    SHIFT: 'shift',
    CITY_POST_STATUS: 'city_post_status',
    TOKEN: 'token',
    USER_ID: 'user_id',
    USER_PASSWORD: 'user_password',
    DEVICE_IMEI: 'device_imei',
    SEN_NAME: 'sen_name',
    SEN_CONTRACT: 'sen_contact',
    SEN_ADDRESS: 'sen_address',
    USER_NAME: 'user_name',
    BAR_USER_ID: 'bar_user_id',
    BAR_USER_PASS: 'bar_user_pass',
    BARCODE_QTY: 'barcode_qty',
    BARCODE_TYPE: 'barcode_type',
    NAME: 'name',
    EMAIL: 'email',
    LOCAL_TOKEN: 'local_token',
    IS_LOGIN: 'is_login',
} as const;
