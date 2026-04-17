'use client';

import { Box, SxProps, Theme } from "@mui/material";
import DOMPurify from "dompurify";
import React, { useMemo } from "react";

interface RichTextProps {
    html?: string;
    sx?: SxProps<Theme>;
    clamp?: number;
}

export default function RichText({ html = "", sx = {}, clamp }: RichTextProps) {
    const safeHtml = useMemo(() => {
        if (typeof window !== "undefined") {
            return DOMPurify.sanitize(html);
        }
        return html;
    }, [html]);

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '100%',

                // 🔹 ПРАВИЛЬНЕ РІШЕННЯ ДЛЯ ПЕРЕНОСІВ:
                whiteSpace: 'normal',
                wordBreak: 'normal',         // Стандартні правила (слова не розриваються посередині без потреби)
                overflowWrap: 'break-word',  // Розриває довге слово/URL ТІЛЬКИ якщо воно не влазить у ширину екрана
                hyphens: 'none',             // Можна змінити на 'auto', якщо хочете граматичні переноси по складах (потребує <html lang="uk">)

                '& p': {
                    margin: 0,
                    mb: 1.5,
                    lineHeight: 1.6,
                    textAlign: 'left',
                },
                '& p:last-child': { mb: 0 },

                '& ul, & ol': {
                    ml: 0,
                    pl: 3,
                    mb: 2,
                },

                '& li': {
                    mb: 0.5,
                },

                '& img': {
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 2,
                    display: 'block',
                    my: 2,
                },

                '& a': {
                    color: 'inherit',
                    textDecoration: 'underline',
                    // Робимо так, щоб довгі лінки точно ламалися і не псували верстку
                    wordBreak: 'break-word',
                    '&:hover': { opacity: 0.8 },
                },

                // Ефект обрізання тексту (Line Clamp)
                ...(clamp && {
                    display: '-webkit-box',
                    WebkitLineClamp: clamp,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    // Залишаємо базові правила для обрізаного тексту
                    whiteSpace: 'normal',
                }),

                // Зовнішні стилі
                ...sx,
            }}
            dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
    );
}