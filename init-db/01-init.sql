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
                           "type" "ContentType",
                           "slug" TEXT UNIQUE,
                           "titleUk" TEXT,
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
                               "type" "PageSectionType" UNIQUE,
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
                                "pageKey" "ExternalPageKey",
                                "titleUk" TEXT,
                                "titleEn" TEXT,
                                "url" TEXT,
                                "order" INTEGER DEFAULT 0,
                                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. LyceumStats
CREATE TABLE "LyceumStats" (
                               "id" INTEGER PRIMARY KEY DEFAULT 1,
                               "name" TEXT NOT NULL,
                               "nameEn" TEXT NOT NULL,
                               "addressUk" TEXT,
                               "addressEn" TEXT,
                               "email" TEXT,
                               "phone" TEXT,
                               "logoPhoto" TEXT,
                               "quoteUk" TEXT,
                               "quoteEn" TEXT,
                               "teachingLanguage" TEXT,
                               "teachingLanguageEn" TEXT,
                               "specialization" TEXT,
                               "specializationEn" TEXT,
                               "anthemUrl" TEXT,
                               "teachersPhoto" TEXT,
                               "materialBasePhoto" TEXT,
                               "materialBaseDescriptionUk" TEXT,
                               "materialBaseDescriptionEn" TEXT,
                               "socialLinks" JSONB,
                               "studentsCount" INTEGER DEFAULT 0,
                               "studentsCountReal" INTEGER DEFAULT 0,
                               "teachersCount" INTEGER DEFAULT 0,
                               "staffCount" INTEGER DEFAULT 0,
                               "classesCount" INTEGER DEFAULT 0,
                               "flexParticipantsCount" INTEGER DEFAULT 0,
                               "topScorersCount" INTEGER DEFAULT 0,
                               "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                               "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. FAQ
CREATE TABLE "FAQ" (
                       "id" SERIAL PRIMARY KEY,
                       "questionUk" TEXT,
                       "questionEn" TEXT,
                       "answerUk" TEXT,
                       "answerEn" TEXT,
                       "order" INTEGER DEFAULT 0,
                       "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                       "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. PersonCategory
CREATE TABLE "PersonCategory" (
                                  "id" SERIAL PRIMARY KEY,
                                  "nameUk" TEXT UNIQUE NOT NULL,
                                  "nameEn" TEXT NOT NULL,
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
                                  "titleUk" TEXT,
                                  "titleEn" TEXT,
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
                             "url" TEXT,
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
                            "descriptionUk" TEXT,
                            "descriptionEn" TEXT,
                            "highlightsTextUk" TEXT,
                            "highlightsTextEn" TEXT,
                            "imagePhotos" TEXT[],
                            "iconName" TEXT DEFAULT 'MeetingRoom',
                            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Створення таблиці Спеціалізацій (спочатку, бо на неї посилаються інші)
CREATE TABLE "Specialization" (
                                  "id" SERIAL PRIMARY KEY,
                                  "nameUk" TEXT NOT NULL,
                                  "nameEn" TEXT NOT NULL,
                                  "descriptionUk" TEXT,
                                  "descriptionEn" TEXT,
                                  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Створення таблиці Питань
CREATE TABLE "TestQuestion" (
                                "id" SERIAL PRIMARY KEY,
                                "question" TEXT,
                                "questionEn" TEXT,
                                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Створення таблиці Варіантів Відповідей
CREATE TABLE "TestOption" (
                              "id" SERIAL PRIMARY KEY,
                              "option" TEXT,
                              "optionEn" TEXT,
                              "specializationId" INTEGER,
                              "questionId" INTEGER,
                              "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

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

-- 14. Discipline
CREATE TABLE "Discipline" (
                              "id" SERIAL PRIMARY KEY,
                              "name" TEXT NOT NULL,
                              "nameEn" TEXT NOT NULL,
                              "color" TEXT,
                              "url" TEXT DEFAULT '#',
                              "hasSubItems" BOOLEAN DEFAULT FALSE,
                              "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                              "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. DisciplineSubItem
CREATE TABLE "DisciplineSubItem" (
                                     "id" SERIAL PRIMARY KEY,
                                     "name" TEXT NOT NULL,
                                     "link" TEXT,
                                     "disciplineId" INTEGER REFERENCES "Discipline"("id") ON DELETE CASCADE,
                                     "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                     "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. AdminUser
CREATE TABLE "AdminUser" (
                             "id" SERIAL PRIMARY KEY,
                             "username" TEXT UNIQUE NOT NULL,
                             "password" TEXT,
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

-- Apply to tables
CREATE TRIGGER update_content_modtime BEFORE UPDATE ON "Content" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_person_modtime BEFORE UPDATE ON "Person" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TABLE "Clubs" (
                         "id" SERIAL PRIMARY KEY,
                         "nameUk" TEXT NOT NULL,
                         "nameEn" TEXT NOT NULL,
                         "descriptionUk" TEXT,
                         "descriptionEn" TEXT,
                         "order" INTEGER DEFAULT 0,
                         "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                         "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "WorkingArea" (
                               "id" SERIAL PRIMARY KEY,
                               "nameUk" TEXT NOT NULL,
                               "nameEn" TEXT NOT NULL,
                               "order" INTEGER DEFAULT 0,
                               "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                               "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Додаємо тригери для updatedAt
CREATE TRIGGER update_clubs_modtime BEFORE UPDATE ON "Clubs" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_workingarea_modtime BEFORE UPDATE ON "WorkingArea" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();