import {z} from "zod";
import {createTRPCRouter,protectedProcedure} from "@/server/api/trpc"
import { generateBlogPost, generateTopic } from "@/lib/mistralapi";
import { generateSlug } from "@/lib/utils";
import { TRPCError } from "@trpc/server";

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
    
    getBlogBySlug: protectedProcedure.input(z.object({
        slug: z.string()
    })).query(async ({ctx, input}) => {
        console.log("Fetching blog with slug:", input.slug);
        
        try {
            // First try to find the blog with the exact slug
            const blog = await ctx.prisma.blogArticle.findUnique({
                where: {
                    slug: input.slug
                }
            });
            
            if (blog) {
                console.log("Blog found with exact slug match");
                return blog;
            }
            
            // If not found, try a case-insensitive search
            console.log("Blog not found with exact match, trying case-insensitive search");
            const blogs = await ctx.prisma.blogArticle.findMany({
                where: {
                    slug: {
                        contains: input.slug,
                        mode: 'insensitive'
                    }
                },
                take: 1
            });
            
            if (blogs.length > 0) {
                console.log("Blog found with case-insensitive match:", blogs[0].slug);
                return blogs[0];
            }
            
            // If still not found, try a partial match
            console.log("Blog not found with case-insensitive match, trying partial match");
            const partialMatches = await ctx.prisma.blogArticle.findMany({
                where: {
                    OR: [
                        { slug: { contains: input.slug.split('-')[0], mode: 'insensitive' } },
                        { title: { contains: input.slug.replace(/-/g, ' '), mode: 'insensitive' } }
                    ]
                },
                take: 1
            });
            
            if (partialMatches.length > 0) {
                console.log("Blog found with partial match:", partialMatches[0].slug);
                return partialMatches[0];
            }
            
            // Log all available blogs for debugging
            console.log("No blog found, listing all available blogs for debugging");
            const allBlogs = await ctx.prisma.blogArticle.findMany({
                select: {
                    id: true,
                    slug: true,
                    title: true
                }
            });
            
            console.log("Available blogs:", JSON.stringify(allBlogs, null, 2));
            
            throw new TRPCError({
                code: "NOT_FOUND",
                message: `Blog not found with slug: ${input.slug}`,
                cause: {
                    availableSlugs: allBlogs.map(b => b.slug)
                }
            });
        } catch (error) {
            console.error("Error in getBlogBySlug:", error);
            throw error;
        }
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
            // Check if project exists, create if it doesn't
            const project = await ctx.prisma.project.findUnique({
                where: { id: projectId }
            });

            if (!project) {
                // If using 'default' as projectId, create a default project
                if (projectId === 'default') {
                    const userId = ctx.auth.id;
                    if (!userId) {
                        throw new Error("User not authenticated");
                    }

                    // Check if user exists
                    const user = await ctx.prisma.user.findUnique({
                        where: { clerkUserId: userId }
                    });

                    if (!user) {
                        // Create user if not exists
                        await ctx.prisma.user.create({
                            data: {
                                id: userId,
                                clerkUserId: userId,
                                name: "User",
                            }
                        });
                    }

                    // Create a default project
                    await ctx.prisma.project.create({
                        data: {
                            id: 'default',
                            name: 'Default Project',
                            slug: 'default-project',
                            userId: userId,
                        }
                    });
                } else {
                    throw new Error(`Project with ID ${projectId} not found`);
                }
            }

            const blogs = [];
            for (const title of titles) {
                try {
                    const content = await generateBlogPost(title, style);
                    if (!content || typeof content !== 'string' || content.trim().length === 0) {
                        throw new Error(`Invalid content generated for title: ${title}`);
                    }
                    blogs.push({
                        title,
                        slug: generateSlug(title),
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