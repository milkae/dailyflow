import prisma from "@/lib/prisma";
import { Pool } from "pg";
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });

async function main() {
  const categories = [
    { slug: "breakfast", name: "Breakfast" },
    { slug: "appetizer", name: "Appetizer" },
    { slug: "soup", name: "Soup" },
    { slug: "salad", name: "Salad" },
    { slug: "main-course", name: "Main Course" },
    { slug: "side-dish", name: "Side Dish" },
    { slug: "dessert", name: "Dessert" },
    { slug: "drink", name: "Drink" },
  ];

  const users = await prisma.user.findMany();

  for (const user of users) {
    for (const category of categories) {
      await prisma.recipeCategory.upsert({
        where: { userId_slug: { slug: category.slug, userId: user.id } },
        update: { name: category.name },
        create: { ...category, userId: user.id },
      });
    }
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
