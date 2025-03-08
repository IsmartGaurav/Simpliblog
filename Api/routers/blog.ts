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
        // Only log the slug, not the entire request context
        if (process.env.NODE_ENV === 'development') {
            console.log("Fetching blog with slug:", input.slug);
        }
        
        try {
            // First try to find the blog with the exact slug
            const blog = await ctx.prisma.blogArticle.findUnique({
                where: {
                    slug: input.slug
                }
            });
            
            if (blog) {
                // Only log minimal information
                if (process.env.NODE_ENV === 'development') {
                    console.log("Blog found with exact slug match");
                }
                return blog;
            }
            
            // If not found, try a case-insensitive search
            if (process.env.NODE_ENV === 'development') {
                console.log("Blog not found with exact match, trying case-insensitive search");
            }
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
                if (process.env.NODE_ENV === 'development') {
                    console.log("Blog found with case-insensitive match:", blogs[0].slug);
                }
                return blogs[0];
            }
            
            // If still not found, try a partial match
            if (process.env.NODE_ENV === 'development') {
                console.log("Blog not found with case-insensitive match, trying partial match");
            }
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
                if (process.env.NODE_ENV === 'development') {
                    console.log("Blog found with partial match:", partialMatches[0].slug);
                }
                return partialMatches[0];
            }
            
            // Log only blog counts and slugs, not entire objects
            if (process.env.NODE_ENV === 'development') {
                console.log("No blog found, checking available blogs count");
                const allBlogSlugs = await ctx.prisma.blogArticle.findMany({
                    select: {
                        slug: true,
                    }
                });
                console.log(`Available blog count: ${allBlogSlugs.length}`);
            }
            
            throw new TRPCError({
                code: "NOT_FOUND",
                message: `Blog not found with slug: ${input.slug}`
            });
        } catch (error) {
            // Avoid logging the full error object as it may contain sensitive data
            console.error("Error in getBlogBySlug for slug:", input.slug);
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
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "No titles provided for blog generation"
            });
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
                        throw new TRPCError({
                            code: "UNAUTHORIZED",
                            message: "User not authenticated"
                        });
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
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Project not found"
                    });
                }
            }

            const blogs = [];
            for (const title of titles) {
                try {
                    const content = await generateBlogPost(title, style);
                    if (!content || typeof content !== 'string' || content.trim().length === 0) {
                        throw new TRPCError({
                            code: "INTERNAL_SERVER_ERROR",
                            message: "Invalid content generated"
                        });
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
                    // Only log minimal error info in development
                    if (process.env.NODE_ENV === 'development') {
                        console.error(`Error generating content for title: ${title}`);
                    }
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to generate blog content"
                    });
                }
            }

            const blogPosts = await ctx.prisma.blogArticle.createMany({
                data: blogs
            });

            return blogPosts;
        } catch (error) {
            // Only log minimal error info in development
            if (process.env.NODE_ENV === 'development') {
                console.error("Error in blog generation process");
            }
            
            if (error instanceof TRPCError) {
                throw error;
            }
            
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to generate blogs"
            });
        }
    }),
    updateBlog: protectedProcedure
        .input(z.object({
            id: z.string(),
            content: z.string(),
            title: z.string().optional(),
            published: z.boolean().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { id, content, title, published } = input;
            
            // Only log in development
            if (process.env.NODE_ENV === 'development') {
                console.log("Updating blog with ID:", id);
            }
            
            try {
                // Find the blog first to check if it exists
                const existingBlog = await ctx.prisma.blogArticle.findUnique({
                    where: { id }
                });
                
                if (!existingBlog) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Blog not found"
                    });
                }
                
                // Update the blog
                const updatedBlog = await ctx.prisma.blogArticle.update({
                    where: { id },
                    data: {
                        content,
                        ...(title && { title }),
                        ...(published !== undefined && { published }),
                        updatedAt: new Date()
                    }
                });
                
                return updatedBlog;
            } catch (error) {
                // Only log minimal error info in development
                if (process.env.NODE_ENV === 'development') {
                    console.error("Error updating blog");
                }
                
                if (error instanceof TRPCError) {
                    throw error;
                }
                
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update blog"
                });
            }
        }),
});