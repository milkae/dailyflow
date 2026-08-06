export function getRecipeImageUrl(key: string | null) {
  if (!key) return null;
  if (key.startsWith("http")) return key;
  return `${process.env.NEXT_PUBLIC_AWS_S3_URL}${key}`;
}
