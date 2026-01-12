// API Response Types
export interface ApiResponse<T = any> {
    statusCode?: string;
    status?: string;
    data?: T;
    message?: string;
}

export interface ErrorResponse {
    statusCode?: number;
    message?: string;
    errors?: string[];
}
