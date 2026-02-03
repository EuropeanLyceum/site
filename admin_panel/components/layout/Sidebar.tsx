'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
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
import React from 'react';

const groupedLinks = [
  // ===================================
  // 1. ГОЛОВНА ТА ВІЗИТІВКА
  // ===================================
  {
    title: "🏠 Головна сторінка",
    links: [
      { href: "/pageSection/home_hero", label: "Заголовок і банер (Hero)" },
      { href: "/lyceumStats/", label: "Статистика (Цифри)" },
      { href: "/faq", label: "FAQ (Питання-відповідь)" },
    ],
  },
  {
    title: "📇 Візитівка ліцею",
    links: [
      { href: "/pageSection/visiting_card_intro", label: "Текст візитівки" },
      { href: "/lyceumStats/", label: "Дані про клуби (в статистиці)" },
      { href: "/content?type=VISITING_CARD", label: "Матеріальна база (Контент)" },
    ],
  },

  // ===================================
  // 2. ПРО ЛІЦЕЙ (ІСТОРІЯ ТА ІННОВАЦІЇ)
  // ===================================
  {
    title: "📜 Сторінка Історії",
    links: [
      { href: "/content?type=HISTORY", label: "Тексти (Історія, Будівля)" },
      { href: "/person?type=FAMOUS_PERSON", label: "Фундатори та Видатні" },
      { href: "/person?type=ADMINISTRATION", label: "Директори" },
    ],
  },
  {
    title: "💡 Сторінка Інновацій",
    links: [
      { href: "/pageSection/innovation_intro", label: "Заголовок та вступ" },
      { href: "/content?type=INNOVATION", label: "Статті про інновації" },
      { href: "/content?type=PROJECT", label: "Проєкти" },
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
      { href: "/person?type=PSYCHOLOGIST", label: "Психолог (Персона)" }, // Треба додати PSYCHOLOGIST в enum PersonType
      { href: "/content?type=PSYCHOLOGICAL", label: "Статті та поради" },
      { href: "/externalLink?pageKey=psychological", label: "Корисні посилання" },
    ],
  },
  {
    title: "🛑 Анти-булінг",
    links: [
      { href: "/content?type=ANTI_BULLYING", label: "Статті та матеріали" }, // Додати в enum
      { href: "/externalLink?pageKey=anti_bullying", label: "Корисні посилання" },
    ],
  },
  {
    title: "🎓 Освіта та Активності",
    links: [
      { href: "/content?type=CLUBS", label: "Клуби та студії" },
      { href: "/content?type=SPORT", label: "SportLife" },
      { href: "/content?type=RESEARCH", label: "Наукова робота" },
      { href: "/content?type=PATRIOTIC", label: "Патріотичне виховання" },
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
      { href: "/content?type=QUALIFICATION", label: "Підвищення кваліфікації" }, // Новий тип
    ],
  },
  {
    title: "🏅 Сертифікація",
    links: [
      { href: "/pageSection/certification_intro", label: "Інфо про комісію (Адреса)" },
      { href: "/person?type=COMMISSION_MEMBER", label: "Члени комісії" },
      { href: "/content?type=CERTIFICATION", label: "Матеріали" }, // Новий тип
      { href: "/externalLink?pageKey=certification", label: "Корисні посилання" },
    ],
  },

  // ===================================
  // 7. БАТЬКАМ ТА УЧНЯМ
  // ===================================
  {
    title: "👪 Батькам та Учням",
    links: [
      { href: "/pageSection/parents_intro", label: "Батькам: Вступ" },
      { href: "/content?type=FOR_PARENTS", label: "Батькам: Події/Оголошення" },
      { href: "/pageSection/students_intro", label: "Учням: Вступ" },
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
];

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
                {group.links.map((link) => {
                  // Перевірка активності: чи pathname починається з href (для вкладених сторінок)
                  const isActive = pathname.startsWith(link.href.split('?')[0]);

                  return (
                      <ListItem key={link.href} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            component={Link}
                            href={link.href}
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
                              primary={link.label}
                              primaryTypographyProps={{
                                fontSize: '0.875rem',
                                fontWeight: isActive ? 700 : 500
                              }}
                          />
                        </ListItemButton>
                      </ListItem>
                  );
                })}
              </List>
          ))}
        </Box>
      </Drawer>
  );
}