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
        // Перевірка на наявність вікна для безпечного SSR
        if (typeof window !== "undefined") {
            return DOMPurify.sanitize(html);
        }
        return html;
    }, [html]);

    return (
        <Box
            sx={{
                width: '100%',
                // Запобігаємо виходу тексту за межі контейнера
                overflowWrap: 'anywhere',
                wordBreak: 'normal',
                whiteSpace: 'normal',
                hyphens: 'auto', // Робить переноси слів за правилами мови (якщо підтримується)

                // Стилізація контенту всередині HTML
                '& p': {
                    margin: 0,
                    mb: 1.5,
                    lineHeight: 1.6,
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
                    '&:hover': { opacity: 0.8 },
                },

                // Ефект обрізання тексту (Line Clamp)
                ...(clamp ? {
                    display: '-webkit-box',
                    WebkitLineClamp: clamp,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                } : {}),

                // Прокидаємо зовнішні стилі (sx) в самий кінець, щоб вони мали пріоритет
                ...sx,
            }}
            dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
    );
}