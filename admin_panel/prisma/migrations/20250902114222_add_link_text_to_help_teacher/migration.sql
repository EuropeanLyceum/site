-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HelpTeacher" (
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
INSERT INTO "new_HelpTeacher" ("content", "createdAt", "id", "link", "order", "text", "title", "updatedAt") SELECT "content", "createdAt", "id", "link", "order", "text", "title", "updatedAt" FROM "HelpTeacher";
DROP TABLE "HelpTeacher";
ALTER TABLE "new_HelpTeacher" RENAME TO "HelpTeacher";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
