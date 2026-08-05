import { Recipe } from "@/generated/prisma/client";

export const MAX_SIZE_BYTES = 5 * 1024 * 1024;
export const MIN_SIZE_BYTES = 1;
export const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
export const MAX_SIZE_MB = 5;

export type RecipeImage =
  | {
      type: "none";
    }
  | {
      type: "upload";
      file: File;
    }
  | {
      type: "external";
      url: string;
    }
  | {
      type: "existing";
      key: string;
    };

export interface FormRecipe extends Recipe {
  image: RecipeImage;
}
