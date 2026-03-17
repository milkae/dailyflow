-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Habit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "frequency" TEXT NOT NULL DEFAULT 'DAILY',
    "frequencyConfig" JSONB,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Habit" ("createdAt", "description", "frequency", "id", "name") SELECT "createdAt", "description", "frequency", "id", "name" FROM "Habit";
DROP TABLE "Habit";
ALTER TABLE "new_Habit" RENAME TO "Habit";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
