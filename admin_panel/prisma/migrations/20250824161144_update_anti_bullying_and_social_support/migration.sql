-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AntiBullying" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "content" TEXT,
    "url" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AntiBullying" ("content", "createdAt", "id", "title", "updatedAt") SELECT "content", "createdAt", "id", "title", "updatedAt" FROM "AntiBullying";
DROP TABLE "AntiBullying";
ALTER TABLE "new_AntiBullying" RENAME TO "AntiBullying";
CREATE TABLE "new_SocialPsychologicalSupport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "content" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SocialPsychologicalSupport" ("content", "createdAt", "id", "title", "updatedAt") SELECT "content", "createdAt", "id", "title", "updatedAt" FROM "SocialPsychologicalSupport";
DROP TABLE "SocialPsychologicalSupport";
ALTER TABLE "new_SocialPsychologicalSupport" RENAME TO "SocialPsychologicalSupport";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
