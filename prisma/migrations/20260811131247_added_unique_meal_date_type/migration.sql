/*
  Warnings:

  - A unique constraint covering the columns `[userId,date,type]` on the table `meal` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "meal_userId_date_type_key" ON "meal"("userId", "date", "type");
