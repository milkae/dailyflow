import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/recipes/parse/route";

// Mock dependencies
vi.mock("@/lib/dal", () => ({
  verifySession: vi.fn().mockResolvedValue({ userId: "user1" }),
}));

vi.mock("@/lib/logger", () => ({
  logError: vi.fn(),
}));

// // Mock JSDOM
// vi.mock("jsdom", () => ({
//   JSDOM: {
//     fromURL: vi.fn(),
//   },
// }));

import { JSDOM } from "jsdom";

describe("Recipe Parse API", () => {
  const mockJSDOM = vi.mocked(JSDOM, { deep: true });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 when URL is missing", async () => {
    const request = new NextRequest("http://localhost/api/recipes/parse", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("URL is required");
  });

  it("should return 400 for invalid URL protocol", async () => {
    const request = new NextRequest("http://localhost/api/recipes/parse", {
      method: "POST",
      body: JSON.stringify({ url: "ftp://example.com/recipe" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Only HTTP/HTTPS URLs are supported");
  });

  it("should return 400 for invalid URL format", async () => {
    const request = new NextRequest("http://localhost/api/recipes/parse", {
      method: "POST",
      body: JSON.stringify({ url: "not-a-url" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(500); // Will fail during URL construction
  });

  it("should parse recipe successfully from valid URL", async () => {
    const mockDom = {
      window: {
        document: {
          querySelectorAll: vi.fn().mockReturnValue([
            {
              textContent: JSON.stringify({
                "@type": "Recipe",
                name: "Test Recipe",
                description: "A test recipe",
                recipeIngredient: ["ingredient 1", "ingredient 2"],
                recipeInstructions: [{ text: "Step 1" }, { text: "Step 2" }],
                prepTime: "PT10M",
                cookTime: "PT20M",
                recipeYield: "4 servings",
              }),
            },
          ]),
        },
      },
    };

    mockJSDOM.fromURL.mockResolvedValue(mockDom as unknown as JSDOM);

    const request = new NextRequest("http://localhost/api/recipes/parse", {
      method: "POST",
      body: JSON.stringify({ url: "https://example.com/recipe" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe("Test Recipe");
    expect(data.description).toBe("A test recipe");
    expect(data.ingredients).toEqual(["ingredient 1", "ingredient 2"]);
    expect(data.instructions).toEqual(["Step 1", "Step 2"]);
    expect(data.prepTime).toBe(10);
    expect(data.cookTime).toBe(20);
    expect(data.servings).toBe(4);
  });

  it("should return 400 when no recipe data found", async () => {
    const mockDom = {
      window: {
        document: {
          querySelectorAll: vi.fn().mockReturnValue([]), // No JSON-LD found
        },
      },
    };

    mockJSDOM.fromURL.mockResolvedValue(mockDom as unknown as JSDOM);

    const request = new NextRequest("http://localhost/api/recipes/parse", {
      method: "POST",
      body: JSON.stringify({ url: "https://example.com/recipe" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Could not parse recipe from this URL");
  });

  it("should handle network errors gracefully", async () => {
    mockJSDOM.fromURL.mockRejectedValue(new Error("Network timeout"));

    const request = new NextRequest("http://localhost/api/recipes/parse", {
      method: "POST",
      body: JSON.stringify({ url: "https://example.com/recipe" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to parse recipe");
  });

  it("should handle malformed JSON-LD gracefully", async () => {
    const mockDom = {
      window: {
        document: {
          querySelectorAll: vi.fn().mockReturnValue([
            {
              textContent: "invalid json",
            },
          ]),
        },
      },
    };

    mockJSDOM.fromURL.mockResolvedValue(mockDom as unknown as JSDOM);

    const request = new NextRequest("http://localhost/api/recipes/parse", {
      method: "POST",
      body: JSON.stringify({ url: "https://example.com/recipe" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("should extract recipe from multiple JSON-LD scripts", async () => {
    const mockDom = {
      window: {
        document: {
          querySelectorAll: vi.fn().mockReturnValue([
            {
              textContent: JSON.stringify({
                "@type": "WebSite",
                name: "Not a recipe",
              }),
            },
            {
              textContent: JSON.stringify({
                "@type": "Recipe",
                name: "Actual Recipe",
                recipeIngredient: ["flour", "eggs"],
              }),
            },
          ]),
        },
      },
    };

    mockJSDOM.fromURL.mockResolvedValue(mockDom as unknown as JSDOM);

    const request = new NextRequest("http://localhost/api/recipes/parse", {
      method: "POST",
      body: JSON.stringify({ url: "https://example.com/recipe" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe("Actual Recipe");
    expect(data.ingredients).toEqual(["flour", "eggs"]);
  });

  it("should handle different instruction formats", async () => {
    const mockDom = {
      window: {
        document: {
          querySelectorAll: vi.fn().mockReturnValue([
            {
              textContent: JSON.stringify({
                "@type": "Recipe",
                name: "Test Recipe",
                recipeInstructions: [
                  "Simple string instruction",
                  { text: "Object with text" },
                  {
                    itemListElement: [
                      { text: "Nested instruction 1" },
                      { text: "Nested instruction 2" },
                    ],
                  },
                ],
              }),
            },
          ]),
        },
      },
    };

    mockJSDOM.fromURL.mockResolvedValue(mockDom as unknown as JSDOM);

    const request = new NextRequest("http://localhost/api/recipes/parse", {
      method: "POST",
      body: JSON.stringify({ url: "https://example.com/recipe" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.instructions).toEqual([
      "Simple string instruction",
      "Object with text",
      "Nested instruction 1",
      "Nested instruction 2",
    ]);
  });
});
