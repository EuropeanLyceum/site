-- 1. Створення ENUM типів (безпечно)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ContentType') THEN
CREATE TYPE "ContentType" AS ENUM (
            'NEWS', 'EVENT', 'PROJECT', 'RESEARCH', 'INNOVATION', 'HISTORY',
            'FOR_PARENTS', 'FOR_STUDENTS', 'FOR_TEACHERS', 'VISITING_CARD',
            'PATRIOTIC', 'CLUBS', 'SPORT', 'METHODOLOGICAL', 'PSYCHOLOGICAL',
            'ANTI_BULLYING', 'QUALIFICATION', 'CERTIFICATION'
        );
END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PersonType') THEN
CREATE TYPE "PersonType" AS ENUM (
            'TEACHER', 'ADMINISTRATION', 'COMMISSION_MEMBER', 'FAMOUS_PERSON',
            'ALUMNI', 'STUDENT_COUNCIL', 'PSYCHOLOGIST'
        );
END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'DocumentCategory') THEN
CREATE TYPE "DocumentCategory" AS ENUM (
            'REGULATORY', 'FINANCIAL', 'PUBLIC_INFO', 'GENERAL'
        );
END IF;
END $$;

-- 2. Таблиці для КОНТЕНТУ
CREATE TABLE IF NOT EXISTS "Content" (
                                         "id" SERIAL PRIMARY KEY,
                                         "type" "ContentType" NOT NULL,
                                         "slug" TEXT NOT NULL UNIQUE,
                                         "titleUk" TEXT NOT NULL,
                                         "titleEn" TEXT,
                                         "subtitleUk" TEXT,
                                         "subtitleEn" TEXT,
                                         "mainPhoto" TEXT,
                                         "photoGallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
                                         "videoUrl" TEXT,
                                         "imagePosition" TEXT DEFAULT 'center',
                                         "publicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "attributes" JSONB DEFAULT '{}',
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
    );

CREATE TABLE IF NOT EXISTS "ContentSection" (
                                                "id" SERIAL PRIMARY KEY,
                                                "contentId" INTEGER NOT NULL REFERENCES "Content"("id") ON DELETE CASCADE,
    "visualType" TEXT DEFAULT 'TEXT',
    "titleUk" TEXT,
    "titleEn" TEXT,
    "bodyUk" TEXT,
    "bodyEn" TEXT,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0
    );

-- 3. Таблиці для СТАТИКИ та НАЛАШТУВАНЬ
CREATE TABLE IF NOT EXISTS "PageSection" (
                                             "id" TEXT PRIMARY KEY,
                                             "titleUk" TEXT,
                                             "titleEn" TEXT,
                                             "contentUk" TEXT,
                                             "contentEn" TEXT,
                                             "imageUrl" TEXT,
                                             "updatedAt" TIMESTAMP(3) NOT NULL
    );

CREATE TABLE IF NOT EXISTS "ExternalLink" (
                                              "id" SERIAL PRIMARY KEY,
                                              "pageKey" TEXT NOT NULL,
                                              "titleUk" TEXT NOT NULL,
                                              "titleEn" TEXT,
                                              "url" TEXT NOT NULL,
                                              "order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "LyceumStats" (
                                             "id" INTEGER NOT NULL PRIMARY KEY DEFAULT 1,
                                             "name" TEXT NOT NULL,
                                             "nameEn" TEXT NOT NULL,
                                             "addressUk" TEXT NOT NULL,
                                             "addressEn" TEXT,
                                             "email" TEXT NOT NULL,
                                             "phone" TEXT NOT NULL,

    -- Нові поля
                                             "logoUrl" TEXT,
                                             "quoteUk" TEXT,
                                             "quoteEn" TEXT,
                                             "teachingLanguages" TEXT[] DEFAULT ARRAY['Українська']::TEXT[],
                                             "specializationsList" TEXT[] DEFAULT ARRAY[]::TEXT[],
                                             "anthemUrl" TEXT,

                                             "socialLinks" JSONB,
                                             "studentsCount" INTEGER NOT NULL DEFAULT 0,
                                             "teachersCount" INTEGER NOT NULL DEFAULT 0,
                                             "staffCount" INTEGER NOT NULL DEFAULT 0,
                                             "classesCount" INTEGER NOT NULL DEFAULT 0,
                                             "flexParticipants" INTEGER NOT NULL DEFAULT 0,
                                             "topScorersCount" INTEGER NOT NULL DEFAULT 0,
                                             "updatedAt" TIMESTAMP(3) NOT NULL
    );

CREATE TABLE IF NOT EXISTS "FAQ" (
                                     "id" SERIAL PRIMARY KEY,
                                     "questionUk" TEXT NOT NULL,
                                     "questionEn" TEXT,
                                     "answerUk" TEXT NOT NULL,
                                     "answerEn" TEXT,
                                     "category" TEXT DEFAULT 'GENERAL',
                                     "order" INTEGER NOT NULL DEFAULT 0,
                                     "isPublished" BOOLEAN NOT NULL DEFAULT true,
                                     "updatedAt" TIMESTAMP(3) NOT NULL
    );

-- 4. Таблиці для ПЕРСОНАЛУ
CREATE TABLE IF NOT EXISTS "PersonCategory" (
                                                "id" SERIAL PRIMARY KEY,
                                                "nameUk" TEXT NOT NULL UNIQUE,
                                                "nameEn" TEXT
);

CREATE TABLE IF NOT EXISTS "Person" (
                                        "id" SERIAL PRIMARY KEY,
                                        "fullNameUk" TEXT NOT NULL,
                                        "fullNameEn" TEXT,
                                        "positionUk" TEXT NOT NULL,
                                        "positionEn" TEXT,
                                        "descriptionUk" TEXT,
                                        "descriptionEn" TEXT,
                                        "photoUrl" TEXT,
                                        "email" TEXT,
                                        "phone" TEXT,
                                        "specializationUk" TEXT,
                                        "specializationEn" TEXT,
                                        "quoteUk" TEXT,
                                        "quoteEn" TEXT,
                                        "nicknameUk" TEXT,
                                        "nicknameEn" TEXT,
                                        "type" "PersonType" NOT NULL DEFAULT 'TEACHER',
                                        "order" INTEGER NOT NULL DEFAULT 0,
                                        "categoryId" INTEGER REFERENCES "PersonCategory"("id") ON DELETE SET NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
    );

-- 5. Таблиці для ДОКУМЕНТІВ
CREATE TABLE IF NOT EXISTS "DocumentReport" (
                                                "id" SERIAL PRIMARY KEY,
                                                "category" "DocumentCategory" NOT NULL DEFAULT 'GENERAL',
                                                "titleUk" TEXT NOT NULL,
                                                "titleEn" TEXT,
                                                "descriptionUk" TEXT,
                                                "descriptionEn" TEXT,
                                                "year" INTEGER,
                                                "parentId" INTEGER REFERENCES "DocumentReport"("id") ON DELETE SET NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
    );

CREATE TABLE IF NOT EXISTS "FileAsset" (
                                           "id" SERIAL PRIMARY KEY,
                                           "nameUk" TEXT NOT NULL,
                                           "nameEn" TEXT,
                                           "url" TEXT NOT NULL,
                                           "fileType" TEXT,
                                           "fileSize" TEXT,
                                           "reportId" INTEGER REFERENCES "DocumentReport"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

-- 6. Таблиці для ЛОКАЦІЙ та ТЕСТІВ
CREATE TABLE IF NOT EXISTS "Location" (
                                          "id" TEXT PRIMARY KEY,
                                          "slug" TEXT NOT NULL UNIQUE,
                                          "floor" TEXT,
                                          "nameUk" TEXT NOT NULL,
                                          "nameEn" TEXT NOT NULL,
                                          "descriptionUk" TEXT NOT NULL,
                                          "descriptionEn" TEXT NOT NULL,
                                          "highlightsUk" TEXT[] DEFAULT ARRAY[]::TEXT[],
                                          "highlightsEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
                                          "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
                                          "iconName" TEXT NOT NULL,
                                          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
    );

-- Таблиця зв'язків для Location (Many-to-Many)
CREATE TABLE IF NOT EXISTS "_LocationConnections" (
                                                      "A" TEXT NOT NULL REFERENCES "Location"("id") ON DELETE CASCADE,
    "B" TEXT NOT NULL REFERENCES "Location"("id") ON DELETE CASCADE
    );
CREATE UNIQUE INDEX IF NOT EXISTS "_LocationConnections_AB_unique" ON "_LocationConnections"("A", "B");
CREATE INDEX IF NOT EXISTS "_LocationConnections_B_index" ON "_LocationConnections"("B");

CREATE TABLE IF NOT EXISTS "TestQuestion" (
                                              "id" SERIAL PRIMARY KEY,
                                              "question" JSONB NOT NULL,
                                              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS "TestOption" (
                                            "id" SERIAL PRIMARY KEY,
                                            "questionId" INTEGER NOT NULL REFERENCES "TestQuestion"("id") ON DELETE CASCADE,
    "text" JSONB NOT NULL,
    "type" TEXT NOT NULL
    );

CREATE TABLE IF NOT EXISTS "Specialization" (
                                                "id" TEXT PRIMARY KEY,
                                                "emoji" TEXT NOT NULL,
                                                "nameUk" TEXT NOT NULL,
                                                "nameEn" TEXT NOT NULL,
                                                "descriptionUk" TEXT NOT NULL,
                                                "descriptionEn" TEXT NOT NULL,
                                                "subjectsUk" TEXT[] DEFAULT ARRAY[]::TEXT[],
                                                "subjectsEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
                                                "characteristicsUk" TEXT[] DEFAULT ARRAY[]::TEXT[],
                                                "characteristicsEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
                                                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

-- 7. АДМІН
CREATE TABLE IF NOT EXISTS "AdminUser" (
                                           "id" SERIAL PRIMARY KEY,
                                           "username" TEXT NOT NULL UNIQUE,
                                           "password" TEXT NOT NULL,
                                           "role" TEXT NOT NULL DEFAULT 'admin',
                                           "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true
    );