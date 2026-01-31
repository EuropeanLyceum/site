import { Paper, Box, Typography } from "@mui/material";
import Image from "next/image";
import { sanitizeTextWithLineBreaks } from "@/utils/sanitize";

function StaffCard({ staff, locale, t }) {
    // Локалізація контенту
    const { fullName, description } =
        locale === "en"
            ? { fullName: staff.fullNameEn || staff.fullName, description: staff.descriptionEn || staff.description }
            : { fullName: staff.fullName, description: staff.description };

    return (
        <Paper
            elevation={6}
            sx={{
                m: 2,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                padding: 3,
                borderRadius: 3,
                minHeight: 250,
                gap: 3,
                position: "relative",
                overflow: "hidden",
                background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
            }}
        >
            {/* Фото */}
            <Box
                className="ImageContainerProfile"
                sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    backgroundColor: "#f8f9fa",
                    flexShrink: 0,
                    width: { xs: "100%", md: 220 },
                    height: { xs: 250, md: 310 },
                    position: "relative",
                }}
            >
                {staff.photoUrl ? (
                    <Image
                        src={staff.photoUrl}
                        alt={fullName}
                        fill
                        className="ImageProfile"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                ) : (
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#666",
                            fontSize: 14,
                            textAlign: "center",
                            p: 1,
                        }}
                    >
                        {t("photoMissing")}
                    </Box>
                )}
            </Box>

            {/* Інформація */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    position: "relative",
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                        textAlign: { xs: "center", md: "left" },
                        color: "#1e293b",
                    }}
                >
                    {fullName}
                </Typography>

                <Box
                    sx={{
                        "& p": {
                            fontWeight: 500,
                            fontSize: 15,
                            lineHeight: 1.6,
                            color: "#374151",
                            textAlign: "justify",
                            hyphens: "auto",
                        },
                    }}
                    dangerouslySetInnerHTML={{ __html: sanitizeTextWithLineBreaks(description) }}
                />
            </Box>
        </Paper>
    );
}

export default StaffCard;
