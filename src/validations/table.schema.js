import z from 'zod';

export const tableSchema = z.object({
  tableName: z.string().min(1),
  zoneId: z.number().optional(),
  tableTypeId: z.number(),
  storeId: z.number(),
});

export const tableUpdateSchema = tableSchema.partial();
