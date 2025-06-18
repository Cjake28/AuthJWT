// src/utils/setTokensCookie.ts
import { Response } from 'express';

export default function setTokensCookie(
  res: Response,
  accessToken: string,
  refreshToken: string
): void {
  const isProd = process.env.NODE_ENV === 'production';
  const commonOpts = {
    httpOnly: true,
    secure:   isProd,
    sameSite: 'none' as const,
    //  add `domain` or `path` here if needed
  };

  // Access token cookie (short‐lived)
  res.cookie('autJwtAToken', accessToken, {
    ...commonOpts,
    maxAge: 1000 * 60 * 60 * 1, // 1 hour
  });

  // Refresh token cookie (longer‐lived)
  res.cookie('authJwtRFToken', refreshToken, {
    ...commonOpts,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
}
