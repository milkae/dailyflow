-- AlterTable
ALTER TABLE "recipe" ADD COLUMN     "mealTypes" "MealType"[];

-- CreateTable
CREATE TABLE "RecipeCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RecipeCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RecipeToRecipeCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RecipeToRecipeCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecipeCategory_slug_key" ON "RecipeCategory"("slug");

-- CreateIndex
CREATE INDEX "_RecipeToRecipeCategory_B_index" ON "_RecipeToRecipeCategory"("B");

-- AddForeignKey
ALTER TABLE "_RecipeToRecipeCategory" ADD CONSTRAINT "_RecipeToRecipeCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipeToRecipeCategory" ADD CONSTRAINT "_RecipeToRecipeCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "RecipeCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
