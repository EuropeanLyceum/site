'use client';

import {Box} from "@mui/material";
import DOMPurify from "dompurify";
import {useMemo} from "react";

export default function RichText({
                                     html = "",
                                     sx = {},
                                     clamp,
                                 }: {
    html?: string;
    sx?: any;
    clamp?: number;
}) {
    const safeHtml = useMemo(() => {
        if (typeof window !== "undefined") {
            return DOMPurify.sanitize(html);
        }
        return html; // Повертаємо як є для SSR, DOMPurify очистить на клієнті
    }, [html]);

    return (
        <Box>
            <Box
                sx={{
                    // 🔹 ГОЛОВНІ ПРАВИЛА ДЛЯ ПЕРЕНОСУ ТЕКСТУ
                    width: '100%',
                    maxWidth: '100%',
                    whiteSpace: 'normal',        // Скасовуємо pre-wrap, який ламав верстку
                    overflowWrap: 'break-word',  // Примусово переносимо довгі слова
                    wordBreak: 'break-word',     // Додатковий захист для старих браузерів

                    // 🔹 Стилізація внутрішніх тегів
                    '& p': {
                        margin: 0,
                        marginBottom: '0.8rem', // Додаємо відступ між абзацами для читабельності
                    },
                    '& p:last-child': {marginBottom: 0},

                    '& strong': {fontWeight: 700},
                    '& em': {fontStyle: 'italic'},

                    '& ul': {
                        paddingLeft: 20,
                        margin: '8px 0',
                    },

                    '& li': {
                        marginBottom: 4,
                    },

                    '& img': {
                        maxWidth: '100%',
                        height: 'auto', // Щоб картинки не розтягувалися
                        borderRadius: 8,
                    },

                    // 🔥 clamp (обрізання тексту)
                    ...(clamp && {
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitLineClamp: clamp,
                        WebkitBoxOrient: 'vertical',
                    }),

                    // 🔥 кастомні стилі, які приходять через пропси
                    ...sx,
                }}
                dangerouslySetInnerHTML={{__html: safeHtml}}
            />
        </Box>
    );
}
