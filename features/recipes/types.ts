export const MAX_SIZE_BYTES = 5 * 1024 * 1024;
export const MIN_SIZE_BYTES = 1;
export const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
export const MAX_SIZE_MB = 5;

export interface ParsedRecipe {
  name: string;
  description?: string;
  ingredients: string;
  instructions: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  category?: string;
  sourceUrl: string;
  imageUrl?: string;
}
