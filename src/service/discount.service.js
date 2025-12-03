import { db } from "../../drizzle/db.js";
import { discounts } from "../../drizzle/schema.js";
import { eq, and } from "drizzle-orm";

export async function validateDiscountService({storeId, discountCode}) {
  if (!discountCode || typeof discountCode !== "string") {
    const error = new Error("Discount Code is required");
    error.statusCode = 400;
    throw error;
  }

  if (!storeId) {
    const error = new Error("Store ID is required");
    error.statusCode = 400;
    throw error;
  }

  const normalizedCode = discountCode.trim().toUpperCase();
  const now = new Date();

  const whereClauses = [
    eq(discounts.code, normalizedCode),
    eq(discounts.isActive, true),
    eq(discounts.storeId, Number(storeId)),
  ];

  const [discount] = await db
    .select()
    .from(discounts)
    .where(and(...whereClauses))
    .limit(1);

  if (!discount) {
    const error = new Error("Discount code not found or inactive");
    error.statusCode = 404;
    error.reason = "NOT_FOUND";
    throw error;
  }

  const startTime = discount.startTime ? new Date(discount.startTime) : null;
  const endTime = discount.endTime ? new Date(discount.endTime) : null;

  if (startTime && now < startTime) {
    const error = new Error("Discount code is not valid yet");
    error.statusCode = 400;
    error.reason = "NOT_STARTED";
    throw error;
  }

  if (endTime && now > endTime) {
    const error = new Error("Discount code has expired");
    error.statusCode = 400;
    error.reason = "EXPIRED";
    throw error;
  }

  let remainingUses = null;
  if (discount.maxCount != null) {
    remainingUses = discount.maxCount - (discount.count ?? 0);
    if (remainingUses <= 0) {
      const error = new Error("This discount code has been used up");
      error.statusCode = 400;
      error.reason = "NO_REMAINING_USES";
      error.remainingUses = 0;
      throw error;
    }
  }

  return {
    id: discount.id,
    discountCode: discount.code,
    discountType: discount.discountType,
    amount: discount.amount,
    storeId: discount.storeId,
    maxCount: discount.maxCount,
    count: discount.count,
    startTime: discount.startTime,
    endTime: discount.endTime,
    remainingUses,
  };
}

export async function addCoupon({
  code,
  discountType,
  amount,
  maxCount,
  startTime,
  endTime,
  storeId,
}) {
  try {
    const [newCoupon] = await db.insert(discounts).values({
      code,
      discountType,
      amount,
      maxCount,
      startTime,
      endTime,
      storeId,
    });
    return newCoupon;
  } catch (error) {
    console.log(error);
  }
}
