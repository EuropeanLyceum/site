-- CreateTable
CREATE TABLE "QualificationImprovement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accordionTitle" TEXT,
    "accordionContent" TEXT,
    "plainText" TEXT,
    "url" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
