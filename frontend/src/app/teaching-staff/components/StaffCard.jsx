import { Paper, Box, Typography, alpha, Divider } from "@mui/material";
import Image from "next/image";
import { sanitizeTextWithLineBreaks } from "@/utils/sanitize";

function StaffCard({ staff, locale, t }) {
    const { fullName, description } = locale === "en"
        ? { fullName: staff.fullNameEn || staff.fullName, description: staff.descriptionEn || staff.description }
        : { fullName: staff.fullName, description: staff.description };

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 5,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 3, md: 4 },
                transition: "all 0.3s ease",
                border: "1px solid #E2E8F0",
                background: "#fff",
                height: "100%",
                '&:hover': {
                    transform: "translateY(-5px)",
                    boxShadow: "0 15px 40px rgba(24, 43, 161, 0.08)",
                    borderColor: alpha("#182BA1", 0.2)
                }
            }}
        >
            {/* Фото секція */}
            <Box
                sx={{
                    width: { xs: "100%", sm: 180, md: 220 },
                    height: { xs: 240, sm: 240, md: 280 },
                    flexShrink: 0,
                    borderRadius: 4,
                    overflow: "hidden",
                    position: "relative",
                    bgcolor: "#F1F5F9"
                }}
            >
                {staff.photoUrl ? (
                    <Image
                        src={staff.photoUrl}
                        alt={fullName}
                        fill
                        style={{ objectFit: "cover", objectPosition: "center top" }}
                    />
                ) : (
                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                        <Typography variant="caption">{t("photoMissing")}</Typography>
                    </Box>
                )}
            </Box>

            {/* Текстова секція */}
            <Box sx={{ flex: 1, py: 1 }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 800,
                        color: "#1e293b",
                        mb: 2,
                        fontSize: { xs: 20, md: 24 },
                        fontFamily: "'Montserrat Alternates', sans-serif",
                        lineHeight: 1.2
                    }}
                >
                    {fullName}
                </Typography>

                <Divider sx={{ mb: 2, width: 40, height: 3, bgcolor: '#182BA1', borderRadius: 1 }} />

                <Box
                    sx={{
                        color: "#475569",
                        fontSize: { xs: 14, md: 15 },
                        lineHeight: 1.6,
                        textAlign: "justify",
                        "& p": { m: 0 }
                    }}
                    dangerouslySetInnerHTML={{ __html: sanitizeTextWithLineBreaks(description) }}
                />
            </Box>
        </Paper>
    );
}

export default StaffCard;