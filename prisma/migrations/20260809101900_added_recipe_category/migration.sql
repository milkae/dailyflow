/*
  Warnings:

  - You are about to drop the column `category` on the `recipe` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "recipe_category_idx";

-- AlterTable
ALTER TABLE "recipe" DROP COLUMN "category";
