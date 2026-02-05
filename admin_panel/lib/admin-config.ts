export const FIELD_LABELS: Record<string, string> = {
    // ===== СИСТЕМНІ =====
    id: "ID",
    createdAt: "Дата створення",
    updatedAt: "Останнє оновлення",
    order: "Порядок",
    type: "Тип",
    slug: "URL-слаг (SEO)",

    // ===== CONTENT =====
    titleUk: "Заголовок (UA)",
    titleEn: "Заголовок (EN)",
    textUk: "Текст (UA)",
    textEn: "Текст (EN)",
    photoGallery: "Галерея фото",
    videoUrl: "YouTube відео",
    publicationDate: "Дата публікації",
    attributes: "Додаткові атрибути (JSON)",

    // ===== PAGE SECTION =====
    contentUk: "Контент / HTML (UA)",
    contentEn: "Контент / HTML (EN)",
    imagePhoto: "Зображення",

    // ===== EXTERNAL LINKS =====
    pageKey: "Сторінка",
    url: "Посилання",

    // ===== LYCEUM STATS =====
    name: "Назва",
    nameEn: "Назва (EN)",
    addressUk: "Адреса (UA)",
    addressEn: "Адреса (EN)",
    email: "Email",
    phone: "Телефон",
    logoPhoto: "Логотип",
    quoteUk: "Цитата (UA)",
    quoteEn: "Цитата (EN)",
    teachingLanguage: "Мова викладання",
    teachingLanguageEn: "Мова викладання (EN)",
    specialization: "Спеціалізація",
    specializationEn: "Спеціалізація (EN)",
    anthemUrl: "Гімн (URL)",
    teachersPhoto: "Фото викладачів",
    materialBasePhoto: "Матеріальна база (фото)",
    materialBaseDescriptionUk: "Матеріальна база (опис UA)",
    materialBaseDescriptionEn: "Матеріальна база (опис EN)",
    socialLinks: "Соцмережі (JSON)",
    studentsCount: "К-ть учнів",
    studentsCountReal: "К-ть учнів (реально)",
    teachersCount: "К-ть вчителів",
    staffCount: "Персонал",
    classesCount: "К-ть класів",
    flexParticipants: "Учасники FLEX",
    topScorersCount: "200-бальники",

    // ===== PERSON =====
    fullNameUk: "ПІБ (UA)",
    fullNameEn: "ПІБ (EN)",
    positionUk: "Посада (UA)",
    positionEn: "Посада (EN)",
    descriptionUk: "Опис (UA)",
    descriptionEn: "Опис (EN)",
    photo: "Фото",
    specializationUk: "Спеціалізація (UA)",
    categoryId: "Категорія",

    // ===== DOCUMENTS =====
    category: "Категорія",
    parentId: "Батьківський розділ",
    fileType: "Тип файлу",
    fileSize: "Розмір файлу",
    reportId: "Звіт/Документ",

    // ===== LOCATION =====
    floor: "Поверх",
    highlightsUk: "Особливості (UA)",
    highlightsEn: "Особливості (EN)",
    imagePhotos: "Фото",
    iconName: "Іконка",

    // ===== TESTS & CLUBS =====
    question: "Питання (UA)",
    questionEn: "Питання (EN)",
    options: "Варіанти (UA)",
    optionsEn: "Варіанти (EN)",
    nameUk: "Назва (UA)",

    // ===== ADMIN =====
    username: "Логін",
    password: "Пароль",
    role: "Роль",
    isActive: "Активний",
    lastLogin: "Останній вхід"
};

export const ADMIN_MODELS = {
    // --- КОНТЕНТ ТА ІНФОРМАЦІЯ ---
    content: {
        label: "Контент (Новини/Проєкти)",
        tableFields: ["titleUk", "type", "publicationDate"],
        allFields: ["type", "slug", "titleUk", "titleEn", "textUk", "textEn", "photoGallery", "videoUrl", "publicationDate", "attributes"],
        enums: {
            type: ["NEWS", "RESEARCH_PROJECT", "INNOVATION", "HISTORY", "BUILDING", "FOUNDERS", "FOR_PARENTS", "FOR_STUDENTS", "FOR_TEACHERS", "PATRIOTIC", "CLUBS", "SPORT", "METHODOLOGICAL", "PSYCHOLOGICAL", "ANTI_BULLYING", "QUALIFICATION", "CERTIFICATION", "INTELLECT", "GOVERNMENT"]
        }
    },
    pageSection: {
        label: "Секції сторінок",
        tableFields: ["type", "titleUk", "updatedAt"],
        allFields: ["type", "titleUk", "titleEn", "contentUk", "contentEn", "imagePhoto"],
        enums: {
            type: ["HOME_HERO", "PARENTS_INFO", "STUDENTS_INFO", "PSYCHOLOGICAL", "CERTIFICATION", "ANTI_BULLYING", "INNOVATIVE", "PROJECT_RESEARCH"]
        }
    },
    fAQ: {
        label: "FAQ (Питання-Відповіді)",
        tableFields: ["questionUk", "order"],
        allFields: ["questionUk", "questionEn", "answerUk", "answerEn", "order"]
    },
    externalLink: {
        label: "Зовнішні посилання",
        tableFields: ["titleUk", "pageKey", "order"],
        allFields: ["pageKey", "titleUk", "titleEn", "url", "order"],
        enums: {
            pageKey: ["PARENTS", "STUDENTS", "TEACHER_HELP", "PSYCHOLOGICAL", "BULLYING", "CERTIFICATION", "METHODOLOGICAL"]
        }
    },

    // --- ПЕРСОНАЛ ---
    person: {
        label: "Персонал / Люди",
        tableFields: ["fullNameUk", "type", "order"],
        allFields: ["fullNameUk", "fullNameEn", "positionUk", "positionEn", "descriptionUk", "descriptionEn", "photo", "email", "phone", "specializationUk", "specializationEn", "type", "order", "categoryId"],
        enums: {
            type: ["TEACHER", "PRINCIPALS", "COMMISSION_MEMBER", "FAMOUS_PERSON", "ALUMNI", "STUDENT_COUNCIL", "PSYCHOLOGIST"]
        }
    },
    personCategory: {
        label: "Категорії персоналу",
        tableFields: ["nameUk", "order"],
        allFields: ["nameUk", "nameEn", "order"]
    },

    // --- ДОКУМЕНТАЦІЯ ---
    documentReport: {
        label: "Документи та Звіти",
        tableFields: ["titleUk", "category"],
        allFields: ["category", "titleUk", "titleEn", "descriptionUk", "descriptionEn", "parentId"],
        enums: {
            category: ["REGULATORY", "FINANCIAL", "PUBLIC_INFO", "GENERAL"]
        }
    },
    fileAsset: {
        label: "Файли",
        tableFields: ["nameUk", "fileType", "reportId"],
        allFields: ["nameUk", "nameEn", "url", "fileType", "fileSize", "reportId"]
    },

    // --- ОСВІТА ТА VR ---
    discipline: {
        label: "Дисципліни",
        tableFields: ["name", "hasSubItems"],
        allFields: ["name", "nameEn", "color", "url", "hasSubItems"]
    },
    disciplineSubItem: {
        label: "Підпункти дисциплін",
        tableFields: ["name", "disciplineId"],
        allFields: ["name", "link", "disciplineId"]
    },
    location: {
        label: "VR Локації",
        tableFields: ["nameUk", "floor"],
        allFields: ["floor", "nameUk", "nameEn", "descriptionUk", "descriptionEn", "highlightsUk", "highlightsEn", "imagePhotos", "iconName"]
    },
    specialization: {
        label: "Профілі навчання",
        tableFields: ["id", "nameUk"],
        allFields: ["id", "emoji", "nameUk", "nameEn", "descriptionUk", "descriptionEn", "subjectsUk", "subjectsEn", "characteristicsUk", "characteristicsEn"]
    },
    testQuestion: {
        label: 'Тести (Профорієнтація)',
        tableFields: ['question', 'createdAt'],
        allFields: ['question', 'questionEn', 'options', 'optionsEn', 'specialization'],
    },

    // --- НАЛАШТУВАННЯ ТА ІНШЕ ---
    lyceumStats: {
        label: "Дані ліцею (Головна)",
        tableFields: ["name", "email"],
        allFields: ["name", "nameEn", "addressUk", "addressEn", "email", "phone", "logoPhoto", "quoteUk", "quoteEn", "teachingLanguage", "teachingLanguageEn", "specialization", "specializationEn", "anthemUrl", "teachersPhoto", "materialBasePhoto", "materialBaseDescriptionUk", "materialBaseDescriptionEn", "socialLinks", "studentsCount", "studentsCountReal", "teachersCount", "staffCount", "classesCount", "flexParticipants", "topScorersCount"]
    },
    clubs: {
        label: 'Клуби та гуртки',
        tableFields: ['nameUk', 'order', 'updatedAt'],
        allFields: ['nameUk', 'nameEn', 'descriptionUk', 'descriptionEn', 'order'],
    },
    workingArea: {
        label: 'Зони / Адреси роботи',
        tableFields: ['nameUk', 'order'],
        allFields: ['nameUk', 'nameEn', 'order'],
    },
    adminUser: {
        label: "Адміністратори",
        tableFields: ["username", "role", "isActive"],
        allFields: ["username", "password", "role", "isActive"],
    },
};