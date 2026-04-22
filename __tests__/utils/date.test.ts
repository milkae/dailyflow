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
    expect(result.getMilliseconds()).toBe(0);
  });

  it("should preserve date values", () => {
    const date = new Date("2024-04-11T15:30:45.123Z");
    const result = normalizeDate(date);
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(3); // April (0-indexed)
    expect(result.getDate()).toBe(11);
  });

  it("should handle different timezones consistently", () => {
    const date1 = new Date("2024-04-11T00:00:00+05:00"); // UTC+5
    const date2 = new Date("2024-04-10T19:00:00Z"); // UTC, same moment

    const result1 = normalizeDate(date1);
    const result2 = normalizeDate(date2);

    expect(result1.getTime()).toBe(result2.getTime());
  });

  it("should handle leap year dates", () => {
    const leapDate = new Date("2024-02-29T12:00:00Z");
    const result = normalizeDate(leapDate);
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(1); // February
    expect(result.getDate()).toBe(29);
    expect(result.getHours()).toBe(0);
  });

  it("should handle year boundaries", () => {
    const newYear = new Date("2024-01-01T23:59:59.999Z");
    const result = normalizeDate(newYear);
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(1);
    expect(result.getHours()).toBe(0);
  });
});
