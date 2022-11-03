import { CookieOptions } from 'express';

export const isProduction = true;

export const defaultCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
  domain: 'next-auth-lime.vercel.app',
  path: '/',
};

export const refreshTokenCookieOptions: CookieOptions = {
  ...defaultCookieOptions,
  maxAge: 3600000 * 24 * 7,
};

export const accessTokenCookieOptions: CookieOptions = {
  ...defaultCookieOptions,
  maxAge: 3600000,
};
