import {z} from "zod";
import {createTRPCRouter,protectedProcedure} from "@/server/api/trpc"
import { generateBlogPost, generateTopic } from "@/lib/mistralapi";
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
        const number = input.number || 1; // Default to 5 if null
        
        try {
            const topics = await generateTopic(theme, description, style, number);
            return topics;
        } catch (error) {
            console.error("Error generating topics:", error);
            return { error: "Failed to generate topics" };
        }
    }),
    generateBlogs: protectedProcedure.input(z.object({
        projectId: z.string(),
        titles: z.array(z.string()),
        style: z.string()
    })).mutation(async ({ctx, input}) => {
        const {projectId, titles, style} = input;
        
        if (!titles.length) {
            throw new Error("No titles provided for blog generation");
        }

        try {
            const blogs = [];
            for (const title of titles) {
                try {
                    const content = await generateBlogPost(title, style);
                    if (!content || typeof content !== 'string' || content.trim().length === 0) {
                        throw new Error(`Invalid content generated for title: ${title}`);
                    }
                    blogs.push({
                        title,
                        content: content.trim(),
                        projectId,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                } catch (contentError) {
                    console.error(`Error generating content for title '${title}':`, contentError);
                    throw new Error(`Failed to generate content for title: ${title}`);
                }
            }

            const blogPosts = await ctx.prisma.blogArticle.createMany({
                data: blogs
            });

            return blogPosts;
        } catch (error) {
            console.error("Error in blog generation process:", error);
            throw error;
        }
    })
});