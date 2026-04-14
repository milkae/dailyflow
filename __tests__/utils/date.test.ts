// @vitest-environment node

import { describe, it, expect } from "vitest";
import { normalizeDate } from "@/utils/date";

describe("normalizeDate", () => {
  it("should normalize to start of day", () => {
    const date = new Date("2024-04-11T15:30:45.123Z");
    const result = normalizeDate(date);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });
});
