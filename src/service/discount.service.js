import { db } from "../../drizzle/db.js";
import { menu, category } from "../../drizzle/schema.js";
import { eq } from "drizzle-orm";

export async function validateDiscountService({storeId, code}) {

  try {
    const { code, storeId } = req.body || {};

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        status: "error",
        message: "Discount code is required",
      });
    }

    const normalizedCode = code.trim().toUpperCase();
    const now = new Date();

    // build where condition
    const whereClauses = [eq(discounts.code, normalizedCode), eq(discounts.isActive, true)];

    if (storeId) {
      // optional: ensure discount belongs to this store
      whereClauses.push(eq(discounts.storeId, Number(storeId)));
    }

    const [discount] = await db
      .select()
      .from(discounts)
      .where(and(...whereClauses))
      .limit(1);

    if (!discount) {
      return res.status(404).json({
        status: "error",
        reason: "NOT_FOUND",
        message: "Discount code not found or inactive",
      });
    }

    // ---- time checks ----
    const expiredAt = discount.expiredAt ? new Date(discount.expiredAt) : null;
    const startTime = discount.startTime ? new Date(discount.startTime) : null;
    const endTime = discount.endTime ? new Date(discount.endTime) : null;

    // not started yet
    if (startTime && now < startTime) {
      return res.json({
        status: "error",
        reason: "NOT_STARTED",
        message: "Discount code is not valid yet",
      });
    }

    // ended by endTime
    if (endTime && now > endTime) {
      return res.json({
        status: "error",
        reason: "EXPIRED",
        message: "Discount code has expired",
      });
    }

    // fallback: expiredAt
    if (expiredAt && now > expiredAt) {
      return res.json({
        status: "error",
        reason: "EXPIRED",
        message: "Discount code has expired",
      });
    }

    // ---- count / maxCount checks ----
    let remainingUses = null;
    if (discount.maxCount != null) {
      remainingUses = discount.maxCount - (discount.count ?? 0);
      if (remainingUses <= 0) {
        return res.json({
          status: "error",
          reason: "NO_REMAINING_USES",
          message: "This discount code has been used up",
          remainingUses: 0,
        });
      }
    }

    // ---- if everything passes → SUCCESS ----
    return res.json({
      status: "success",
      message: "Discount code is valid",
      data: {
        id: discount.id,
        code: discount.code,
        discountType: discount.discountType,
        amount: discount.amount,
        storeId: discount.storeId,
        expiredAt: discount.expiredAt,
        maxCount: discount.maxCount,
        count: discount.count,
        startTime: discount.startTime,
        endTime: discount.endTime,
      },
      remainingUses, // null if unlimited
    });
  } catch (err) {
    console.error("Validate discount error:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  } 
}

