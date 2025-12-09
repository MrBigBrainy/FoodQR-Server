// server/src/libs/jwt.lib.js

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import createHttpError from 'http-errors';

dotenv.config();

export function signToken(payload, options = {}) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: process.env.JWT_EXPIRES_IN,
    ...options,
  });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
