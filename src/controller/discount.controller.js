import { validateDiscountService } from "../service/discount.service.js";

export async function validateDiscount(req, res) {
  try {
    const { code, storeId } = req.body;

    const result = await validateDiscountService({ storeId, code });

    return res.json({
      status: "success",
      message: "Discount code is valid",
      data: result,
      remainingUses: result.remainingUses
    });
  } catch (error) {
    console.error("Validate discount error:", error);
    
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";
    
    const response = {
      status: "error",
      message: message
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
