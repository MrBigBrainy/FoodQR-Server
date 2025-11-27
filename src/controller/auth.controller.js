import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import { db } from "../db/index.js";
import { staff, refreshTokens } from "../db/schema.js";
import { eq, and, gt } from "drizzle-orm";
import { signToken } from "../utils/jwt.js";

export async function login(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) {
        return next(createHttpError(400, "username and password are required"));
    }

    const foundStaff = await db
        .select()
        .from(staff)
        .where(eq(staff.username, username))
        .limit(1);

    const staffMember = foundStaff[0];

    if (!staffMember) {
        next(createHttpError(400, "Invalid credentials"));
        return;
    }

    const existingTokens = await db
        .select()
        .from(refreshTokens)
        .where(
            and(
                eq(refreshTokens.staffId, staffMember.id),
                gt(refreshTokens.expiresAt, new Date())
            )
        );

    if (existingTokens.length > 0) {
        return res
            .status(400)
            .json({ message: "You are already logged in on this device" });
    }
    await prisma.refreshToken.delete({
        where: { id: userToken.id }
    });

    // ---- 3. Check password ----
    const isMatch = await bcrypt.compare(password, staffMember.password);
    if (!isMatch) {
        next(createHttpError(400, "Invalid credentials"));
        return;
    }

    // ---- 4. Generate tokens ----
    const accessToken = signToken({ staffId: staffMember.id });
    const refreshToken = uuidv4();
    const deviceType = req.headers["user-agent"] || "unknown";

    // ---- 5. Insert refresh token for staff ----
    await db.insert(refreshTokens).values({
        token: refreshToken,
        staffId: staffMember.id,
        device: deviceType,
        expiresAt: new Date(Date.now() + 60 * 1000), // 1 minute
    });

    // ---- 6. Set cookie + return access token ----
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days
    });

    res.json({ accessToken });
}
