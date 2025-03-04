import {z} from "zod";
import {createTRPCRouter,protectedProcedure} from "@/server/api/trpc"
import { generateTopic } from "@/lib/mistralapi";
export const blogRouter = createTRPCRouter({
    getBlogs: protectedProcedure.input(z.object({
        projectId: z.string()
    })).query(async ({ctx,input}) => {
        const blogs = await ctx.prisma.blogArticle.findMany({
            where: {
                projectId: input.projectId
            }
        });
        return blogs;
    }),
    
    // Add the missing generateTopics procedure
    getTopics: protectedProcedure.input(z.object({
        projectId: z.string(),
        theme: z.string().optional().default(""),
        description: z.string().optional().default(""),
        number: z.number().optional().nullable(),
        style: z.string().optional().default("")
    })).mutation(async ({ctx, input}) => {
        const {projectId, theme, description, style} = input;
        const number = input.number || 5; // Default to 5 if null
        
        try {
            const topics = await generateTopic(theme, description, style, number);
            return topics;
        } catch (error) {
            console.error("Error generating topics:", error);
            return { error: "Failed to generate topics" };
        }
    })
});