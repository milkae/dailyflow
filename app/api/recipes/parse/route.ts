import { MealType } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { JSDOM } from "jsdom";
import { verifySession } from "@/lib/dal";
import { logError } from "@/lib/logger";

type RecipeCategorySlug = [
  "appetizer",
  "breakfast",
  "main-course",
  "side-dish",
  "soup",
  "salad",
  "dessert",
  "drink",
][number];

const MEAL_TYPE_ALIASES: Record<string, MealType[]> = {
  breakfast: ["BREAKFAST"],
  breakfasts: ["BREAKFAST"],

  brunch: ["BREAKFAST"],
  "breakfast & brunch": ["BREAKFAST"],

  lunch: ["LUNCH"],
  lunches: ["LUNCH"],

  dinner: ["DINNER"],
  dinners: ["DINNER"],
  "main course": ["DINNER"],

  snack: ["SNACK"],
  snacks: ["SNACK"],
};

const CATEGORY_ALIASES: Record<string, RecipeCategorySlug> = {
  // Main
  main: "main-course",
  "main course": "main-course",
  "main courses": "main-course",
  "main dish": "main-course",
  "main dishes": "main-course",
  entree: "main-course",
  entrees: "main-course",
  entrée: "main-course",
  entrées: "main-course",

  // Sides
  side: "side-dish",
  "side dish": "side-dish",
  "side dishes": "side-dish",
  sides: "side-dish",

  // Appetizers
  appetizer: "appetizer",
  appetizers: "appetizer",
  starter: "appetizer",
  starters: "appetizer",

  // Soup
  soup: "soup",
  soups: "soup",

  // Salad
  salad: "salad",
  salads: "salad",

  // Dessert
  dessert: "dessert",
  desserts: "dessert",
  sweet: "dessert",
  sweets: "dessert",

  // Drinks
  drink: "drink",
  drinks: "drink",
  beverage: "drink",
  beverages: "drink",

  // Breakfast
  breakfast: "breakfast",
  breakfasts: "breakfast",
  brunch: "breakfast",
  "breakfast & brunch": "breakfast",
};

export type ParsedRecipe = {
  name: string;
  description: string;
  ingredients: string;
  instructions: string;
  prepTime: number | null;
  cookTime: number | null;
  servings: number;
  imageUrl: string;
  sourceUrl: string;
  sourceCategory: string;
  categories: RecipeCategorySlug[];
  mealTypes: MealType[];
};

interface RecipeJsonLd {
  "@type": "Recipe" | string[];
  name?: string;
  description?: string;
  recipeIngredient?: string[];
  recipeInstructions?: (
    | string
    | { text?: string; itemListElement?: { text: string }[] }
  )[];
  prepTime?: string;
  cookTime?: string;
  recipeYield?: string | number;
  image?: string | { url: string } | (string | { url: string })[];
  recipeCategory?: string;
}

export async function POST(request: NextRequest) {
  await verifySession();

  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const urlObj = new URL(url);

    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return NextResponse.json(
        { error: "Only HTTP/HTTPS URLs are supported" },
        { status: 400 },
      );
    }

    const dom = await JSDOM.fromURL(url);
    const recipeData = extractRecipe(dom, url);

    if (!recipeData) {
      return NextResponse.json(
        { error: "Could not parse recipe from this URL" },
        { status: 400 },
      );
    }

    return NextResponse.json(recipeData as ParsedRecipe);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    logError(error, "Recipe parsing error");
    return NextResponse.json(
      { error: "Failed to parse recipe" },
      { status: 500 },
    );
  }
}

function extractRecipe(dom: JSDOM, url: string): ParsedRecipe | null {
  const scripts = dom.window.document.querySelectorAll(
    'script[type="application/ld+json"]',
  );

  if (!scripts.length) {
    return null;
  }

  try {
    const scriptArray = Array.from(scripts);

    for (const script of scriptArray) {
      const parsed = JSON.parse(script.textContent ?? "");
      const recipe = findRecipeNode(parsed);

      if (!recipe) {
        continue;
      }

      return {
        name: decodeHtmlEntities(recipe.name || ""),
        description: decodeHtmlEntities(recipe.description || ""),
        ingredients: Array.isArray(recipe.recipeIngredient)
          ? recipe.recipeIngredient.map((i) => decodeHtmlEntities(i)).join("\n")
          : decodeHtmlEntities(recipe.recipeIngredient || ""),
        instructions: parseRecipeInstructions(recipe.recipeInstructions),
        prepTime: parseDuration(recipe.prepTime),
        cookTime: parseDuration(recipe.cookTime),
        servings: parseServings(recipe.recipeYield),
        imageUrl: Array.isArray(recipe.image)
          ? (typeof recipe.image[0] === "string"
              ? recipe.image[0]
              : recipe.image[0]?.url) || ""
          : (typeof recipe.image === "string"
              ? recipe.image
              : recipe.image?.url) || "",
        sourceUrl: url,
        sourceCategory: recipe.recipeCategory || "",
        categories: normalizeRecipeCategories(recipe.recipeCategory),
        mealTypes: inferMealTypes(recipe.recipeCategory),
      };
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    logError(error, "Recipe parser: Failed to parse schema");
  }

  return null;
}

function isRecipeNode(node: unknown): node is RecipeJsonLd {
  if (!node || typeof node !== "object") return false;
  const obj = node as Record<string, unknown>;
  const type = obj["@type"];
  if (typeof type === "string" && type === "Recipe") return true;
  if (Array.isArray(type) && type.includes("Recipe")) return true;
  return false;
}

function findRecipeNode(node: unknown): RecipeJsonLd | null {
  if (!node) return null;

  if (isRecipeNode(node)) return node;

  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findRecipeNode(item);
      if (found) return found;
    }
    return null;
  }

  if (typeof node === "object") {
    const obj = node as Record<string, unknown>;
    if (obj["@graph"] && Array.isArray(obj["@graph"])) {
      return findRecipeNode(obj["@graph"]);
    }
    for (const key in obj) {
      const found = findRecipeNode(obj[key]);
      if (found) return found;
    }
  }

  return null;
}

function parseDuration(duration?: string): number | null {
  if (!duration) return null;

  const hoursMatch = duration.match(/(\d+)H/);
  const minutesMatch = duration.match(/(\d+)M/);
  const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;

  return hours * 60 + minutes;
}

function parseServings(yieldValue?: unknown): number {
  if (typeof yieldValue === "number") return yieldValue;
  if (typeof yieldValue === "string") {
    const num = parseInt(yieldValue);
    return isNaN(num) ? 4 : num;
  }
  return 4;
}

function parseRecipeInstructions(
  instructions?: (
    | string
    | { text?: string; itemListElement?: { text: string }[] }
  )[],
) {
  return Array.isArray(instructions)
    ? instructions
        .map((i) => {
          if (typeof i === "string") {
            return decodeHtmlEntities(i);
          }
          if (i.itemListElement) {
            return i.itemListElement
              .map((step) => decodeHtmlEntities(step.text || ""))
              .filter(Boolean)
              .join("\n");
          }
          return decodeHtmlEntities(i.text || "");
        })
        .filter(Boolean)
        .join("\n")
    : decodeHtmlEntities(instructions || "");
}

function decodeHtmlEntities(text: string): string {
  const textarea = new JSDOM("").window.document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

function normalizeCategoryValue(value: unknown): string[] {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(/[;,|]/)
    .map((value) => value.trim().toLowerCase().replace(/\s+/g, " "))
    .filter(Boolean);
}

export function normalizeRecipeCategories(
  value: unknown,
): RecipeCategorySlug[] {
  const values = Array.isArray(value)
    ? value.flatMap(normalizeCategoryValue)
    : normalizeCategoryValue(value);

  const categories = new Set<RecipeCategorySlug>();

  for (const value of values) {
    const category = CATEGORY_ALIASES[value];

    if (category) {
      categories.add(category);
    }
  }

  return [...categories];
}

export function inferMealTypes(recipeCategory: unknown): MealType[] {
  const values = Array.isArray(recipeCategory)
    ? recipeCategory.flatMap(normalizeCategoryValue)
    : normalizeCategoryValue(recipeCategory);

  const mealTypes = new Set<MealType>();

  for (const value of values) {
    const types = MEAL_TYPE_ALIASES[value];

    if (types) {
      types.forEach((type) => mealTypes.add(type));
    }
  }

  return [...mealTypes];
}
