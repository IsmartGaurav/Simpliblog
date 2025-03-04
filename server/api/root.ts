import { blogRouter } from "@/Api/routers/blog";
import { userRouter } from "@/Api/routers/user";
import { fileRouter } from "@/Api/routers/file";
import { projectRouter } from "@/Api/routers/project";
import { createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
    user: userRouter,
    file: fileRouter,
    project: projectRouter,
    blog: blogRouter
});

export type AppRouter = typeof appRouter;

// Remove this line as createCallerFactory is deprecated in tRPC v11
// export const createCaller = createCallerFactory(appRouter);