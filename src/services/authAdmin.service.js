import { db } from '../../drizzle/db.js';
import { admins } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const registerService = async (data) => {
  const {
    fullName,
    userName,
    phoneNumber,
    password,
    confirmPassword,
    adminCode,
  } = data;

  console.log('ADMIN_SECRET_CODE =', process.env.ADMIN_SECRET_CODE);

  // -------------------- 0) Check confirm password --------------------
  if (!confirmPassword || password !== confirmPassword) {
    throw createHttpError(400, 'รหัสผ่านไม่ตรงกัน');
  }

  // -------------------- 1) Validate admin code -----------------------
  const trimmedAdminCode = adminCode?.trim();
  const expectedAdminCode = process.env.ADMIN_SECRET_CODE?.trim();

  if (!expectedAdminCode) {
    throw createHttpError(500, 'Admin secret code is not configured');
  }

  if (!trimmedAdminCode || trimmedAdminCode !== expectedAdminCode) {
    throw createHttpError(403, 'Invalid admin registration code');
  }

  // -------------------- 2) Check existing username -------------------
  const existingAdmin = await db
    .select()
    .from(admins)
    .where(eq(admins.username, userName));

  if (existingAdmin.length > 0) {
    throw createHttpError(409, 'This username is already taken');
  }

  // -------------------- 3) Hash password -----------------------------
  const passwordHash = await bcrypt.hash(password, 10);

  // -------------------- 4) Insert new admin --------------------------
  const [createdAdmin] = await db.insert(admins).values({
    name: fullName,
    username: userName,
    phoneNumber,
    password: passwordHash,
    role: 'admin',
  });

  if (!createdAdmin) {
    throw createHttpError(500, 'Failed to create admin');
  }

  // -------------------- 5) Remove password before return -------------
  const { password: _, ...safeAdmin } = createdAdmin;

  return safeAdmin;
};

// -------------------- LOGIN -------------------- //
export const loginService = async (data) => {
  const { userName, password } = data;

  // 1) หา user จาก username
  const result = await db
    .select()
    .from(admins)
    .where(eq(admins.username, userName));

  if (result.length === 0) {
    throw createHttpError(401, 'Invalid username or password');
  }

  const admin = result[0];

  // 2) compare password
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw createHttpError(401, 'Invalid username or password');
  }

  // 3) สร้าง JWT token
  const token = jwt.sign(
    {
      id: admin.id,
      role: admin.role,
      username: admin.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    }
  );

  // 4) ไม่คืน password
  const { password: _, ...safeAdmin } = admin;

  return { user: safeAdmin, token };
};
