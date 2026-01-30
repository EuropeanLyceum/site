import { Box, Card, CardActionArea, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function FunctionCard({
                                         href,
                                         image,
                                         title,
                                         onClick,
                                         wide = false,
                                     }) {
    const Wrapper = href ? Link : "div";

    return (
        <Card
            sx={{
                position: "relative",
                height: 331,
                width: wide ? "100%" : 514,
                overflow: "hidden",
                transition: "transform 0.3s ease",
                "&:hover": {
                    transform: "scale(1.02)",
                },
            }}
        >
            <CardActionArea
                component={Wrapper}
                href={href}
                onClick={onClick}
                sx={{ height: "100%" }}
            >
                {/* Image */}
                <Box sx={{ position: "absolute", inset: 0 }}>
                    <Image
                        src={image}
                        alt={title}
                        fill
                        style={{ objectFit: "cover" }}
                    />
                </Box>

                {/* Gradient */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(to top, rgba(24,43,161,1) 0%, rgba(255,255,255,0.1) 100%)",
                        transition: "background 0.3s ease",
                        ".MuiCard-root:hover &": {
                            background:
                                "linear-gradient(to top, rgba(24,43,161,0.9) 0%, rgba(255,255,255,0.05) 100%)",
                        },
                    }}
                />

                {/* Title */}
                <Typography
                    sx={{
                        position: "absolute",
                        bottom: 40,
                        left: "50%",
                        transform: "translateX(-50%)",
                        color: "#fff",
                        fontSize: 24,
                        fontWeight: 500,
                        fontFamily: "'Montserrat Alternates', sans-serif",
                        textAlign: "center",
                        width: "100%",
                        zIndex: 1,
                    }}
                >
                    {title}
                </Typography>
            </CardActionArea>
        </Card>
    );
}