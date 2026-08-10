/*
  Warnings:

  - A unique constraint covering the columns `[userId,slug]` on the table `RecipeCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `RecipeCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RecipeCategory_slug_key";

-- AlterTable
ALTER TABLE "RecipeCategory" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "RecipeCategory_userId_idx" ON "RecipeCategory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeCategory_userId_slug_key" ON "RecipeCategory"("userId", "slug");

-- AddForeignKey
ALTER TABLE "RecipeCategory" ADD CONSTRAINT "RecipeCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
