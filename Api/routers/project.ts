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
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return projects;
  }),

  createProject: protectedProcedure.input(z.object({
    name: z.string().min(1, "Project name is required")
  })).mutation(async ({ ctx, input }) => {
    try {
      // Generate a unique slug with timestamp and random string
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substring(2, 7);
      const baseSlug = input.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .substring(0, 30);
      
      const slug = `${baseSlug}-${timestamp}-${randomStr}`;

      const project = await ctx.prisma.project.create({
        data: {
          slug,
          name: input.name,
          userId: ctx.auth.id
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
      console.error("Project creation error:", error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create project'
      });
    }
  }),

  updateProject: protectedProcedure.input(z.object({
    id: z.string(),
    name: z.string().min(1, "Project name is required")
  })).mutation(async ({ ctx, input }) => {
    try {
      // Check if the project exists and belongs to the user
      const projectCheck = await ctx.prisma.project.findFirst({
        where: {
          id: input.id,
          userId: ctx.auth.id
        }
      });

      if (!projectCheck) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found or you do not have permission to update it'
        });
      }

      const project = await ctx.prisma.project.update({
        where: {
          id: input.id
        },
        data: {
          name: input.name,
          updatedAt: new Date()
        },
        select: {
          id: true,
          name: true,
          updatedAt: true
        }
      });
      return project;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update project'
      });
    }
  }),

  deleteProject: protectedProcedure.input(z.object({
    id: z.string()
  })).mutation(async ({ ctx, input }) => {
    try {
      // Check if the project exists and belongs to the user
      const projectCheck = await ctx.prisma.project.findFirst({
        where: {
          id: input.id,
          userId: ctx.auth.id
        }
      });

      if (!projectCheck) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found or you do not have permission to delete it'
        });
      }

      // First delete all blog articles associated with this project
      await ctx.prisma.blogArticle.deleteMany({
        where: {
          projectId: input.id
        }
      });

      // Then delete the project
      await ctx.prisma.project.delete({
        where: {
          id: input.id
        }
      });
      
      return { success: true };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete project'
      });
    }
  })
});