import { Recipe } from "@/generated/prisma/browser";
import { NextRequest, NextResponse } from "next/server";
import { JSDOM } from "jsdom";
import { verifySession } from "@/lib/dal";
import { logError } from "@/lib/logger";

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

    return NextResponse.json(recipeData as Recipe);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    logError(error, "Recipe parsing error");
    return NextResponse.json(
      { error: "Failed to parse recipe" },
      { status: 500 },
    );
  }
}

function extractRecipe(dom: JSDOM, url: string) {
  const scripts = dom.window.document.querySelectorAll(
    'script[type="application/ld+json"]',
  );

  if (scripts.length) {
    try {
      const scriptArray = Array.from(scripts);
      for (let i = 0; i < scriptArray.length; i++) {
        const script = scriptArray[i];
        const parsed = JSON.parse(script.textContent);
        const recipe = findRecipeNode(parsed);
        if (recipe) {
          return {
            name: decodeHtmlEntities(recipe.name || ""),
            description: decodeHtmlEntities(recipe.description || ""),
            ingredients: Array.isArray(recipe.recipeIngredient)
              ? recipe.recipeIngredient
                  .map((i) => decodeHtmlEntities(i))
                  .join("\n")
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
            category: recipe.recipeCategory,
          } as Recipe;
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logError(error, "Recipe parser: Failed to parse schema");
    }
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
