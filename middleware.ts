import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/trpc/blog.getBlogBySlug",
  "/api/trpc/blog.getBlogs"
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!.*\\.|_next).*)", // Skip static files and Next.js internals
    "/",                    // Match root route
    "/(api|trpc)(.*)"      // Match API and tRPC routes
  ],
};