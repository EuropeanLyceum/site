-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StudentGovernment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "heading" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photoUrls" TEXT NOT NULL,
    "imagePosition" TEXT NOT NULL DEFAULT 'center',
    "publicationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_StudentGovernment" ("createdAt", "description", "heading", "id", "photoUrls", "publicationDate", "updatedAt") SELECT "createdAt", "description", "heading", "id", "photoUrls", "publicationDate", "updatedAt" FROM "StudentGovernment";
DROP TABLE "StudentGovernment";
ALTER TABLE "new_StudentGovernment" RENAME TO "StudentGovernment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
