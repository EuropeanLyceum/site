-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RegulatoryDocuments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "content" TEXT,
    "url" TEXT,
    "photoUrls" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_RegulatoryDocuments" ("content", "createdAt", "id", "title", "updatedAt", "url") SELECT "content", "createdAt", "id", "title", "updatedAt", "url" FROM "RegulatoryDocuments";
DROP TABLE "RegulatoryDocuments";
ALTER TABLE "new_RegulatoryDocuments" RENAME TO "RegulatoryDocuments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
