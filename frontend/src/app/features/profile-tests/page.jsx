"use client";

import {Box, Container} from "@mui/material";
import ProfileTests from "@/components/Home/ProfileTests/ProfileTests.js";

/**
 * Сторінка профільного тестування.
 * Використовує динамічний компонент ProfileTests, який завантажує дані з Prisma API.
 */
export default function ProfileTestsPage() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#F8FAFC", // Світлий сучасний фон (відповідає дизайну тесту)
                display: "flex",
                flexDirection: "column",
                width: "100%",
            }}
        >
            {/* Сам компонент тесту */}
            <ProfileTests/>
        </Box>
    );
}