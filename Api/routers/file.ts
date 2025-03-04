import {z} from "zod";
import {createTRPCRouter, protectedProcedure} from "@/server/api/trpc";
import {TRPCError} from "@trpc/server";

export const fileRouter = createTRPCRouter({
  getFiles: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const files = await ctx.prisma.file.findMany({
          where: {
            projectId: input.projectId,
            userId: ctx.auth.id,
          },
          select: {
            id: true,
            name: true,
            content: true,
            type: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        return files;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch files",
          cause: error,
        });
      }
    }),

  uploadFile: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        fileName: z.string(),
        fileContent: z.string(),
        fileType: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const file = await ctx.prisma.file.create({
          data: {
            projectId: input.projectId,
            name: input.fileName,
            content: input.fileContent,
            type: input.fileType,
            userId: ctx.auth.id,
          },
          select: {
            id: true,
            name: true,
            type: true,
            createdAt: true,
          },
        });
        return file;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload file",
          cause: error,
        });
      }
    }),

  deleteFile: protectedProcedure
    .input(
      z.object({
        fileId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.file.delete({
          where: {
            id: input.fileId,
            userId: ctx.auth.id,
          },
        });
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete file",
          cause: error,
        });
      }
    }),
});