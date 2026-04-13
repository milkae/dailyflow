import { PrismaClient } from "./generated/prisma/client";
import { vi, beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

export const prismaMock = mockDeep<PrismaClient>();

vi.mock("@/lib/prisma", () => ({
  default: prismaMock,
  prisma: prismaMock,
}));

beforeEach(() => {
  mockReset(prismaMock);
});
