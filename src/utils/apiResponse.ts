import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export interface IApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    stack?: string;
}

export const sendSuccess = <T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = StatusCodes.OK
): void => {
    const response: IApiResponse<T> = {
        success: true,
        message,
        data,
    };
    res.status(statusCode).json(response);
};

export const sendError = (
    res: Response,
    message: string,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    error?: string,
    stack?: string
): void => {
    const response: IApiResponse = {
        success: false,
        message,
        error,
        ...(process.env.NODE_ENV === 'development' && { stack }),
    };
    res.status(statusCode).json(response);
};

export const sendNotFound = (res: Response, message: string = 'Resource not found'): void => {
    sendError(res, message, StatusCodes.NOT_FOUND);
};

export const sendUnauthorized = (res: Response, message: string = 'Unauthorized'): void => {
    sendError(res, message, StatusCodes.UNAUTHORIZED);
};

export const sendForbidden = (res: Response, message: string = 'Forbidden'): void => {
    sendError(res, message, StatusCodes.FORBIDDEN);
};

export const sendValidationError = (res: Response, message: string = 'Validation failed'): void => {
    sendError(res, message, StatusCodes.BAD_REQUEST);
};