import { AxiosError } from 'axios';
import { ErrorResponse } from '@/types';

export class ApiError extends Error {
    statusCode?: number;
    errors?: string[];

    constructor(message: string, statusCode?: number, errors?: string[]) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.errors = errors;
    }
}

export const handleApiError = (error: unknown): ApiError => {
    if (error instanceof AxiosError) {
        const response = error.response;
        const data = response?.data as ErrorResponse;

        return new ApiError(
            data?.message || error.message || 'An error occurred',
            response?.status || 500,
            data?.errors
        );
    }

    if (error instanceof Error) {
        return new ApiError(error.message);
    }

    return new ApiError('An unknown error occurred');
};

export const getErrorMessage = (error: unknown): string => {
    const apiError = handleApiError(error);
    return apiError.message;
};
