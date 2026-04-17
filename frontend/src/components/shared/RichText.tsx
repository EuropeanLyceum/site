'use client';

import { Box } from "@mui/material";
import DOMPurify from "dompurify";
import { useMemo } from "react";

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
    <Box
      sx={{
        // 🔹 базова нормалізація HTML
        '& p': { margin: 0 },
        '& strong': { fontWeight: 700 },
        '& em': { fontStyle: 'italic' },

        '& ul': {
          paddingLeft: 20,
          margin: '8px 0',
        },

        '& li': {
          marginBottom: 4,
        },

        '& a': {
          textDecoration: 'underline',
          cursor: 'pointer',
        },

        '& img': {
          maxWidth: '100%',
          borderRadius: 8,
        },

        '& h1, & h2, & h3': {
          margin: '8px 0',
          fontWeight: 800,
        },

        // 🔥 clamp (опціонально)
        ...(clamp && {
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitLineClamp: clamp,
          WebkitBoxOrient: 'vertical',
        }),

        // 🔥 кастомні стилі зверху
        ...sx,
      }}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
