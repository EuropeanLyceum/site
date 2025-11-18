/*
  Warnings:

  - You are about to drop the column `accordionContent` on the `HelpTeacher` table. All the data in the column will be lost.
  - You are about to drop the column `accordionTitle` on the `HelpTeacher` table. All the data in the column will be lost.
  - You are about to drop the column `plainText` on the `HelpTeacher` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `HelpTeacher` table. All the data in the column will be lost.
  - Added the required column `content` to the `HelpTeacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `HelpTeacher` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HelpTeacher" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "text" TEXT,
    "link" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_HelpTeacher" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "HelpTeacher";
DROP TABLE "HelpTeacher";
ALTER TABLE "new_HelpTeacher" RENAME TO "HelpTeacher";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
