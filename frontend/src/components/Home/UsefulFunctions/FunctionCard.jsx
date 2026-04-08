'use client';
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function FunctionCard({ href, image, title, onClick }) {
    const Wrapper = href ? Link : "div";

    return (
        <Box
            onClick={onClick}
            component={Wrapper}
            href={href || undefined}
            sx={{
                position: "relative",
                display: "block",
                height: { xs: 280, md: 350 },
                width: "100%",
                borderRadius: 8,
                overflow: "hidden",
                cursor: "pointer",
                textDecoration: "none",
                zIndex: 1, // Щоб не "провалювалася" під фон
                transition: "0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 20px 40px rgba(12, 24, 101, 0.25)"
                },
                "&:hover .card-img": { transform: "scale(1.1)" }
            }}
        >
            {image && (
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1172px"
                    style={{ objectFit: 'cover', transition: '0.8s' }}
                    className="card-img"
                    priority={title === "virtualTour"} // Пріоритет для головної картки
                />
            )}

            <Box
                className="card-overlay"
                sx={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 2,
                    background: "linear-gradient(to top, rgba(12, 24, 101, 0.9) 0%, transparent 60%)",
                    display: "flex",
                    alignItems: "flex-end",
                    p: { xs: 3, md: 5 },
                }}
            >
                <Typography sx={{
                    color: "#fff",
                    fontSize: { xs: 22, md: 32 },
                    fontWeight: 800,
                    fontFamily: "Montserrat Alternates",
                    lineHeight: 1.2
                }}>
                    {title}
                </Typography>
            </Box>
        </Box>
    );
}