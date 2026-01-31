'use client';
import { Box, Container, Grid, Typography, Link as MuiLink, alpha } from "@mui/material";
import Image from "next/image";
import { useTranslation } from "@/contexts/TranslationProvider";

import instagramImage from "@/assets/photos/icons/Instagram-logo.png";
import youTubeImage from "@/assets/photos/icons/YouTube-logo.png";
import facebookImage from "@/assets/photos/icons/Facebook-icon.png";

const Footer = () => {
  const { t } = useTranslation("footer");

  const socialLinks = [
    { img: instagramImage, alt: "Instagram", href: "https://www.instagram.com/european_lyceum_?igsh=OHlpMzNmaWU1bnQx", width: 40 },
    { img: youTubeImage, alt: "YouTube", href: "https://www.youtube.com/c/SolarTVLubny", width: 56 },
    { img: facebookImage, alt: "Facebook", href: "https://www.facebook.com/share/19q3p763W2/?mibextid=wwXIfr", width: 24 }
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
            <Grid item size={{xs: 12, md: 4}}>
              <Typography variant="h6" sx={{
                fontFamily: 'Montserrat Alternates, sans-serif',
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: 20, md: 22 }
              }}>
                {t("followUs")}
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                {socialLinks.map((social, index) => (
                    <MuiLink
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          transition: 'transform 0.3s ease',
                          '&:hover': { transform: 'scale(1.15)' },
                          display: 'flex',
                          alignItems: 'center'
                        }}
                    >
                      <Image
                          src={social.img}
                          alt={social.alt}
                          width={social.width}
                          height={40}
                          style={{ objectFit: 'contain' }}
                      />
                    </MuiLink>
                ))}
              </Box>
            </Grid>

            {/* Адреса */}
            <Grid item size={{xs: 12, sm: 6, md: 4}}>
              <Typography variant="h6" sx={{
                fontFamily: 'Montserrat Alternates, sans-serif',
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: 18, md: 20 }
              }}>
                {t("address")}
              </Typography>
              <Typography sx={{
                fontFamily: 'Montserrat Alternates, sans-serif',
                fontSize: 16,
                lineHeight: 1.6,
                color: alpha('#fff', 0.9)
              }}>
                {t("addressText")}
              </Typography>
            </Grid>

            {/* Контакти */}
            <Grid item size={{xs: 12, sm: 6, md: 4}}>
              <Typography variant="h6" sx={{
                fontFamily: 'Montserrat Alternates, sans-serif',
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: 18, md: 20 }
              }}>
                {t("contacts")}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <MuiLink
                    href="tel:(053)6170838"
                    sx={{
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: 16,
                      transition: '0.2s',
                      '&:hover': { color: alpha('#fff', 0.7) }
                    }}
                >
                  (053) 617 08 38
                </MuiLink>
                <MuiLink
                    href="mailto:schoolsuncity@ukr.net"
                    sx={{
                      color: 'white',
                      textDecoration: 'underline',
                      fontSize: 16,
                      transition: '0.2s',
                      '&:hover': { color: alpha('#fff', 0.7) }
                    }}
                >
                  schoolsuncity@ukr.net
                </MuiLink>
              </Box>
            </Grid>

          </Grid>

          {/* Нижня лінія з копірайтом (опціонально, але додає стилю) */}
          <Box sx={{
            mt: 8,
            pt: 3,
            borderTop: `1px solid ${alpha('#fff', 0.05)}`,
            textAlign: 'center'
          }}>
            <Typography sx={{
              fontSize: 13,
              color: alpha('#fff', 0.5),
              fontFamily: 'Montserrat Alternates, sans-serif'
            }}>
              © {new Date().getFullYear()} {t("lyceumName") || "European Lyceum"}. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
  );
};

export default Footer;