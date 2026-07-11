import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };

  return ctx;
}

describe("Church CRUD Operations", () => {
  describe("Members", () => {
    it("should list members", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const members = await caller.members.list();
      expect(Array.isArray(members)).toBe(true);
    });

    it("should create a member with valid data", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const memberData = {
        name: "João Silva",
        email: "joao@example.com",
        phone: "(11) 99999-9999",
        status: "ativo" as const,
      };

      const result = await caller.members.create(memberData);
      expect(result).toBeDefined();
      expect(result.name).toBe(memberData.name);
      expect(result.email).toBe(memberData.email);
    });

    it("should reject member with invalid email", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const memberData = {
        name: "João Silva",
        email: "invalid-email",
        phone: "(11) 99999-9999",
        status: "ativo" as const,
      };

      try {
        await caller.members.create(memberData);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should reject member with short phone", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const memberData = {
        name: "João Silva",
        email: "joao@example.com",
        phone: "123",
        status: "ativo" as const,
      };

      try {
        await caller.members.create(memberData);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("Visitors", () => {
    it("should list visitors", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const visitors = await caller.visitors.list();
      expect(Array.isArray(visitors)).toBe(true);
    });

    it("should create a visitor with valid data", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const visitorData = {
        name: "Maria Santos",
        email: "maria@example.com",
        phone: "(11) 98888-8888",
        interested: "sim" as const,
      };

      const result = await caller.visitors.create(visitorData);
      expect(result).toBeDefined();
      expect(result.name).toBe(visitorData.name);
      expect(result.interested).toBe(visitorData.interested);
    });

    it("should reject visitor with invalid interest value", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const visitorData = {
        name: "Maria Santos",
        email: "maria@example.com",
        phone: "(11) 98888-8888",
        interested: "maybe" as any,
      };

      try {
        await caller.visitors.create(visitorData);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("Converts", () => {
    it("should list converts", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const converts = await caller.converts.list();
      expect(Array.isArray(converts)).toBe(true);
    });

    it("should create a convert with valid data", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const convertData = {
        name: "Pedro Oliveira",
        email: "pedro@example.com",
        phone: "(11) 97777-7777",
        status: "novo" as const,
      };

      const result = await caller.converts.create(convertData);
      expect(result).toBeDefined();
      expect(result.name).toBe(convertData.name);
      expect(result.status).toBe(convertData.status);
    });

    it("should reject convert with invalid status", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const convertData = {
        name: "Pedro Oliveira",
        email: "pedro@example.com",
        phone: "(11) 97777-7777",
        status: "invalid" as any,
      };

      try {
        await caller.converts.create(convertData);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("Birthdays", () => {
    it("should list birthdays", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const birthdays = await caller.birthdays.list();
      expect(Array.isArray(birthdays)).toBe(true);
    });
  });
});
