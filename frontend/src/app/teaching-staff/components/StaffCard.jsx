import { Paper, Box, Typography, alpha, Divider, Chip, Stack, Link } from "@mui/material";
import Image from "next/image";
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import SchoolIcon from '@mui/icons-material/School';
import { sanitizeTextWithLineBreaks } from "@/utils/sanitize";

export default function StaffCard({ staff, locale, t }) {
    const isEn = locale === "en";

    // Мапінг усіх полів з Prisma
    const fullName = isEn ? staff.fullNameEn : staff.fullNameUk;
    const position = isEn ? staff.positionEn : staff.positionUk;
    const description = isEn ? staff.descriptionEn : staff.descriptionUk;
    const specialization = isEn ? staff.specializationEn : staff.specializationUk;

    return (
        <Paper elevation={0} sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 6,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 3, md: 4 },
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            border: "1px solid #E2E8F0",
            background: "#fff",
            height: "100%",
            width: "100%",
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
                transform: "translateY(-8px)",
                boxShadow: "0 20px 40px rgba(24, 43, 161, 0.12)",
                borderColor: alpha("#182BA1", 0.3),
                '& .staff-image': { transform: 'scale(1.05)' }
            }
        }}>
            {/* Фото секція з бейджем спеціалізації */}
            <Box sx={{
                width: { xs: "100%", sm: 200, md: 240 },
                height: { xs: 280, sm: "auto" },
                minHeight: { sm: 280 },
                flexShrink: 0,
                borderRadius: 5,
                overflow: "hidden",
                position: "relative",
                bgcolor: "#F1F5F9"
            }}>
                {staff.photo ? (
                    <Image
                        src={staff.photo}
                        alt={fullName}
                        fill
                        className="staff-image"
                        style={{ objectFit: "cover", objectPosition: "center top", transition: '0.6s' }}
                    />
                ) : (
                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                        <SchoolIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                    </Box>
                )}
            </Box>

            {/* Контентна секція */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" sx={{
                        fontWeight: 900,
                        color: "#0c1865",
                        mb: 0.5,
                        fontSize: { xs: 22, md: 26 },
                        fontFamily: "'Montserrat Alternates', sans-serif"
                    }}>
                        {fullName}
                    </Typography>

                    <Typography sx={{
                        color: "#f97316",
                        fontWeight: 800,
                        fontSize: 13,
                        textTransform: 'uppercase',
                        letterSpacing: 1
                    }}>
                        {position}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 2, width: 60, height: 4, bgcolor: '#182BA1', borderRadius: 2, border: 'none' }} />

                {/* Спеціалізація (якщо є) */}
                {specialization && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Chip
                            label={specialization}
                            size="small"
                            sx={{
                                bgcolor: alpha('#182BA1', 0.05),
                                color: '#182BA1',
                                fontWeight: 700,
                                borderRadius: 1.5,
                                fontSize: 12
                            }}
                        />
                    </Box>
                )}

                {/* Опис (через санітайзер) */}
                <Box
                    sx={{
                        color: "#475569",
                        fontSize: { xs: 14, md: 15 },
                        lineHeight: 1.7,
                        flexGrow: 1,
                        "& p": { m: 0, mb: 1.5 }
                    }}
                    dangerouslySetInnerHTML={{ __html: sanitizeTextWithLineBreaks(description) }}
                />

                {/* Контакти (Email та Phone) */}
                <Stack
                    direction={{ xs: 'column', lg: 'row' }}
                    spacing={2}
                    sx={{
                        mt: 2,
                        pt: 2,
                        borderTop: `1px dashed ${alpha('#182BA1', 0.1)}`
                    }}
                >
                    {staff.email && (
                        <Link
                            href={`mailto:${staff.email}`}
                            sx={{
                                display: 'flex', alignItems: 'center', gap: 1,
                                color: '#182BA1', textDecoration: 'none',
                                fontSize: 14, fontWeight: 600,
                                '&:hover': { color: '#f97316' }
                            }}
                        >
                            <EmailIcon sx={{ fontSize: 18 }} />
                            {staff.email}
                        </Link>
                    )}
                    {staff.phone && (
                        <Link
                            href={`tel:${staff.phone}`}
                            sx={{
                                display: 'flex', alignItems: 'center', gap: 1,
                                color: '#182BA1', textDecoration: 'none',
                                fontSize: 14, fontWeight: 600,
                                '&:hover': { color: '#f97316' }
                            }}
                        >
                            <LocalPhoneIcon sx={{ fontSize: 18 }} />
                            {staff.phone}
                        </Link>
                    )}
                </Stack>
            </Box>
        </Paper>
    );
}