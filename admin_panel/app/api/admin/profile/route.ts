import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Schema for input validation
const updateProfileSchema = z.object({
    currentPassword: z.string().min(1, "Поточний пароль обов'язковий"),
    newPassword: z.string().min(8, "Новий пароль має бути мінімум 8 символів").optional(),
    newUsername: z.string().min(3, "Логін має бути мінімум 3 символи").optional(),
});

// Simple in-memory rate limiter (Use Redis for production)
const rateLimit = new Map<string, { count: number; lastAttempt: number }>();

export async function PATCH(req: Request) {
    try {
        // 1. Verify Session
        const session = await auth();
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(session.user.id);

        // 2. Parse Body
        const body = await req.json();
        const validation = updateProfileSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
        }

        const { currentPassword, newPassword, newUsername } = validation.data;

        // 3. Rate Limiting Check
        const now = Date.now();
        const userLimit = rateLimit.get(session.user.id);
        if (userLimit && userLimit.count > 5 && (now - userLimit.lastAttempt) < 15 * 60 * 1000) {
            return NextResponse.json({ error: "Забагато спроб. Спробуйте через 15 хвилин." }, { status: 429 });
        }

        // 4. Fetch User
        const user = await prisma.adminUser.findUnique({ where: { id: userId } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // 5. Verify Current Password
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            // Update Rate Limit
            const count = (userLimit?.count || 0) + 1;
            rateLimit.set(session.user.id, { count, lastAttempt: now });

            return NextResponse.json({ error: "Неправильний поточний пароль" }, { status: 400 });
        }

        // If we are only verifying credentials (no new data provided)
        if (!newPassword && !newUsername) {
            return NextResponse.json({ success: true, message: "Credentials verified" });
        }

        // 6. Update Logic
        const updateData: any = { updatedAt: new Date() };

        // Handle Username Change
        if (newUsername && newUsername !== user.username) {
            const exists = await prisma.adminUser.findUnique({ where: { username: newUsername } });
            if (exists) return NextResponse.json({ error: "Цей логін вже зайнятий" }, { status: 400 });
            updateData.username = newUsername;
        }

        // Handle Password Change
        if (newPassword) {
            const isSame = await bcrypt.compare(newPassword, user.password);
            if (isSame) return NextResponse.json({ error: "Новий пароль має відрізнятися від старого" }, { status: 400 });
            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        // 7. Execute Update
        await prisma.adminUser.update({
            where: { id: userId },
            data: updateData,
        });

        // Clear rate limit on success
        rateLimit.delete(session.user.id);

        return NextResponse.json({ success: true, message: "Профіль оновлено" });

    } catch (error) {
        console.error("Profile Update Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}