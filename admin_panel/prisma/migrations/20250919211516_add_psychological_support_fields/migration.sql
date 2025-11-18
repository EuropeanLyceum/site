-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PsychologicalSupport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "content" TEXT,
    "text" TEXT,
    "link" TEXT,
    "linkText" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PsychologicalSupport" ("content", "createdAt", "id", "order", "title", "updatedAt") SELECT "content", "createdAt", "id", "order", "title", "updatedAt" FROM "PsychologicalSupport";
DROP TABLE "PsychologicalSupport";
ALTER TABLE "new_PsychologicalSupport" RENAME TO "PsychologicalSupport";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
