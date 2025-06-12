import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

export function errorHandler(
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Determine status code
  const statusCode =
    err instanceof AppError ? err.statusCode : 500;

  // Determine message
  const message =
    err instanceof AppError && err.isOperational
      ? err.message
      : 'Internal Server Error';

  // Log error details
  console.error('Error Details:', {
    message: err.message,
    stack: err.stack,
    statusCode,
  });

  // Send JSON response
  res.status(statusCode).json({
    success: false,
    message,
  });
}
