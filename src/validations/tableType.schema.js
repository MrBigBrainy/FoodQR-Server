import z from 'zod';

export const tableTypeSchema = z.object({
  nameType: z.string().min(1),
  minSeat: z.number().min(1),
  maxSeat: z.number().min(1),
  storeId: z.number().min(1),
});

export const tableTypeUpdateSchema = tableTypeSchema.partial();
