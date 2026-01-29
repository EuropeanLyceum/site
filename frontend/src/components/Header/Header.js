"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";

import headerLogo from "../../assets/photos/icons/header_lyceum_logo.png";
import ukrIcon from "../../assets/photos/icons/ukr_lang_change.png";
import engIcon from "../../assets/photos/icons/eng_lang_change.png";
import styles from "../../styles/HeaderFooter.module.css";
import { useTranslation } from "@/contexts/TranslationProvider";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { t, locale, changeLanguage } = useTranslation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Скролимо вниз і пройшли 100px - ховаємо хедер
        setIsHeaderHidden(true);
      } else if (currentScrollY < lastScrollY) {
        // Скролимо вгору - показуємо хедер
        setIsHeaderHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header className={`${styles.header} ${isHeaderHidden ? styles.hidden : ''}`}>
      <nav className={styles.navContainer}>
        <div className={styles.logo}>
          <Link href="/">
            <Image src={headerLogo} alt="Logo" width={52} height={52} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          <div className={`${styles.navItem} ${styles.dropdown}`}>
            <Link className={styles.navLink} href="#">
              <span>{t("aboutLyceum")}</span>
              <span>{t("lyceum")}</span>
            </Link>
            <div className={styles.dropdownContent}>
              <Link href="/visitingcard">{t("ourCard")}</Link>
              <Link href="/history">{t("history")}</Link>
              <Link href="/innovative">{t("innovation")}</Link>
            </div>
          </div>

          <Link className={styles.navLink} href="/news">
            <span>{t("news")}</span>
          </Link>

          <div className={styles.navItem}>
            <Link className={styles.navLink} href="/teachingStaff">
              <span>{t("teaching")}</span>
              <span>{t("staff")}</span>
            </Link>
          </div>

          <div className={`${styles.navItem} ${styles.dropdown}`}>
            <Link className={styles.navLink} href="#">
              <span>{t("transparency")}</span>
              <span>{t("management")}</span>
            </Link>
            <div className={styles.dropdownContent}>
              <Link href="/regulatoryDocuments">{t("regulatoryDocuments")}</Link>
              <Link href="/financialreports">{t("financialReports")}</Link>
              <Link href="/publicinformation">{t("publicInformation")}</Link>
            </div>
          </div>

          <div className={`${styles.navItem} ${styles.dropdown}`}>
            <Link className={styles.navLink} href="#">
              <span>{t("educational")}</span>
              <span>{t("process")}</span>
            </Link>
            <div className={styles.dropdownContent}>
              <Link href="/intellect">{t("intellectAndTalent")}</Link>
              <Link href="/studentselfgovernment">{t("studentSelfGovernment")}</Link>
              <Link href="/projectresearch">{t("projectResearch")}</Link>
              <Link href="/patrioticeducation">{t("patrioticEducation")}</Link>
              <Link href="/evaluationcriteria">{t("evaluationCriteria")}</Link>
              <Link href="/clubsstudios">{t("clubsAndStudios")}</Link>
              <Link href="/sportlife">{t("sportLife")}</Link>
              <Link href="/psychologicalsupport">{t("psychologicalSupport")}</Link>
              <Link href="/antibullying">{t("antiBullying")}</Link>
            </div>
          </div>

          <div className={`${styles.navItem} ${styles.dropdown}`}>
            <Link className={styles.navLink} href="#">
              <span>{t("methodical")}</span>
              <span>{t("work")}</span>
            </Link>
            <div className={styles.dropdownContent}>
              <Link href="/teacherHelp">{t("teacherHelp")}</Link>
              <Link href="/qualificationimprovement">{t("qualificationImprovement")}</Link>
              <Link href="/teachercertification">{t("teacherCertification")}</Link>
              <Link href="/methodicalevents">{t("methodicalEvents")}</Link>
            </div>
          </div>

          <div className={`${styles.navItem} ${styles.dropdown}`}>
            <Link className={styles.navLink} href="#">
              <span>{t("information")}</span>
              <span>{t("page")}</span>
            </Link>
            <div className={styles.dropdownContent}>
              <Link href="/parents">{t("parents")}</Link>
              <Link href="/students">{t("students")}</Link>
            </div>
          </div>

          <div className={`${styles.navItem} ${styles.dropdown}`}>
            <Link className={styles.navLink} href="#">
              <span>{t("other")}</span>
            </Link>
            <div className={styles.dropdownContent}>
              <Link href="http://malyk.ho.ua/" target="_blank">{t("malikLiterarySite")}</Link>
              <Link href="https://lubnyrada.gov.ua/" target="_blank">{t("lubensCityCouncil")}</Link>
              <Link href="https://www.mon.gov.ua/" target="_blank">{t("ministryEducation")}</Link>
              <Link href="https://testportal.gov.ua" target="_blank">{t("ukrainianCenterEducation")}</Link>
              <Link href="https://zno-kharkiv.org.ua/" target="_blank">{t("kharkivRegionalCenter")}</Link>
            </div>
          </div>
        </div>

        <div className={styles.languageSwitcher}>
          <Box
            onClick={() => {
              changeLanguage(locale === "uk" ? "en" : "uk");
            }}
          >
            <Image
              src={locale === "uk" ? engIcon : ukrIcon}
              alt="languageChange"
              width={40}
              height={48}
            />
          </Box>
        </div>

        <button
          className={`${styles.hamburger} ${isMobileMenuOpen ? styles.active : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <div className={styles.hamburgerLine}></div>
          <div className={styles.hamburgerLine}></div>
          <div className={styles.hamburgerLine}></div>
        </button>
      </nav>

      <div
        className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.active : ""}`}
        onClick={closeMobileMenu}
      ></div>

      <div
        className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.active : ""}`}
      >
        <div className={styles.mobileMenuHeader}>
          <button
            className={styles.closeButton}
            onClick={closeMobileMenu}
            aria-label="Close mobile menu"
          >
            ✕
          </button>
        </div>

        <div className={styles.mobileNavLinks}>
          <div className={styles.mobileNavItem}>
            <Link
              className={styles.mobileNavLink}
              href="/index"
              onClick={closeMobileMenu}
            >
              {t("aboutLyceumFull")}
            </Link>
            <div className={styles.mobileDropdownContent}>
              <Link href="/visitingcard" onClick={closeMobileMenu}>
                {t("ourCard")}
              </Link>
              <Link href="/history" onClick={closeMobileMenu}>
                {t("history")}
              </Link>
              <Link href="/innovative" onClick={closeMobileMenu}>
                {t("innovation")}
              </Link>
            </div>
          </div>

          <div className={styles.mobileNavItem}>
            <Link
              className={styles.mobileNavLink}
              href="/news"
              onClick={closeMobileMenu}
            >
              {t("news")}
            </Link>
          </div>

          <div className={styles.mobileNavItem}>
            <Link
              className={styles.mobileNavLink}
              href="/teachingStaff"
              onClick={closeMobileMenu}
            >
              {t("teachingStaff")}
            </Link>
          </div>

          <div className={styles.mobileNavItem}>
            <Link
              className={styles.mobileNavLink}
              href="#"
              onClick={closeMobileMenu}
            >
              {t("transparencyManagement")}
            </Link>
            <div className={styles.mobileDropdownContent}>
              <Link href="/regulatoryDocuments" onClick={closeMobileMenu}>
                Нормативні документи
              </Link>
              <Link href="/financialreports" onClick={closeMobileMenu}>
                Фінансова звітність
              </Link>
              <Link href="/publicinformation" onClick={closeMobileMenu}>
                Публічна інформація
              </Link>
            </div>
          </div>

          <div className={styles.mobileNavItem}>
            <Link
              className={styles.mobileNavLink}
              href="#"
              onClick={closeMobileMenu}
            >
              {t("educationalProcess")}
            </Link>
            <div className={styles.mobileDropdownContent}>
              <Link href="/intellect" onClick={closeMobileMenu}>
                {t("intellectAndTalent")}
              </Link>
              <Link href="/studentselfgovernment" onClick={closeMobileMenu}>
                {t("studentSelfGovernment")}
              </Link>
              <Link href="/projectresearch" onClick={closeMobileMenu}>
                Проєктно-дослідницька діяльність
              </Link>
              <Link href="/patrioticeducation" onClick={closeMobileMenu}>
                Національно-патріотичне виховання
              </Link>
              <Link href="/evaluationcriteria" onClick={closeMobileMenu}>
                Критерії оцінювання
              </Link>
              <Link href="/clubsstudios" onClick={closeMobileMenu}>
                Клуби та студії
              </Link>
              <Link href="/sportlife" onClick={closeMobileMenu}>
                {t("sportLife")}
              </Link>
              <Link href="/psychologicalsupport" onClick={closeMobileMenu}>
                Соціально-психологічна підтримка
              </Link>
              <Link href="/antibullying" onClick={closeMobileMenu}>
                Протидія булінгу
              </Link>
            </div>
          </div>

          <div className={styles.mobileNavItem}>
            <Link
              className={styles.mobileNavLink}
              href="#"
              onClick={closeMobileMenu}
            >
              {t("methodicalWork")}
            </Link>
            <div className={styles.mobileDropdownContent}>
              <Link href="/teacherHelp" onClick={closeMobileMenu}>
                На допомогу вчителю
              </Link>
              <Link href="/qualificationimprovement" onClick={closeMobileMenu}>
                Підвищення кваліфікації
              </Link>
              <Link href="/teachercertification" onClick={closeMobileMenu}>
                Атестація педпрацівників
              </Link>
              <Link href="/methodicalevents" onClick={closeMobileMenu}>
                Основні методичні заходи
              </Link>
            </div>
          </div>

          <div className={styles.mobileNavItem}>
            <Link
              className={styles.mobileNavLink}
              href="#"
              onClick={closeMobileMenu}
            >
              {t("informationPage")}
            </Link>
            <div className={styles.mobileDropdownContent}>
              <Link href="/parents" onClick={closeMobileMenu}>
                {t("parents")}
              </Link>
              <Link href="/students" onClick={closeMobileMenu}>
                {t("students")}
              </Link>
            </div>
          </div>

          {/* Mobile Language Switcher */}
          <div 
            className={styles.mobileLanguageSwitcher}
            onClick={() => {
              changeLanguage(locale === "uk" ? "en" : "uk");
              closeMobileMenu();
            }}
          >
            <Image
              src={locale === "uk" ? engIcon : ukrIcon}
              alt="languageChange"
              width={44}
              height={48}
            />
          </div>
        </div>
      </div>

      <hr />
    </header>
  );
};

export default Header;