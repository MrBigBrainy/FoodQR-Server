import { and, eq } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import { discounts } from "../../drizzle/schema.js";
import {
  addCoupon,
  validateDiscountService,
} from "../service/discount.service.js";

export async function validateDiscount(req, res) {

  try {
    const { discountCode, storeId } = req.body;


    const result = await validateDiscountService({ storeId, discountCode });
    console.log("result", result);

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
  const storeId = req.user?.storeId || req.body.storeId;

  if (!code || !discountType || amount == null || maxCount == null) {
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
      result: discountCoupon,
    });
  } catch (err) {
    console.error("Error Creating Coupon", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteDiscount(req, res) {
  const { id } = req.params;
  const storeId = req.user?.storeId || req.body.storeId;

  if (!storeId) {
    return res.status(400).json({ message: "storeId is required " });
  }

  if (!id) {
    return res.status(400).json({ message: "Coupon ID is required" });
  }
  try {
    const result = await db
      .delete(discounts)
      .where(and(eq(discounts.id, Number(id))));

    return res.status(200).json({
      message: "Coupon deleted successfully",
      data: result,
      deletedRows: 1,
    });
  } catch (err) {
    console.error("Error deleting coupon", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getDiscount(req, res) {
  try {
    const storeId = req.user?.storeId || req.body.storeId;

    const result = await db
      .select()
      .from(discounts)
      .where(eq(discounts.storeId, storeId));

    return res.status(200).json({
      message: "discount code fetched successfully",
      data: result,
    });
  } catch (err) {
    console.error("error fetching", err);
    return res.status(500).json({ message: "internal server" });
  }
}

export async function updateDiscount(req, res) {
  const { id } = req.params;

  const {
    code,
    discountType,
    amount,
    maxCount,
    startTime,
    endTime,
    storeId,
    isActive,
  } = req.body;

  if (!storeId) {
    return res.status(400).json({ message: "storeId is required" });
  }

  try {
    const existing = await db
      .select()
      .from(discounts)
      .where(
        and(
          eq(discounts.id, Number(id)),
          eq(discounts.storeId, Number(storeId))
        )
      );

    if (existing.length === 0) {
      return res.status(404).json({ message: "No coupon to be edited" });
    }

    const old = existing[0];

    const validTypes = ["baht", "percent"];
    const safeDiscountType =
      discountType && validTypes.includes(discountType)
        ? discountType
        : old.discountType;

    const updateCoupon = {
      code: code || old.code,
      discountType: safeDiscountType,
      amount: amount ?? old.amount,
      maxCount: maxCount ?? old.maxCount,
      startTime: startTime ? new Date(startTime) : old.startTime,
      endTime: endTime ? new Date(endTime) : old.endTime,
      isActive: isActive !== undefined ? isActive : old.isActive,
    };

    const result = await db
      .update(discounts)
      .set(updateCoupon)
      .where(
        and(
          eq(discounts.id, Number(id)),
          eq(discounts.storeId, Number(storeId)) // ต้อง Number !
        )
      );

    return res.status(200).json({
      message: "Coupon updated successfully",
      updated: updateCoupon,
      dbResult: result,
    });
  } catch (err) {
    // console.error("error updating", err);
    if (err.cause && err.cause.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ message: "รหัสคูปองนี้ถูกใช้งานในร้านค้าอื่นแล้ว (รหัสซ้ำ)" });
    }
    return res.status(500).json({ message: "internal server" });
  }
}
