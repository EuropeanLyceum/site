'use client';

import { ReactNode } from "react";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";


export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
            {/* Бокова панель (фіксована ширина) */}
            <Sidebar />

            {/* Основна область контенту */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Верхня панель */}
                <Header />

                {/* Контент сторінки */}
                <Box
                    component="main"
                    sx={{
                        p: { xs: 2, md: 4 },
                        flexGrow: 1,
                        // Додаємо плавний перехід для адаптивності
                        transition: 'margin 0.2s ease-in-out'
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}