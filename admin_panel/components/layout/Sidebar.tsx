'use client';

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemText,
    Typography, Divider, alpha, Collapse
} from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import React, { useState, useEffect, Suspense, useMemo } from 'react';

const groupedLinks = [
    // ===================================
    // 1. ГОЛОВНА ТА ВІЗИТІВКА
    // ===================================
    {
        title: "🏛️ Про ліцей",
        links: [
            {href: "/lyceumStats/", label: "Статистика"},
            {
                label: "🏠 Головна",
                subLinks: [
                    {href: "/fAQ", label: "Питання (FAQ)"},
                    {href: "/workingArea", label: "Зона роботи"},
                ]
            },
            {
                label: "📜 Сторінка Історії",
                subLinks: [
                    {href: "/content?type=FOUNDERS", label: "Тексти (Фундатори)"},
                    {href: "/content?type=BUILDING", label: "Тексти (Будівля)"},
                    {href: "/content?type=HISTORY", label: "Тексти (Історія)"},
                    {href: "/person?type=FAMOUS_PERSON", label: "Видатні"},
                    {href: "/person?type=PRINCIPALS", label: "Директори"},
                ],
            },
            {
                label: "💡 Сторінка Інновацій",
                subLinks: [
                    {href: "/pageSection?type=INNOVATIVE", label: "Заголовок та вступ"},
                    {href: "/content?type=INNOVATION", label: "Статті про інновації"},
                ],
            },
        ],
    },
    {
        title: "📰 Новинна стрічка",
        links: [
            {href: "/content?type=NEWS", label: "Всі новини"},
        ],
    },
    {
        title: "👥 Вчителі",
        links: [
            {href: "/personCategory", label: "Кафедри (Категорії)"},
            {href: "/person?type=TEACHER", label: "Список вчителів"},
        ],
    },
    {
        title: "📂 Документи",
        links: [
            {
                label: "📂 Нормативні документи",
                subLinks: [
                    {href: "/documentReport?category=REGULATORY", label: "Структура та файли"},
                ],
            },
            {
                label: "💰 Фінансові звіти",
                subLinks: [
                    {href: "/documentReport?category=FINANCIAL", label: "Структура та файли"},
                ],
            },
            {
                label: "📢 Публічна інформація",
                subLinks: [
                    {href: "/documentReport?category=PUBLIC_INFO", label: "Структура та файли"},
                ],
            },
        ],
    },
    {
        title: "🎓 Освіта та Активності",
        links: [
            {
                label: "🧠 Психологічна служба",
                subLinks: [
                    {href: "/pageSection?type=PSYCHOLOGICAL", label: "Заголовок та вступ"},
                    {href: "/person?type=PSYCHOLOGIST", label: "Психолог (Персона)"}, // Треба додати PSYCHOLOGIST в enum PersonType
                    {href: "/content?type=PSYCHOLOGICAL", label: "Статті та поради"},
                    {href: "/externalLink?pageKey=PSYCHOLOGICAL", label: "Корисні посилання"},
                ],
            },
            {
                label: "🛑 Анти-булінг",
                subLinks: [
                    {href: "/pageSection?type=ANTI_BULLYING", label: "Заголовок та вступ"},
                    {href: "/content?type=ANTI_BULLYING", label: "Статті та матеріали"},
                    {href: "/externalLink?pageKey=BULLYING", label: "Корисні посилання"},
                ],
            },
            {
                label: "🎓 Освіта та Активності",
                subLinks: [
                    {href: "/content?type=CLUBS", label: "Клуби та студії"},
                    {href: "/content?type=SPORT", label: "SportLife"},
                    {href: "/pageSection?type=PROJECT_RESEARCH", label: "Заголовок та вступ для проектів"},
                    {href: "/content?type=RESEARCH_PROJECT", label: "Наукова робота"},
                    {href: "/content?type=PATRIOTIC", label: "Патріотичне виховання"},
                    {href: "/content?type=INTELLECT", label: "Інтелект"},
                    {href: "/content?type=GOVERNMENT", label: "Самоврядування"},
                ],
            },

            {
                label: "🎓 Оцінюювання",
                subLinks: [
                    {href: "/discipline", label: "Предмет"},
                    {href: "/disciplineSubItem", label: "Поділ на класи"},
                ],
            },
        ],
    },
    {
        title: "🎓 Методична",
        links: [
            {
                label: "📚 Вчителям (Методична)",
                subLinks: [
                    {href: "/pageSection?type=TEACHERS_INFO", label: "Заголовок та вступ"},
                    {href: "/content?type=FOR_TEACHERS", label: "Допомога вчителю"},
                    {href: "/externalLink?pageKey=TEACHER_HELP", label: "Корисні посилання"},
                ],
            },
            {
                label: "📚 Методична",
                subLinks: [
                    {href: "/pageSection?type=METHODOLOGICAL", label: "Методичні заходи: Заголовок та вступ"},
                    {href: "/content?type=METHODOLOGICAL", label: "Методичні заходи"},
                ],
            },
            {
                label: "📚 Кваліфікація",
                subLinks: [
                    {href: "/pageSection?type=QUALIFICATION", label: "Підвищення кваліфікації: Заголовок та вступ"},
                    {href: "/content?type=QUALIFICATION", label: "Підвищення кваліфікації"},
                    {href: "/externalLink?pageKey=QUALIFICATION", label: "Корисні посилання"},
                ],
            },
            {
                label: "🏅 Сертифікація",
                subLinks: [
                    {href: "/pageSection?type=CERTIFICATION", label: "Заголовок та вступ"},
                    {href: "/person?type=COMMISSION_MEMBER", label: "Члени комісії"},
                    {href: "/content?type=CERTIFICATION", label: "Матеріали"}, // Новий тип
                    {href: "/externalLink?pageKey=CERTIFICATION", label: "Корисні посилання"},
                ],
            },
        ],
    },
    {
        title: "👪 Батькам та Учням",
        links: [
            {href: "/pageSection?type=PARENTS_INFO", label: "Заголовок та вступ"},
            {href: "/content?type=FOR_PARENTS", label: "Батькам: Події/Оголошення"},
            {href: "/externalLink?pageKey=PARENTS", label: "Батькам: Корисні посилання"},
            {href: "/pageSection?type=STUDENTS_INFO", label: "Заголовок та вступ"},
            {href: "/content?type=FOR_STUDENTS", label: "Учням: Події/Оголошення"},
            {href: "/externalLink?pageKey=STUDENTS", label: "Учням: Корисні посилання"},
        ],
    },
    {
        title: "🧩 Спец-модулі",
        links: [
            {href: "/location", label: "VR-Тур (Поверхи/Кімнати)"},
            {href: "/testQuestion", label: "Тест: Питання"},
            {href: "/specialization", label: "Тест: Результати (Профілі)"},
        ],
    },
    {
        title: "Admin",
        links: [
            {href: "/change-password", label: "Змінити пароль"},
        ],
    },
];

const checkIsActive = (href: string, pathname: string, searchParams: URLSearchParams) => {
    if (!href) return false;
    const [path, query] = href.split('?');
    const isPathMatch = pathname === path;

    if (query) {
        const urlParams = new URLSearchParams(query);
        return isPathMatch && Array.from(urlParams.entries()).every(([key, value]) =>
            searchParams.get(key) === value
        );
    }
    return isPathMatch;
};

function SidebarItem({ href, label, pathname }: { href: string; label: string; pathname: string }) {
    const searchParams = useSearchParams();
    const isActive = useMemo(() => checkIsActive(href, pathname, searchParams), [href, pathname, searchParams]);

    return (
        <ListItem disablePadding>
            <ListItemButton
                component={Link}
                href={href}
                sx={{
                    borderRadius: 2,
                    my: 0.2,
                    bgcolor: isActive ? alpha('#182BA1', 0.08) : 'transparent',
                    color: isActive ? '#182BA1' : '#475569',
                    '&:hover': { bgcolor: alpha('#182BA1', 0.12) }
                }}
            >
                <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                        fontSize: '0.825rem',
                        fontWeight: isActive ? 700 : 500
                    }}
                />
            </ListItemButton>
        </ListItem>
    );
}

function SubNavGroup({ item, pathname }: { item: any; pathname: string }) {
    const searchParams = useSearchParams();
    // Перевіряємо, чи є хоч одне активне посилання в підгрупі
    const hasActiveChild = useMemo(() =>
            item.subLinks?.some((sub: any) => checkIsActive(sub.href, pathname, searchParams)),
        [item.subLinks, pathname, searchParams]);

    const [open, setOpen] = useState(false);

    // Розкриваємо підгрупу, якщо активна дитина
    useEffect(() => {
        if (hasActiveChild) setOpen(true);
    }, [hasActiveChild]);

    return (
        <>
            <ListItemButton
                onClick={() => setOpen(!open)}
                sx={{ borderRadius: 2, pl: 2, py: 0.5 }}
            >
                <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: hasActiveChild ? '#182BA1' : '#475569'
                    }}
                />
                {open ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 2 }}>
                    {item.subLinks.map((sub: any) => (
                        <SidebarItem key={sub.href} href={sub.href} label={sub.label} pathname={pathname} />
                    ))}
                </List>
            </Collapse>
        </>
    );
}

function NavGroup({ group, pathname }: { group: any; pathname: string }) {
    const searchParams = useSearchParams();

    // Перевірка на активність будь-якого елемента всередині групи (включаючи підгрупи)
    const hasActiveInside = useMemo(() => {
        return group.links.some((link: any) => {
            if (link.subLinks) {
                return link.subLinks.some((sub: any) => checkIsActive(sub.href, pathname, searchParams));
            }
            return checkIsActive(link.href, pathname, searchParams);
        });
    }, [group.links, pathname, searchParams]);

    const [open, setOpen] = useState(false);

    // Авто-розкриття при завантаженні, якщо ми всередині цієї секції
    useEffect(() => {
        if (hasActiveInside) setOpen(true);
    }, [hasActiveInside]);

    return (
        <>
            <ListItemButton
                onClick={() => setOpen(!open)}
                sx={{
                    borderRadius: 2,
                    mt: 1,
                    '&:hover': { bgcolor: alpha('#182BA1', 0.04) }
                }}
            >
                <ListItemText
                    primary={group.title}
                    primaryTypographyProps={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: open || hasActiveInside ? '#182BA1' : '#64748b',
                        textTransform: 'uppercase'
                    }}
                />
                {open ? <ExpandLess sx={{ fontSize: 18, color: '#182BA1' }} /> : <ExpandMore sx={{ fontSize: 18, color: '#94a3b8' }} />}
            </ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 1 }}>
                    {group.links.map((link: any, idx: number) => (
                        <React.Fragment key={link.href || `group-${idx}`}>
                            {link.subLinks ? (
                                <SubNavGroup item={link} pathname={pathname} />
                            ) : (
                                <SidebarItem href={link.href} label={link.label} pathname={pathname} />
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </Collapse>
        </>
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
                },
            }}
        >
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#182BA1' }}>
                    LYCEUM <span style={{ color: '#f97316' }}>ADMIN</span>
                </Typography>
            </Box>
            <Divider sx={{ mx: 2, mb: 1 }} />
            <Box sx={{ overflowY: 'auto', px: 2, pb: 4 }}>
                <Suspense fallback={<Typography p={2}>Завантаження меню...</Typography>}>
                    <List>
                        {groupedLinks.map((group) => (
                            <NavGroup key={group.title} group={group} pathname={pathname} />
                        ))}
                    </List>
                </Suspense>
            </Box>
        </Drawer>
    );
}