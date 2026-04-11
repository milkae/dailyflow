export function logError(error: Error, context: string) {
  if (process.env.NODE_ENV === "development") {
    console.error(`[${context}]`, error);
  } else {
    // Log to a monitoring service
  }
}
