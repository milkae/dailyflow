import { revalidatePath, updateTag } from "next/cache";

const DASHBOARD_TAG = "dashboard";
const DASHBOARD_PATH = "/";

export function invalidateDashboard() {
  updateTag(DASHBOARD_TAG);
  revalidatePath(DASHBOARD_PATH);
}

export function invalidateDashboardAndPaths(paths: readonly string[]) {
  invalidateDashboard();

  for (const path of new Set(paths)) {
    if (path !== DASHBOARD_PATH) {
      revalidatePath(path);
    }
  }
}