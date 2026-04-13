/*
  Warnings:

  - You are about to drop the `Habit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Meal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recipe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Entry" DROP CONSTRAINT "Entry_habitId_fkey";

-- DropForeignKey
ALTER TABLE "Habit" DROP CONSTRAINT "Habit_userId_fkey";

-- DropForeignKey
ALTER TABLE "Meal" DROP CONSTRAINT "Meal_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "Meal" DROP CONSTRAINT "Meal_userId_fkey";

-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_userId_fkey";

-- DropTable
DROP TABLE "Habit";

-- DropTable
DROP TABLE "Meal";

-- DropTable
DROP TABLE "Recipe";

-- CreateTable
CREATE TABLE "habit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "frequency" "Frequency" NOT NULL DEFAULT 'DAILY',
    "frequencyConfig" JSONB,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "habit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "MealType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "recipeId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ingredients" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "prepTime" INTEGER,
    "cookTime" INTEGER,
    "servings" INTEGER NOT NULL DEFAULT 4,
    "imageUrl" TEXT,
    "sourceUrl" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "recipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "habit_userId_idx" ON "habit"("userId");

-- CreateIndex
CREATE INDEX "meal_date_idx" ON "meal"("date");

-- CreateIndex
CREATE INDEX "meal_userId_idx" ON "meal"("userId");

-- CreateIndex
CREATE INDEX "meal_recipeId_idx" ON "meal"("recipeId");

-- CreateIndex
CREATE INDEX "recipe_userId_idx" ON "recipe"("userId");

-- CreateIndex
CREATE INDEX "recipe_category_idx" ON "recipe"("category");

-- CreateIndex
CREATE INDEX "Entry_date_idx" ON "Entry"("date");

-- AddForeignKey
ALTER TABLE "habit" ADD CONSTRAINT "habit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal" ADD CONSTRAINT "meal_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal" ADD CONSTRAINT "meal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
