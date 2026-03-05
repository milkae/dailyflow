import { PrismaClient } from "./generated/prisma/client";
import { vi, beforeEach } from "vitest";
import { mockDeep, mockReset, DeepMockProxy } from "vitest-mock-extended";

vi.mock("./lib/prisma", () => ({
  prisma: mockDeep<PrismaClient>(),
}));

export const prismaMock = (async () => {
  const { prisma } = await import("./lib/prisma");
  return prisma as DeepMockProxy<PrismaClient>;
})();

beforeEach(async () => {
  const mock = await prismaMock;
  mockReset(mock);
});
