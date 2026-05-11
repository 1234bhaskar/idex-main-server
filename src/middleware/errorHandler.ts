import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendError } from '../utils/apiResponse';

export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export const errorHandler = (
    err: Error | AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (err instanceof AppError) {
        console.warn(`Operational error: ${err.message}`, {
            statusCode: err.statusCode,
        });
        sendError(res, err.message, err.statusCode);
        return;
    }

    console.error('Unexpected error:', {
        message: err.message,
        stack: err.stack,
    });

    sendError(
        res,
        'Internal server error',
        StatusCodes.INTERNAL_SERVER_ERROR,
        'INTERNAL_ERROR',
        err.stack
    );
};

export const notFoundHandler = (_req: Request, res: Response): void => {
    console.warn('Route not found');
    sendError(res, 'Route not found', StatusCodes.NOT_FOUND);
};