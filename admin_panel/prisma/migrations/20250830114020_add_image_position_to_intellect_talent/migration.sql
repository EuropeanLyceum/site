-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_IntellectTalent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "heading" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photoUrls" TEXT NOT NULL,
    "imagePosition" TEXT NOT NULL DEFAULT 'center',
    "publicationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_IntellectTalent" ("createdAt", "description", "heading", "id", "photoUrls", "publicationDate", "updatedAt") SELECT "createdAt", "description", "heading", "id", "photoUrls", "publicationDate", "updatedAt" FROM "IntellectTalent";
DROP TABLE "IntellectTalent";
ALTER TABLE "new_IntellectTalent" RENAME TO "IntellectTalent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
