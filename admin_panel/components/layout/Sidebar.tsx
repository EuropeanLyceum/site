'use client';

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
  ListSubheader,
  alpha
} from "@mui/material";
import React, { Suspense } from 'react';

const groupedLinks = [
  // ===================================
  // 1. ГОЛОВНА ТА ВІЗИТІВКА
  // ===================================
  {
    title: "🏠 Головна сторінка",
    links: [
      { href: "/pageSection?type=HOME_HERO", label: "Заголовок та вступ" },
      { href: "/lyceumStats/", label: "Статистика (Цифри)" },
      { href: "/fAQ", label: "FAQ (Питання-відповідь)" },
      { href: "/clubs", label: "Клуби" },
      { href: "/workingArea", label: "Зона роботи" },
    ],
  },

  // ===================================
  // 2. ПРО ЛІЦЕЙ (ІСТОРІЯ ТА ІННОВАЦІЇ)
  // ===================================
  {
    title: "📜 Сторінка Історії",
    links: [
      { href: "/content?type=FOUNDERS", label: "Тексти (Фундатори)" },
      { href: "/content?type=BUILDING", label: "Тексти (Будівля)" },
      { href: "/content?type=HISTORY", label: "Тексти (Історія)" },
      { href: "/person?type=FAMOUS_PERSON", label: "Видатні" },
      { href: "/person?type=PRINCIPALS", label: "Директори" },
    ],
  },
  {
    title: "💡 Сторінка Інновацій",
    links: [
      { href: "/pageSection?type=INNOVATIVE", label: "Заголовок та вступ" },
      { href: "/content?type=INNOVATION", label: "Статті про інновації" },
    ],
  },

  // ===================================
  // 3. НОВИНИ ТА ВЧИТЕЛІ
  // ===================================
  {
    title: "📰 Новинна стрічка",
    links: [
      { href: "/content?type=NEWS", label: "Всі новини" },
    ],
  },
  {
    title: "👥 Вчителі",
    links: [
      { href: "/personCategory", label: "Кафедри (Категорії)" },
      { href: "/person?type=TEACHER", label: "Список вчителів" },
    ],
  },

  // ===================================
  // 4. ПРОЗОРІСТЬ (ДОКУМЕНТИ)
  // ===================================
  {
    title: "📂 Нормативні документи",
    links: [
      { href: "/documentReport?category=REGULATORY", label: "Структура та файли" },
    ],
  },
  {
    title: "💰 Фінансові звіти",
    links: [
      { href: "/documentReport?category=FINANCIAL", label: "Структура та файли" },
    ],
  },
  {
    title: "📢 Публічна інформація",
    links: [
      { href: "/documentReport?category=PUBLIC_INFO", label: "Структура та файли" },
    ],
  },

  // ===================================
  // 5. НАВЧАЛЬНИЙ ПРОЦЕС (ЗМІШАНИЙ)
  // ===================================
  {
    title: "🧠 Психологічна служба",
    links: [
      { href: "/pageSection?type=PSYCHOLOGICAL", label: "Заголовок та вступ" },
      { href: "/person?type=PSYCHOLOGIST", label: "Психолог (Персона)" }, // Треба додати PSYCHOLOGIST в enum PersonType
      { href: "/content?type=PSYCHOLOGICAL", label: "Статті та поради" },
      { href: "/externalLink?pageKey=PSYCHOLOGICAL", label: "Корисні посилання" },
    ],
  },
  {
    title: "🛑 Анти-булінг",
    links: [
      { href: "/pageSection?type=ANTI_BULLYING", label: "Заголовок та вступ" },
      { href: "/content?type=ANTI_BULLYING", label: "Статті та матеріали" },
      { href: "/externalLink?pageKey=ANTI_BULLYING", label: "Корисні посилання" },
    ],
  },
  {
    title: "🎓 Освіта та Активності",
    links: [
      { href: "/content?type=CLUBS", label: "Клуби та студії" },
      { href: "/content?type=SPORT", label: "SportLife" },
      { href: "/pageSection?type=PROJECT_RESEARCH", label: "Заголовок та вступ для проектів" },
      { href: "/content?type=RESEARCH_PROJECT", label: "Наукова робота" },
      { href: "/content?type=PATRIOTIC", label: "Патріотичне виховання" },
      { href: "/content?type=INTELLECT", label: "Інтелект" },
      { href: "/content?type=GOVERNMENT", label: "Самоврядування" },
    ],
  },

  {
    title: "🎓 Оцінюювання",
    links: [
      { href: "/discipline", label: "Предмет" },
      { href: "/disciplineSubItem", label: "Поділ на класи" },
    ],
  },

  // ===================================
  // 6. МЕТОДИЧНА РОБОТА
  // ===================================
  {
    title: "📚 Вчителям (Методична)",
    links: [
      { href: "/content?type=METHODOLOGICAL", label: "Методичні заходи" },
      { href: "/content?type=FOR_TEACHERS", label: "Допомога вчителю" },
      { href: "/content?type=QUALIFICATION", label: "Підвищення кваліфікації" },
    ],
  },
  {
    title: "🏅 Сертифікація",
    links: [
      { href: "/pageSection?type=CERTIFICATION", label: "Заголовок та вступ" },
      { href: "/person?type=COMMISSION_MEMBER", label: "Члени комісії" },
      { href: "/content?type=CERTIFICATION", label: "Матеріали" }, // Новий тип
      { href: "/externalLink?pageKey=CERTIFICATION", label: "Корисні посилання" },
    ],
  },

  // ===================================
  // 7. БАТЬКАМ ТА УЧНЯМ
  // ===================================
  {
    title: "👪 Батькам та Учням",
    links: [
      { href: "/pageSection?type=PARENTS_INFO", label: "Заголовок та вступ" },
      { href: "/content?type=FOR_PARENTS", label: "Батькам: Події/Оголошення" },
      { href: "/pageSection?type=STUDENTS_INFO", label: "Заголовок та вступ" },
      { href: "/content?type=FOR_STUDENTS", label: "Учням: Події/Оголошення" },
    ],
  },

  // ===================================
  // 8. СПЕЦІАЛЬНІ МОДУЛІ
  // ===================================
  {
    title: "🧩 Спец-модулі",
    links: [
      { href: "/location", label: "VR-Тур (Поверхи/Кімнати)" },
      { href: "/testQuestion", label: "Тест: Питання" },
      { href: "/specialization", label: "Тест: Результати (Профілі)" },
    ],
  },

  {
    title: "Admin",
    links: [
      { href: "/change-password", label: "Змінити пароль" },
    ],
  },
];

function SidebarItem({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const searchParams = useSearchParams();

  const checkIsActive = () => {
    const [path, query] = href.split('?');
    const isPathMatch = pathname === path;

    if (query) {
      const urlParams = new URLSearchParams(query);
      return isPathMatch && Array.from(urlParams.entries()).every(([key, value]) =>
          searchParams.get(key) === value
      );
    }
    return isPathMatch && searchParams.toString() === "";
  };

  const isActive = checkIsActive();

  return (
      <ListItem disablePadding sx={{ mb: 0.5 }}>
        <ListItemButton
            component={Link}
            href={href}
            sx={{
              borderRadius: 3,
              transition: 'all 0.2s',
              bgcolor: isActive ? alpha('#182BA1', 0.08) : 'transparent',
              color: isActive ? '#182BA1' : '#475569',
              '&:hover': {
                bgcolor: isActive ? alpha('#182BA1', 0.12) : '#f1f5f9',
                color: isActive ? '#182BA1' : '#0f172a',
              }
            }}
        >
          <ListItemText
              primary={label}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: isActive ? 700 : 500
              }}
          />
        </ListItemButton>
      </ListItem>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const drawerWidth = 280;

  return (
      <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: '#fff',
              borderRight: '1px solid #e2e8f0',
              boxShadow: '4px 0 10px rgba(0,0,0,0.02)'
            },
          }}
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" sx={{
            fontWeight: 900,
            color: '#182BA1',
            fontFamily: 'var(--font-montserrat-alternates), sans-serif',
            letterSpacing: '-0.5px'
          }}>
            LYCEUM <span style={{ color: '#f97316' }}>ADMIN</span>
          </Typography>
        </Box>

        <Divider sx={{ mx: 2, mb: 1, opacity: 0.6 }} />

        <Box sx={{ overflowY: 'auto', px: 2, pb: 4 }}>
          {groupedLinks.map((group) => (
              <List
                  key={group.title}
                  subheader={
                    <ListSubheader sx={{
                      bgcolor: 'transparent',
                      color: '#94a3b8',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      lineHeight: '32px',
                      mt: 2
                    }}>
                      {group.title}
                    </ListSubheader>
                  }
              >
                {group.links.map((link) => (
                    <Suspense key={link.href} fallback={<ListItem sx={{ py: 1.5, opacity: 0.5 }}>{link.label}</ListItem>}>
                      <SidebarItem
                          href={link.href}
                          label={link.label}
                          pathname={pathname}
                      />
                    </Suspense>
                ))}
              </List>
          ))}
        </Box>
      </Drawer>
  );
}