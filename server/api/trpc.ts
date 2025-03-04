import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@clerk/nextjs/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "@/lib/prisma";

type CreateContextOptions = Record<string, never>;

// Removed unused function createInnerTRPCContext
  return {
    prisma,
  };
};

export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  const { req } = _opts;
  const { userId } = auth();

  return {
    prisma,
    auth: {
      id: userId,
    },
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create();

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.auth.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      prisma: ctx.prisma,
      auth: ctx.auth,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);