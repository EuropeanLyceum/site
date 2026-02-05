'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AppBar, Toolbar, Container, Box, Typography,
  IconButton, Drawer, List, ListItem, ListItemButton,
  ListItemText, Collapse, alpha, useTheme, useMediaQuery,
  Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import headerLogo from "../../assets/photos/icons/header_lyceum_logo.png";
import ukrIcon from "../../assets/photos/icons/ukr_lang_change.png";
import engIcon from "../../assets/photos/icons/eng_lang_change.png";
import { useTranslation } from "@/contexts/TranslationProvider";

const Header = () => {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState({});

  const { t, locale, changeLanguage } = useTranslation("header");
  const theme = useTheme();
  // Перемикаємо на мобільне меню на 1150px, бо пунктів дуже багато
  const isMobile = useMediaQuery('(max-width:1150px)');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderHidden(true);
      } else if (currentScrollY < lastScrollY) {
        setIsHeaderHidden(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const toggleMobileSubmenu = (key) => {
    setOpenMobileSubmenu(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Повна структура навігації
  const navStructure = [
    {
      title: t("aboutLyceum"),
      sub: [
        { label: t("ourCard"), href: "/about-lyceum/visiting-card" },
        { label: t("history"), href: "/about-lyceum/history" },
        { label: t("innovation"), href: "/about-lyceum/innovative" }
      ]
    },
    { title: t("news"), href: "/news" },
    { title: t("teachingStaff"), href: "/teaching-staff" },
    {
      title: t("transparency"),
      sub: [
        { label: t("regulatoryDocuments"), href: "/transparency-managment/regulatory-documents" },
        { label: t("financialReports"), href: "/transparency-managment/financial-reports" },
        { label: t("publicInformation"), href: "/transparency-managment/public-information" }
      ]
    },
    {
      title: t("educationalProcess"),
      sub: [
        { label: t("intellectAndTalent"), href: "/educational-process/intellect" },
        { label: t("studentSelfGovernment"), href: "/educational-process/student-self-government" },
        { label: t("projectResearch"), href: "/educational-process/project-research" },
        { label: t("patrioticEducation"), href: "/educational-process/patriotic-education" },
        { label: t("evaluationCriteria"), href: "/educational-process/evaluation-criteria" },
        { label: t("clubsAndStudios"), href: "/educational-process/clubs-studios" },
        { label: t("sportLife"), href: "/educational-process/sportlife" },
        { label: t("psychologicalSupport"), href: "/educational-process/psychological-support" },
        { label: t("antiBullying"), href: "/educational-process/anti-bullying" }
      ]
    },
    {
      title: t("methodicalWork"),
      sub: [
        { label: t("teacherHelp"), href: "/methodical-work/teacher-support" },
        { label: t("qualificationImprovement"), href: "/methodical-work/qualification-improvement" },
        { label: t("teacherCertification"), href: "/methodical-work/teacher-certification" },
        { label: t("methodicalEvents"), href: "/methodical-work/methodical-events" }
      ]
    },
    {
      title: t("informationPage"),
      sub: [
        { label: t("parents"), href: "/information-page/parents" },
        { label: t("students"), href: "/information-page/students" }
      ]
    },
    {
      title: t("other"),
      sub: [
        { label: t("malikLiterarySite"), href: "http://malyk.ho.ua/", external: true },
        { label: t("lubensCityCouncil"), href: "https://lubnyrada.gov.ua/", external: true },
        { label: t("ministryEducation"), href: "https://www.mon.gov.ua/", external: true },
        { label: t("ukrainianCenterEducation"), href: "https://testportal.gov.ua", external: true },
        { label: t("kharkivRegionalCenter"), href: "https://zno-kharkiv.org.ua/", external: true }
      ]
    }
  ];

  return (
      <>
        <AppBar
            position="fixed"
            sx={{
              background: '#182ba1',
              boxShadow: '0 2px 15px rgba(0,0,0,0.2)',
              transition: 'transform 0.4s ease',
              transform: isHeaderHidden ? 'translateY(-100%)' : 'translateY(0)',
              height: { xs: 70, lg: 80 },
              justifyContent: 'center',
              zIndex: 1201
            }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ justifyContent: 'space-between', px: '0 !important' }}>

              {/* Логотип */}
              <Box
                  component={Link}
                  href="/"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' }
                  }}
              >
                <Box sx={{
                  width: { xs: 40, sm: 45, lg: 52 }, // Менший розмір для зовсім малих екранів
                  height: { xs: 40, sm: 45, lg: 52 },
                  position: 'relative', // Важливо для layout="fill" або якісного scaling
                }}>
                  <Image
                      src={headerLogo}
                      alt="Lyceum Logo"
                      fill // Використовуємо fill для кращого контролю контейнером
                      style={{ objectFit: 'contain' }}
                      priority
                  />
                </Box>
              </Box>

              {/* Desktop Навігація */}
              {!isMobile && (
                  <Box sx={{ display: 'flex', gap: { lg: 3, xl: 5 }, alignItems: 'center', mx: 2 }}>
                    {navStructure.map((item, idx) => (
                        <Box
                            key={idx}
                            sx={{
                              position: 'relative',
                              py: 3,
                              '&:hover .dropdown-box': { display: 'block', opacity: 1, transform: 'translateY(0)' }
                            }}
                        >
                          <Typography
                              component={item.href ? Link : 'div'}
                              href={item.href || '#'}
                              sx={{
                                color: '#fff',
                                textDecoration: 'none',
                                fontSize: { lg: '15px', xl: '20px' },
                                fontWeight: 500,
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: '0.2s',
                                '&:hover': { color: alpha('#fff', 0.8) }
                              }}
                          >
                            {item.title}
                          </Typography>

                          {item.sub && (
                              <Box
                                  className="dropdown-box"
                                  sx={{
                                    display: 'none',
                                    position: 'absolute',
                                    top: '80%',
                                    // Якщо це один з останніх двох пунктів, притискаємо до правого краю
                                    ...(idx >= navStructure.length - 2 ? {
                                      right: 0,
                                      left: 'auto',
                                      transform: 'translateY(10px)',
                                    } : {
                                      left: '30%',
                                      transform: 'translateX(-50%) translateY(10px)',
                                    }),
                                    background: '#fff',
                                    minWidth: 250,
                                    borderRadius: 2,
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                                    py: 1,
                                    zIndex: 100,
                                    transition: '0.3s opacity ease, 0.3s transform ease',
                                    // Додаємо невидимий "місток", щоб мишка не втрачала фокус при переході
                                    '&::before': {
                                      content: '""',
                                      position: 'absolute',
                                      top: -20,
                                      left: 0,
                                      right: 0,
                                      height: 20,
                                    }
                                  }}
                              >
                                {item.sub.map((subItem, sIdx) => (
                                    <Box
                                        key={sIdx}
                                        component={Link}
                                        href={subItem.href}
                                        target={subItem.external ? "_blank" : "_self"}
                                        sx={{
                                          display: 'block',
                                          px: 3,
                                          py: 1.2,
                                          color: '#182ba1',
                                          textDecoration: 'none',
                                          fontSize: '14px',
                                          fontWeight: 500,
                                          whiteSpace: 'nowrap', // Щоб текст не переносився
                                          '&:hover': { background: '#f8f9fa', color: '#f97316' }
                                        }}
                                    >
                                      {subItem.label}
                                    </Box>
                                ))}
                              </Box>
                          )}
                        </Box>
                    ))}
                  </Box>
              )}

              {/* Перемикач мови та Бургер */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 2 } }}>

                {/* Перемикач мови як інтерактивна кнопка */}
                <IconButton
                    onClick={() => changeLanguage(locale === "uk" ? "en" : "uk")}
                    sx={{
                      p: 0.5,
                      borderRadius: 2,
                      bgcolor: alpha('#fff', 0.1),
                      '&:hover': { bgcolor: alpha('#fff', 0.2) },
                      width: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                    }}
                >
                  <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Image
                        src={locale === "uk" ? engIcon : ukrIcon}
                        alt="Change Language"
                        fill
                        style={{ objectFit: 'contain', padding: '2px' }}
                    />
                  </Box>
                </IconButton>

                {isMobile && (
                    <IconButton
                        onClick={handleDrawerToggle}
                        sx={{
                          color: '#fff',
                          ml: { xs: 0, sm: 1 },
                          p: { xs: 0.5, sm: 1 }
                        }}
                    >
                      <MenuIcon sx={{ fontSize: { xs: 30, sm: 35 } }} />
                    </IconButton>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Мобільне меню (Drawer) */}
        <Drawer
            anchor="right"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            PaperProps={{
              sx: { width: '85%', maxWidth: 360, background: '#182ba1', color: '#fff' }
            }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={handleDrawerToggle} sx={{ color: '#fff' }}>
              <CloseIcon fontSize="large" />
            </IconButton>
          </Box>

          <List sx={{ pt: 0, px: 2 }}>
            {navStructure.map((item, idx) => (
                <Box key={idx} sx={{ mb: 0.5 }}>
                  <ListItem disablePadding>
                    <ListItemButton
                        component={item.href ? Link : 'div'}
                        href={item.href}
                        onClick={item.sub ? () => toggleMobileSubmenu(idx) : handleDrawerToggle}
                        sx={{ borderRadius: 2, py: 1.5 }}
                    >
                      <ListItemText
                          primary={item.title}
                          primaryTypographyProps={{ fontSize: '16px', fontWeight: 600 }}
                      />
                      {item.sub && (openMobileSubmenu[idx] ? <ExpandLess /> : <ExpandMore />)}
                    </ListItemButton>
                  </ListItem>

                  {item.sub && (
                      <Collapse in={openMobileSubmenu[idx]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding sx={{ background: alpha('#fff', 0.05), borderRadius: 2, mt: 0.5 }}>
                          {item.sub.map((subItem, sIdx) => (
                              <ListItemButton
                                  key={sIdx}
                                  component={Link}
                                  href={subItem.href}
                                  target={subItem.external ? "_blank" : "_self"}
                                  onClick={handleDrawerToggle}
                                  sx={{ pl: 4, py: 1 }}
                              >
                                <ListItemText
                                    primary={subItem.label}
                                    primaryTypographyProps={{ fontSize: '14px', opacity: 0.9 }}
                                />
                              </ListItemButton>
                          ))}
                        </List>
                      </Collapse>
                  )}
                  <Divider sx={{ borderColor: alpha('#fff', 0.1), my: 0.5 }} />
                </Box>
            ))}
          </List>
        </Drawer>
        {/* Spacer щоб контент не заїжджав під хедер */}
        <Box sx={{ height: { xs: 70, lg: 80 } }} />
      </>
  );
};

export default Header;