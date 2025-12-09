import 'dotenv/config';

export const env = {
  ADMIN_SECRET_CODE: process.env.ADMIN_SECRET_CODE,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
};
