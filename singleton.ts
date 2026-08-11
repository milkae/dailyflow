import { PrismaClient } from "./generated/prisma/client";
import { vi, beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

export const prismaMock = mockDeep<PrismaClient>();

vi.mock("@/lib/prisma", () => ({
  default: prismaMock,
  prisma: prismaMock,
}));

vi.mock("@/lib/dal", () => ({
  getUserId: vi.fn(async () => "user-1"),
  getSession: vi.fn(async () => ({ user: { id: "user-1" } })),
  requireUser: vi.fn(async () => ({ id: "user-1" })),
  verifySession: vi.fn(async () => ({ isAuth: true, userId: "user-1" })),
}));

beforeEach(() => {
  mockReset(prismaMock);
});
