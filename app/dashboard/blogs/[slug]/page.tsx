'use client';

import { useParams } from 'next/navigation';
import { api } from '@/utils/api';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { marked } from 'marked';
import { useEffect, useState } from 'react';

// Configure marked for safe rendering
marked.setOptions({
  breaks: true,
  gfm: true
  // 'sanitize' is not supported in latest marked version
});

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;
  
  console.log("Rendering BlogPost with slug:", slug);
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Suspense fallback={<BlogSkeleton />}>
        <BlogContent slug={slug} />
      </Suspense>
    </div>
  );
}

interface DebugInfo {
  slug: string;
  queryStarted: boolean;
  queryCompleted: boolean;
  hasError: boolean;
  hasBlog: boolean;
  errorMessage?: string;
}

function BlogContent({ slug }: { slug: string }) {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    slug: slug,
    queryStarted: false,
    queryCompleted: false,
    hasError: false,
    hasBlog: false
  });
  
  const { 
    data: blog, 
    isLoading, 
    error,
    isError
  } = api.blog.getBlogBySlug.useQuery(
    { slug },
    {
      retry: 3,
      retryDelay: 1000,
      onSuccess: (data) => {
        setDebugInfo((prev: DebugInfo) => ({
          ...prev,
          queryCompleted: true,
          hasBlog: !!data
        }));
        console.log("Blog data received:", data ? "Yes" : "No");
      },
      onError: (err) => {
        setDebugInfo((prev: DebugInfo) => ({
          ...prev,
          queryCompleted: true,
          hasError: true,
          errorMessage: err.message
        }));
        console.error("Error fetching blog:", err);
      }
    }
  );
  
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    setDebugInfo((prev: DebugInfo) => ({
      ...prev,
      queryStarted: true
    }));
  }, []);

  useEffect(() => {
    if (blog?.content) {
      console.log("Setting HTML content from blog");
      try {
        const parsedContent = marked.parse(blog.content);
        setHtmlContent(parsedContent as string);
      } catch (err) {
        console.error("Error parsing markdown:", err);
        setHtmlContent("Error parsing content");
      }
    }
  }, [blog?.content]);

  if (isLoading) {
    console.log("Blog is loading...");
    return <BlogSkeleton />;
  }
  
  if (isError || error) {
    console.error("Error in blog component:", error);
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-red-500">Error Loading Blog</h1>
        <p className="mt-4">{error?.message || "Unknown error occurred"}</p>
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-left overflow-auto max-h-60">
          <pre className="text-xs">Debug Info: {JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
        <Button asChild className="mt-6">
          <Link href="/dashboard/blogs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Link>
        </Button>
      </div>
    );
  }

  if (!blog) {
    console.error("Blog not found for slug:", slug);
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Blog Not Found</h1>
        <p className="mt-4 text-muted-foreground">Could not find a blog post with the slug: {slug}</p>
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-left overflow-auto max-h-60">
          <pre className="text-xs">Debug Info: {JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
        <Button asChild className="mt-6">
          <Link href="/dashboard/blogs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/dashboard/blogs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Link>
        </Button>
      </div>
      
      <article className="prose prose-lg max-w-none dark:prose-invert">
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 border-b pb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={new Date(blog.createdAt).toISOString()}>
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>Author</span>
          </div>
          <span>•</span>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-0.5 rounded-full text-xs">
            {blog.published ? 'Published' : 'Draft'}
          </span>
        </div>
        
        <div 
          className="blog-content mt-8"
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
      </article>
    </div>
  );
}

function BlogSkeleton() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="w-32 h-10" />
      </div>
      
      <Skeleton className="w-[80%] h-12 mb-6" />
      <Skeleton className="w-48 h-5 mb-8" />
      
      <div className="space-y-4">
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-24" />
      </div>
    </div>
  );
} 