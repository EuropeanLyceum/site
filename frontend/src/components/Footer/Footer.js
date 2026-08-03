'use client';
import { useState, useEffect } from "react";
import { Box, Container, Grid, Typography, Link as MuiLink, alpha } from "@mui/material";
import Image from "next/image";
import { useTranslation } from "@/contexts/TranslationProvider";

// Іконки
import instagramImage from "@/assets/photos/icons/Instagram-logo.png";
import youTubeImage from "@/assets/photos/icons/YouTube-logo.png";
import facebookImage from "@/assets/photos/icons/Facebook-icon.png";
import telegramImage from "@/assets/photos/icons/icons8-telegram-48.png"

const Footer = () => {
    const { t, locale } = useTranslation("footer");
    const [stats, setStats] = useState(null);

    // Отримуємо дані з твоєї API
    useEffect(() => {
        fetch('/admin/api/admin/lyceumStats/1')
            .then(res => res.json())
            .then(data => {
                if (!data.error) setStats(data);
            })
            .catch(err => console.error("Footer fetch error:", err));
    }, []);

    // Мапінг іконок для динамічних посилань з бази
    const iconMap = {
        instagram: { img: instagramImage, width: 40 },
        youtube: { img: youTubeImage, width: 56 },
        facebook: { img: facebookImage, width: 24 }
    };

    // Визначаємо посилання: або з бази, або дефолтні
    const socialLinks = stats?.socialLinks ? Object.entries(stats.socialLinks).map(([key, url]) => ({
        img: iconMap[key.toLowerCase()]?.img || facebookImage,
        alt: key,
        href: url,
        width: iconMap[key.toLowerCase()]?.width || 30
    })) : [
        { img: instagramImage, alt: "Instagram", href: "https://www.instagram.com/european_lyceum_", width: 40 },
        { img: youTubeImage, alt: "YouTube", href: "https://www.youtube.com/c/SolarTVLubny", width: 56 },
        { img: facebookImage, alt: "Facebook", href: "https://www.facebook.com/share/19q3p763W2/", width: 24 },
        { img: telegramImage, alt: "Telegram", href: "https://t.me/european_infobot", width: 56 }
    ];

    return (
        <Box
            component="footer"
            sx={{
                background: '#182BA1',
                color: 'white',
                pt: { xs: 6, md: 8 },
                pb: { xs: 4, md: 6 },
                mt: 'auto',
                borderTop: `1px solid ${alpha('#fff', 0.1)}`
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={{ xs: 5, md: 8 }} justifyContent="space-between">

                    {/* Соціальні мережі */}
                    <Grid item size={{ xs: 12, md: 4 }}>
                        <Typography variant="h6" sx={{ fontFamily: 'Montserrat Alternates, sans-serif', fontWeight: 700, mb: 3, fontSize: { xs: 20, md: 22 } }}>
                            {t("followUs")}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                            {socialLinks.map((social, index) => (
                                <MuiLink
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.15)' }, display: 'flex', alignItems: 'center' }}
                                >
                                    <Image src={social.img} alt={social.alt} width={social.width} height={40} style={{ objectFit: 'contain' }} />
                                </MuiLink>
                            ))}
                        </Box>
                    </Grid>

                    {/* Адреса */}
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography variant="h6" sx={{ fontFamily: 'Montserrat Alternates, sans-serif', fontWeight: 700, mb: 2, fontSize: { xs: 18, md: 20 } }}>
                            {t("address")}
                        </Typography>
                        <Typography>
                            {stats ? (locale === 'uk' ? stats.addressUk : (stats.addressEn || stats.addressUk)) : "..."}
                        </Typography>
                    </Grid>

                    {/* Контакти */}
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography variant="h6" sx={{ fontFamily: 'Montserrat Alternates, sans-serif', fontWeight: 700, mb: 2, fontSize: { xs: 18, md: 20 } }}>
                            {t("contacts")}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <MuiLink
                                href={`tel:${stats?.phone || "(053)6170838"}`}
                                sx={{ color: 'white', textDecoration: 'none', fontSize: 16, '&:hover': { color: alpha('#fff', 0.7) } }}
                            >
                                {stats?.phone}
                            </MuiLink>
                            <MuiLink
                                href={`mailto:${stats?.email || "schoolsuncity@ukr.net"}`}
                                sx={{ color: 'white', textDecoration: 'underline', fontSize: 16, '&:hover': { color: alpha('#fff', 0.7) } }}
                            >
                                {stats?.email}
                            </MuiLink>
                        </Box>
                    </Grid>

                </Grid>

                <Box sx={{ mt: 8, pt: 3, borderTop: `1px solid ${alpha('#fff', 0.05)}`, textAlign: 'center' }}>
                    <Typography>
                        © {new Date().getFullYear()} {stats ? (locale === 'uk' ? stats.name : stats.nameEn) : "..."}.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;