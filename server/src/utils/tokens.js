import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const generateAccessToken = (id) =>
  jwt.sign({ id }, config.jwt.secret, { expiresIn: config.jwt.expire });

export const generateRefreshToken = (id) =>
  jwt.sign({ id }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpire });

export const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProd = config.env === 'production';
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearTokenCookies = (res) => {
  res.cookie('accessToken', '', { httpOnly: true, expires: new Date(0) });
  res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
};
