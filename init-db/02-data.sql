-- 1. СТАТИСТИКА ЛІЦЕЮ (LyceumStats)
INSERT INTO "LyceumStats" (
    "id", "name", "nameEn", "addressUk", "addressEn", "email", "phone",
    "logoUrl", "quoteUk", "quoteEn", "teachingLanguages", "specializationsList", "anthemUrl",
    "socialLinks", "studentsCount", "teachersCount", "staffCount",
    "classesCount", "flexParticipants", "topScorersCount", "updatedAt"
)
VALUES (
           1,
           'Науковий ліцей',
           'Science Lyceum',
           'вул. Науки, 15',
           '15 Nauky St',
           'lyceum@edu.ua',
           '+380000000000',
           'https://example.com/logo.png', -- logoUrl
           'Знання — це сила',            -- quoteUk
           'Knowledge is power',          -- quoteEn
           ARRAY['Українська', 'English'], -- teachingLanguages
           ARRAY['Математика', 'IT'],     -- specializationsList
           'https://youtube.com/anthem',  -- anthemUrl
           '{"facebook": "https://fb.com/lyceum", "instagram": "https://inst.com/lyceum", "youtube": "https://yt.com/lyceum"}'::JSONB,
           650, 54, 20, 24, 12, 45,
           CURRENT_TIMESTAMP
       )
    ON CONFLICT (id) DO UPDATE SET
    "name" = EXCLUDED."name",
                            "nameEn" = EXCLUDED."nameEn",
                            "addressUk" = EXCLUDED."addressUk",
                            "addressEn" = EXCLUDED."addressEn",
                            "email" = EXCLUDED."email",
                            "phone" = EXCLUDED."phone",
                            "logoUrl" = EXCLUDED."logoUrl",
                            "quoteUk" = EXCLUDED."quoteUk",
                            "quoteEn" = EXCLUDED."quoteEn",
                            "teachingLanguages" = EXCLUDED."teachingLanguages",
                            "specializationsList" = EXCLUDED."specializationsList",
                            "anthemUrl" = EXCLUDED."anthemUrl",
                            "socialLinks" = EXCLUDED."socialLinks",
                            "studentsCount" = EXCLUDED."studentsCount",
                            "teachersCount" = EXCLUDED."teachersCount",
                            "staffCount" = EXCLUDED."staffCount",
                            "classesCount" = EXCLUDED."classesCount",
                            "flexParticipants" = EXCLUDED."flexParticipants",
                            "topScorersCount" = EXCLUDED."topScorersCount",
                            "updatedAt" = CURRENT_TIMESTAMP;

-- 2. СТАТИЧНІ СЕКЦІЇ СТОРІНОК (Замість HomePageConfig)
-- Тут ми створюємо початкові тексти для головної та інших сторінок
INSERT INTO "PageSection" ("id", "titleUk", "titleEn", "contentUk", "contentEn", "updatedAt")
VALUES
    (
        'home_hero',
        'Твоє майбутнє починається тут',
        'Your future starts here',
        'Сучасна освіта, науковий підхід та всебічний розвиток особистості.',
        'Modern education, scientific approach, and comprehensive personal development.',
        CURRENT_TIMESTAMP
    ),
    (
        'innovation_intro',
        'Інноваційна діяльність',
        'Innovation Activity',
        'Ми впроваджуємо найсучасніші освітні технології...',
        'We implement the most modern educational technologies...',
        CURRENT_TIMESTAMP
    ),
    (
        'certification_info',
        'Атестаційна комісія',
        'Certification Commission',
        'Адреса: каб. 204. Голова комісії: Директор.',
        'Address: room 204. Chair: Director.',
        CURRENT_TIMESTAMP
    )
    ON CONFLICT (id) DO UPDATE SET
    "titleUk" = EXCLUDED."titleUk",
                            "contentUk" = EXCLUDED."contentUk",
                            "updatedAt" = CURRENT_TIMESTAMP;

-- 4. АДМІНІСТРАТОР
-- Пароль той самий, що був у тебе
INSERT INTO "AdminUser" ("username", "password", "role", "createdAt", "isActive")
VALUES (
           'european_admin',
           '$2a$12$48jjpVTAXKJl1IVvXrDsBek8pSQYyfpzqOsmmaEEVazhwn40j6yVm',
           'admin',
           CURRENT_TIMESTAMP,
           true
       )
    ON CONFLICT ("username") DO NOTHING;
