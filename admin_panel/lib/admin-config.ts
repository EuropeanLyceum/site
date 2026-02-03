export const FIELD_LABELS: Record<string, string> = {
    // Системні
    id: "ID",
    createdAt: "Дата створення",
    updatedAt: "Останнє оновлення",
    order: "Порядок (пріоритет)",
    slug: "URL-шлях (slug)",
    isPublished: "Опубліковано",
    isFeatured: "Важливе (на головну)",

    // Content (Універсальний контент)
    type: "Тип контенту",
    titleUk: "Заголовок (UA)",
    titleEn: "Заголовок (EN)",
    subtitleUk: "Підзаголовок (UA)",
    subtitleEn: "Підзаголовок (EN)",
    mainPhoto: "Головне фото",
    photoGallery: "Галерея фото",
    videoUrl: "YouTube Відео",
    imagePosition: "Позиція фото",
    publicationDate: "Дата публікації",
    attributes: "Дод. атрибути (JSON)",
    metaTitle: "SEO Заголовок",
    metaDescription: "SEO Опис",

    // ContentSection (Блоки статті)
    visualType: "Тип блоку",
    bodyUk: "Текст блоку (UA)",
    bodyEn: "Текст блоку (EN)",
    photos: "Фото блоку",

    // PageSection (Статика)
    contentUk: "Текст / HTML (UA)",
    contentEn: "Текст / HTML (EN)",
    imageUrl: "Банер / Фото (URL)",

    // LyceumStats (Статистика та налаштування)
    name: "Назва ліцею (UA)",
    nameEn: "Назва ліцею (EN)",
    addressUk: "Адреса (UA)",
    addressEn: "Адреса (EN)",
    logoUrl: "Логотип (URL)",
    quoteUk: "Девіз / Цитата (UA)",
    quoteEn: "Девіз / Цитата (EN)",
    teachingLanguages: "Мови викладання",
    specializationsList: "Список спеціалізацій",
    anthemUrl: "Гімн (URL/YouTube)",
    studentsCount: "К-ть учнів",
    teachersCount: "К-ть вчителів",
    staffCount: "Персонал",
    classesCount: "К-ть класів",
    flexParticipants: "Учасники FLEX",
    topScorersCount: "200-бальники",
    socialLinks: "Соцмережі (JSON)",

    // Person & Category
    fullNameUk: "ПІБ (UA)",
    fullNameEn: "ПІБ (EN)",
    positionUk: "Посада (UA)",
    positionEn: "Посада (EN)",
    descriptionUk: "Біографія (UA)",
    descriptionEn: "Біографія (EN)",
    photoUrl: "Фото (URL)",
    specializationUk: "Спеціалізація (UA)",
    quoteUk: "Цитата/Кредо",
    nicknameUk: "Псевдонім / Нік",
    categoryId: "Категорія (кафедра)",

    // FAQ
    questionUk: "Питання (UA)",
    questionEn: "Питання (EN)",
    answerUk: "Відповідь (UA)",
    answerEn: "Відповідь (EN)",

    // Location (VR)
    floor: "Поверх",
    highlightsUk: "Особливості (список)",
    imageUrls: "Фото (360/звичайні)",
    iconName: "ID іконки",

    // Specialization (Профілі)
    emoji: "Емодзі",
    subjectsUk: "Профільні предмети",
    characteristicsUk: "Характеристики",

    // Documents
    category: "Категорія",
    year: "Рік",
    fileType: "Формат",
    fileSize: "Розмір",
    parentId: "Батьківська папка"
};

export const ADMIN_MODELS = {
    content: {
        label: 'Контент (Новини, Статті)',
        tableFields: ['titleUk', 'type', 'publicationDate', 'isPublished'],
        allFields: ['type', 'slug', 'titleUk', 'titleEn', 'subtitleUk', 'subtitleEn', 'mainPhoto', 'imagePosition', 'publicationDate', 'isPublished', 'isFeatured', 'order', 'videoUrl', 'metaTitle', 'metaDescription'],
        enums: {
            type: ['NEWS', 'EVENT', 'PROJECT', 'RESEARCH', 'INNOVATION', 'HISTORY', 'FOR_PARENTS', 'FOR_STUDENTS', 'FOR_TEACHERS', 'VISITING_CARD', 'PATRIOTIC', 'CLUBS', 'SPORT', 'METHODOLOGICAL', 'PSYCHOLOGICAL', 'ANTI_BULLYING', 'QUALIFICATION', 'CERTIFICATION'],
            imagePosition: ['center', 'left', 'right', 'background']
        }
    },
    pageSection: {
        label: 'Статичні секції',
        tableFields: ['id', 'titleUk'],
        allFields: ['id', 'titleUk', 'titleEn', 'contentUk', 'contentEn', 'imageUrl'],
    },
    person: {
        label: 'Команда та учні',
        tableFields: ['fullNameUk', 'positionUk', 'type'],
        allFields: ['type', 'categoryId', 'fullNameUk', 'fullNameEn', 'positionUk', 'positionEn', 'photoUrl', 'email', 'phone', 'specializationUk', 'quoteUk', 'descriptionUk', 'order'],
        enums: {
            type: ['TEACHER', 'ADMINISTRATION', 'COMMISSION_MEMBER', 'FAMOUS_PERSON', 'ALUMNI', 'STUDENT_COUNCIL', 'PSYCHOLOGIST']
        }
    },
    personCategory: {
        label: 'Кафедри / Категорії',
        tableFields: ['nameUk'],
        allFields: ['nameUk', 'nameEn'],
    },
    documentReport: {
        label: 'Документи (Папки)',
        tableFields: ['titleUk', 'category', 'year'],
        allFields: ['category', 'titleUk', 'titleEn', 'year', 'parentId', 'descriptionUk', 'order'],
        enums: {
            category: ['REGULATORY', 'FINANCIAL', 'PUBLIC_INFO', 'GENERAL']
        }
    },
    fileAsset: {
        label: 'Файли',
        tableFields: ['nameUk', 'fileType', 'reportId'],
        allFields: ['nameUk', 'nameEn', 'url', 'reportId', 'fileType', 'fileSize'],
    },
    lyceumStats: {
        label: 'Налаштування ліцею',
        tableFields: ['name', 'updatedAt'],
        allFields: ['name', 'nameEn', 'logoUrl', 'addressUk', 'addressEn', 'email', 'phone', 'quoteUk', 'quoteEn', 'anthemUrl', 'teachingLanguages', 'specializationsList', 'studentsCount', 'teachersCount', 'staffCount', 'classesCount', 'flexParticipants', 'topScorersCount', 'socialLinks'],
    },
    faq: {
        label: 'FAQ (Питання/Відповіді)',
        tableFields: ['questionUk', 'category', 'isPublished'],
        allFields: ['questionUk', 'questionEn', 'answerUk', 'answerEn', 'category', 'order', 'isPublished'],
    },
    location: {
        label: 'VR Локації (Карта)',
        tableFields: ['nameUk', 'slug', 'floor'],
        allFields: ['slug', 'floor', 'nameUk', 'nameEn', 'descriptionUk', 'descriptionEn', 'highlightsUk', 'highlightsEn', 'imageUrls', 'iconName'],
    },
    specialization: {
        label: 'Профілі навчання',
        tableFields: ['id', 'nameUk', 'emoji'],
        allFields: ['id', 'emoji', 'nameUk', 'nameEn', 'descriptionUk', 'descriptionEn', 'subjectsUk', 'characteristicsUk'],
    },
    externalLink: {
        label: 'Зовнішні посилання',
        tableFields: ['titleUk', 'pageKey'],
        allFields: ['pageKey', 'titleUk', 'titleEn', 'url', 'order'],
    }
};