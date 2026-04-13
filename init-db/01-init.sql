CREATE TYPE "ContentType" AS ENUM (
  'NEWS', 'RESEARCH_PROJECT', 'INNOVATION', 'HISTORY', 'BUILDING',
  'FOUNDERS', 'FOR_PARENTS', 'FOR_STUDENTS', 'FOR_TEACHERS', 'PATRIOTIC',
  'CLUBS', 'SPORT', 'METHODOLOGICAL', 'PSYCHOLOGICAL', 'ANTI_BULLYING',
  'QUALIFICATION', 'CERTIFICATION', 'INTELLECT', 'GOVERNMENT'
);

CREATE TYPE "PersonType" AS ENUM (
  'TEACHER', 'PRINCIPALS', 'COMMISSION_MEMBER', 'FAMOUS_PERSON',
  'ALUMNI', 'STUDENT_COUNCIL', 'PSYCHOLOGIST'
);

CREATE TYPE "DocumentCategory" AS ENUM (
  'REGULATORY', 'FINANCIAL', 'PUBLIC_INFO', 'GENERAL'
);

CREATE TYPE "PageSectionType" AS ENUM (
  'HOME_HERO', 'PARENTS_INFO', 'STUDENTS_INFO', 'PSYCHOLOGICAL', 'QUALIFICATION',
  'CERTIFICATION', 'ANTI_BULLYING', 'INNOVATIVE', 'PROJECT_RESEARCH', 'TEACHERS_INFO'
);

CREATE TYPE "ExternalPageKey" AS ENUM (
  'PARENTS', 'STUDENTS', 'TEACHER_HELP', 'PSYCHOLOGICAL',
  'BULLYING', 'CERTIFICATION', 'METHODOLOGICAL', 'QUALIFICATION'
);

-- 1. Content
CREATE TABLE "Content" (
                           "id" SERIAL PRIMARY KEY,
                           "type" "ContentType" NOT NULL,
                           "slug" TEXT UNIQUE,
                           "titleUk" TEXT NOT NULL,
                           "titleEn" TEXT,
                           "textUk" TEXT,
                           "textEn" TEXT,
                           "photoGallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
                           "videoUrl" TEXT,
                           "publicationDate" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                           "attributes" JSONB,
                           "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                           "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PageSection
CREATE TABLE "PageSection" (
                               "id" SERIAL PRIMARY KEY,
                               "type" "PageSectionType" UNIQUE NOT NULL,
                               "titleUk" TEXT,
                               "titleEn" TEXT,
                               "contentUk" TEXT,
                               "contentEn" TEXT,
                               "imagePhoto" TEXT,
                               "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                               "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. ExternalLink
CREATE TABLE "ExternalLink" (
                                "id" SERIAL PRIMARY KEY,
                                "pageKey" "ExternalPageKey" NOT NULL,
                                "titleUk" TEXT NOT NULL,
                                "titleEn" TEXT,
                                "url" TEXT NOT NULL,
                                "order" INTEGER DEFAULT 0,
                                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. LyceumStats
CREATE TABLE "LyceumStats" (
                               "id" INTEGER PRIMARY KEY DEFAULT 1,
                               "name" TEXT NOT NULL,
                               "nameEn" TEXT NOT NULL,
                               "addressUk" TEXT NOT NULL,
                               "addressEn" TEXT NOT NULL,
                               "email" TEXT NOT NULL,
                               "phone" TEXT NOT NULL,
                               "logoPhoto" TEXT NOT NULL,
                               "quoteUk" TEXT NOT NULL,
                               "quoteEn" TEXT NOT NULL,
                               "teachingLanguage" TEXT NOT NULL,
                               "teachingLanguageEn" TEXT NOT NULL,
                               "specialization" TEXT NOT NULL,
                               "specializationEn" TEXT NOT NULL,
                               "anthemUrl" TEXT,
                               "teachersPhoto" TEXT NOT NULL,
                               "materialBasePhoto" TEXT NOT NULL,
                               "materialBaseDescriptionUk" TEXT NOT NULL,
                               "materialBaseDescriptionEn" TEXT NOT NULL,
                               "socialLinks" JSONB,
                               "studentsCount" INTEGER DEFAULT 0,
                               "studentsCountReal" INTEGER DEFAULT 0,
                               "teachersCount" INTEGER DEFAULT 0,
                               "staffCount" INTEGER DEFAULT 0,
                               "classesCount" INTEGER DEFAULT 0,
                               "flexParticipants" INTEGER DEFAULT 0,
                               "topScorersCount" INTEGER DEFAULT 0,
                               "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                               "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. FAQ
CREATE TABLE "FAQ" (
                       "id" SERIAL PRIMARY KEY,
                       "questionUk" TEXT NOT NULL,
                       "questionEn" TEXT,
                       "answerUk" TEXT NOT NULL,
                       "answerEn" TEXT,
                       "order" INTEGER DEFAULT 0,
                       "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                       "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. PersonCategory
CREATE TABLE "PersonCategory" (
                                  "id" SERIAL PRIMARY KEY,
                                  "nameUk" TEXT UNIQUE NOT NULL,
                                  "nameEn" TEXT,
                                  "order" INTEGER DEFAULT 0,
                                  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Person
CREATE TABLE "Person" (
                          "id" SERIAL PRIMARY KEY,
                          "fullNameUk" TEXT NOT NULL,
                          "fullNameEn" TEXT NOT NULL,
                          "positionUk" TEXT,
                          "positionEn" TEXT,
                          "descriptionUk" TEXT,
                          "descriptionEn" TEXT,
                          "photo" TEXT,
                          "email" TEXT,
                          "phone" TEXT,
                          "specializationUk" TEXT,
                          "specializationEn" TEXT,
                          "type" "PersonType" DEFAULT 'TEACHER',
                          "order" INTEGER DEFAULT 0,
                          "categoryId" INTEGER REFERENCES "PersonCategory"("id") ON DELETE SET NULL,
                          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. DocumentReport
CREATE TABLE "DocumentReport" (
                                  "id" SERIAL PRIMARY KEY,
                                  "category" "DocumentCategory" DEFAULT 'GENERAL',
                                  "titleUk" TEXT NOT NULL,
                                  "titleEn" TEXT NOT NULL,
                                  "descriptionUk" TEXT,
                                  "descriptionEn" TEXT,
                                  "parentId" INTEGER REFERENCES "DocumentReport"("id") ON DELETE CASCADE,
                                  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. FileAsset
CREATE TABLE "FileAsset" (
                             "id" SERIAL PRIMARY KEY,
                             "nameUk" TEXT NOT NULL,
                             "nameEn" TEXT NOT NULL,
                             "url" TEXT NOT NULL,
                             "fileType" TEXT,
                             "fileSize" TEXT,
                             "reportId" INTEGER REFERENCES "DocumentReport"("id") ON DELETE CASCADE,
                             "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                             "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Location
CREATE TABLE "Location" (
                            "id" TEXT PRIMARY KEY, -- cuid equivalent
                            "floor" TEXT,
                            "nameUk" TEXT NOT NULL,
                            "nameEn" TEXT NOT NULL,
                            "descriptionUk" TEXT NOT NULL,
                            "descriptionEn" TEXT NOT NULL,
                            "highlightsTextUk" TEXT NOT NULL,
                            "highlightsTextEn" TEXT NOT NULL,
                            "imagePhotos" TEXT[],
                            "iconName" TEXT,
                            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1. Створення таблиці Спеціалізацій (спочатку, бо на неї посилаються інші)
CREATE TABLE "Specialization" (
                                  "id" SERIAL PRIMARY KEY,
                                  "nameUk" TEXT NOT NULL,
                                  "nameEn" TEXT NOT NULL,
                                  "descriptionUk" TEXT NOT NULL,
                                  "descriptionEn" TEXT NOT NULL,
                                  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Створення таблиці Питань
CREATE TABLE "TestQuestion" (
                                "id" SERIAL PRIMARY KEY,
                                "question" TEXT NOT NULL,
                                "questionEn" TEXT,
                                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Створення таблиці Варіантів Відповідей
CREATE TABLE "TestOption" (
                              "id" SERIAL PRIMARY KEY,
                              "option" TEXT NOT NULL,
                              "optionEn" TEXT,
                              "specializationId" INTEGER NOT NULL,
                              "questionId" INTEGER NOT NULL,
                              "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Зовнішні ключі
                              CONSTRAINT "TestOption_specializationId_fkey"
                                  FOREIGN KEY ("specializationId")
                                      REFERENCES "Specialization" ("id")
                                      ON DELETE CASCADE ON UPDATE CASCADE,

                              CONSTRAINT "TestOption_questionId_fkey"
                                  FOREIGN KEY ("questionId")
                                      REFERENCES "TestQuestion" ("id")
                                      ON DELETE CASCADE ON UPDATE CASCADE
);

-- 13. Discipline
CREATE TABLE "Discipline" (
                              "id" SERIAL PRIMARY KEY,
                              "name" TEXT NOT NULL,
                              "nameEn" TEXT NOT NULL,
                              "color" TEXT NOT NULL,
                              "url" TEXT DEFAULT '#',
                              "hasSubItems" BOOLEAN DEFAULT FALSE,
                              "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                              "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. DisciplineSubItem
CREATE TABLE "DisciplineSubItem" (
                                     "id" SERIAL PRIMARY KEY,
                                     "name" TEXT NOT NULL,
                                     "link" TEXT NOT NULL,
                                     "disciplineId" INTEGER NOT NULL REFERENCES "Discipline"("id") ON DELETE CASCADE,
                                     "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                     "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. AdminUser
CREATE TABLE "AdminUser" (
                             "id" SERIAL PRIMARY KEY,
                             "username" TEXT UNIQUE NOT NULL,
                             "password" TEXT NOT NULL,
                             "role" TEXT DEFAULT 'admin',
                             "lastLogin" TIMESTAMP WITH TIME ZONE,
                             "isActive" BOOLEAN DEFAULT TRUE,
                             "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                             "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "Content_type_publicationDate_idx" ON "Content" ("type", "publicationDate");
CREATE INDEX "ExternalLink_pageKey_order_idx" ON "ExternalLink" ("pageKey", "order");
CREATE INDEX "FAQ_order_idx" ON "FAQ" ("order");
CREATE INDEX "Person_type_order_idx" ON "Person" ("type", "order");
CREATE INDEX "DocumentReport_category_createdAt_idx" ON "DocumentReport" ("category", "createdAt");
CREATE INDEX "FileAsset_reportId_idx" ON "FileAsset" ("reportId");
CREATE INDEX "Location_floor_idx" ON "Location" ("floor");

-- Function to handle the update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables (Example for Content, repeat for others as needed)
CREATE TRIGGER update_content_modtime BEFORE UPDATE ON "Content" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_person_modtime BEFORE UPDATE ON "Person" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
-- ... add for other tables as required

CREATE TABLE "Clubs" (
                         "id" SERIAL PRIMARY KEY,
                         "nameUk" TEXT NOT NULL,
                         "nameEn" TEXT NOT NULL,
                         "descriptionUk" TEXT NOT NULL,
                         "descriptionEn" TEXT NOT NULL,
                         "order" INTEGER DEFAULT 0,
                         "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                         "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "WorkingArea" (
                               "id" SERIAL PRIMARY KEY,
                               "nameUk" TEXT NOT NULL,
                               "nameEn" TEXT,
                               "order" INTEGER DEFAULT 0,
                               "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                               "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Додаємо тригери для updatedAt (якщо ти використовував функцію з попередньої відповіді)
CREATE TRIGGER update_clubs_modtime BEFORE UPDATE ON "Clubs" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_workingarea_modtime BEFORE UPDATE ON "WorkingArea" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();