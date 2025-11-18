-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TeacherCertification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "heading" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "text" TEXT,
    "url" TEXT,
    "linkText" TEXT,
    "photoUrls" TEXT NOT NULL DEFAULT '[]',
    "imagePosition" TEXT NOT NULL DEFAULT 'center',
    "order" INTEGER NOT NULL DEFAULT 0,
    "publicationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TeacherCertification" ("createdAt", "description", "heading", "id", "photoUrls", "publicationDate", "text", "updatedAt", "url") SELECT "createdAt", "description", "heading", "id", "photoUrls", "publicationDate", "text", "updatedAt", "url" FROM "TeacherCertification";
DROP TABLE "TeacherCertification";
ALTER TABLE "new_TeacherCertification" RENAME TO "TeacherCertification";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
