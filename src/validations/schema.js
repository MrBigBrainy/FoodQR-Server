import { z } from 'zod';

const mobileRegex = /^[0-9]{10,15}$/;

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Full name is required'),
    userName: z.string().trim().min(2, 'Username is required'),

    phoneNumber: z
      .string()
      .trim()
      .min(1, 'Phone number is required')
      .refine((value) => mobileRegex.test(value), {
        message: 'Phone number must be 10–15 digits',  
      }),

    password: z
      .string()
      .min(4, 'Password must be at least 4 characters')
      .max(50, 'Password must be at most 50 characters'),

    confirmPassword: z
      .string()
      .min(4, 'Confirm password is required')
      .max(50, 'Confirm password must be at most 50 characters'),

    adminCode: z.string().trim().min(1, 'Admin code is required'),
    storeId: z.coerce.number().int().positive().default(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Confirm password must match password',
    path: ['confirmPassword'],
  });

//loginSchema
export const loginSchema = z.object({
  userName: z.string().trim().min(1, 'Username is required'),

  password: z.string().min(1, 'Password is required'),
});
