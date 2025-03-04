import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const projectRouter = createTRPCRouter({
  getProjects: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.prisma.project.findMany({
      where: {
        userId: ctx.auth.id
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        createdAt: true
      }
    });
    return projects;
  }),

  createProject: protectedProcedure.input(z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().optional()
  })).mutation(async ({ ctx, input }) => {
    try {
      const slug = input.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .substring(0, 50) + `-${Math.random().toString(36).substring(2, 7)}`;

      const project = await ctx.prisma.project.create({
        data: {
          slug,
          name: input.name,
          description: input.description,
          userId: ctx.auth.id // Changed from userId to id
        },
        select: {
          id: true,
          name: true,
          slug: true,
          createdAt: true
        }
      });
      return project;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create project',
        cause: error
      });
    }
  }),

  updateProject: protectedProcedure.input(z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Project name is required"),
    description: z.string().optional()
  })).mutation(async ({ ctx, input }) => {
    try {
      const project = await ctx.prisma.project.update({
        where: {
          id: input.id,
          userId: ctx.auth.id // Changed from userId to id
        },
        data: {
          name: input.name,
          description: input.description
        },
        select: {
          id: true,
          name: true,
          description: true,
          updatedAt: true
        }
      });
      return project;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update project',
        cause: error
      });
    }
  }),

  deleteProject: protectedProcedure.input(z.object({
    id: z.string().uuid()
  })).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.project.delete({
        where: {
          id: input.id,
          userId: ctx.auth.id // Changed from userId to id
        }
      });
      return { success: true };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete project',
        cause: error
      });
    }
  })
});