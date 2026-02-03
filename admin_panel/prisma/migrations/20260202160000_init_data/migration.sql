-- =============================================
-- 1. СТАТИСТИКА ЛІЦЕЮ (LyceumStats)
-- Оновлено відповідно до схеми (addressUk, facebookUrl і т.д.)
-- =============================================
INSERT INTO "LyceumStats" (
    "id", "name", "nameEn", "addressUk", "addressEn", "email",
    "phone", "facebookUrl", "instagramUrl", "youtubeUrl", "studentsCount",
    "teachersCount", "staffCount", "classesCount", "flexParticipants", "topScorersCount",
    "updatedAt"
) VALUES (
             1,
             'Науковий ліцей',
             'Science Lyceum',
             'вул. Науки, 15',
             '15 Nauky St',
             'lyceum@edu.ua',
             '+380000000000',
             'https://facebook.com/lyceum',
             'https://instagram.com/lyceum',
             'https://youtube.com/lyceum_channel',
             650, 54, 20, 24, 12, 45,
             NOW()
         ) ON CONFLICT (id) DO UPDATE SET
                                          "name" = EXCLUDED."name",
                                          "nameEn" = EXCLUDED."nameEn",
                                          "addressUk" = EXCLUDED."addressUk",
                                          "addressEn" = EXCLUDED."addressEn",
                                          "facebookUrl" = EXCLUDED."facebookUrl",
                                          "instagramUrl" = EXCLUDED."instagramUrl",
                                          "youtubeUrl" = EXCLUDED."youtubeUrl",
                                          "updatedAt" = NOW();

-- =============================================
-- 2. КОНФІГУРАЦІЯ ГОЛОВНОЇ СТОРІНКИ (HomePageConfig)
-- Оновлено (heroTitleUk, heroSubtitleUk)
-- =============================================
INSERT INTO "HomePageConfig" (
    "id", "heroTitleUk", "heroTitleEn", "heroSubtitleUk", "heroSubtitleEn",
    "updatedAt"
) VALUES (
             1,
             'Твоє майбутнє починається тут',
             'Your future starts here',
             'Сучасна освіта, науковий підхід та всебічний розвиток особистості в нашому ліцеї.',
             'Modern education, scientific approach, and comprehensive personal development in our lyceum.',
             NOW()
         ) ON CONFLICT (id) DO UPDATE SET
                                          "heroTitleUk" = EXCLUDED."heroTitleUk",
                                          "heroTitleEn" = EXCLUDED."heroTitleEn",
                                          "heroSubtitleUk" = EXCLUDED."heroSubtitleUk",
                                          "heroSubtitleEn" = EXCLUDED."heroSubtitleEn",
                                          "updatedAt" = NOW();

-- =============================================
-- 3. АДМІНІСТРАТОР (AdminUser)
-- Виправлено відповідно до схеми (немає поля email та isActive, замінено на існуючі)
-- =============================================
INSERT INTO "AdminUser" (
    "username", "password", "role", "createdAt"
) VALUES (
             'european_admin',
             '$2a$12$tCjABQ3HGpRn0xHxIly3mOOS7OgIYfwT/bFPRfJflQNn1oQtmoOxC', -- Пароль залишено без змін
             'admin',
             NOW()
         ) ON CONFLICT ("username") DO NOTHING;
-- Використовуємо DO NOTHING для адміна, щоб не скинути lastLogin або випадково не змінити пароль при повторному запуску