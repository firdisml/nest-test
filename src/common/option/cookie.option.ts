import { CookieOptions } from 'express';

export const defaultCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
  domain: 'firdausismail.online',
};

export const refreshTokenCookieOptions: CookieOptions = {
  ...defaultCookieOptions,
  maxAge: 3600000 * 24 * 7,
};

export const accessTokenCookieOptions: CookieOptions = {
  ...defaultCookieOptions,
  maxAge: 3600000,
};
