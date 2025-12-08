import {
  addCoupon,
  validateDiscountService,
} from "../service/discount.service.js";

export async function validateDiscount(req, res) {

  try {
    const { discountCode, storeId } = req.body;

    const result = await validateDiscountService({ storeId, discountCode });
    console.log("result", result)

    return res.json({
      status: "success",
      message: "Discount code is valid",
      data: result,
      remainingUses: result.remainingUses,
    });
  } catch (error) {
    console.error("Validate discount error:", error);

    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";

    const response = {
      status: "error",
      message: message,
    };

    if (error.reason) {
      response.reason = error.reason;
    }

    if (error.remainingUses !== undefined) {
      response.remainingUses = error.remainingUses;
    }

    return res.status(statusCode).json(response);
  }
}

export async function createDiscount(req, res) {
  const { code, discountType, amount, maxCount, startTime, endTime } = req.body;
  const storeId = req.user?.storeId;

  if (
    !code ||
    !discountType ||
    amount == null ||
    maxCount == null ||
    !storeId
  ) {
    return res.status(400).json({
      message: "Invalid Discount, missing fields",
    });
  }

  if (!startTime || !endTime) {
    return res
      .status(400)
      .json({ message: "startTime and endTime are required." });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ message: "Invalid date format." });
  }

  if (start.getTime() >= end.getTime()) {
    return res.status(400).json({
      message: "startTime must be before endTime.",
    });
  }

  try {
    const existing = await db
      .select()
      .from(discounts)
      .where(and(eq(discounts.code, code), eq(discounts.storeId, storeId)));

    if (existing.length > 0) {
      return res.status(400).json({
        message: "This coupon code already exists for this store.",
      });
    }
    const discountCoupon = {
      code,
      discountType,
      amount: Number(amount),
      maxCount: maxCount === 0 || maxCount ? Number(maxCount) : null,
      startTime: start,
      endTime: end,
      storeId: Number(storeId),
    };
    const createDiscountCoupon = await addCoupon(discountCoupon);

    return res.status(201).json({
      message: "Create Coupon successfully",
      data: createDiscountCoupon,
    });
  } catch (err) {
    console.error("Error Creating Coupon", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
