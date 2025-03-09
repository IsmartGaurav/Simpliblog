'use client';

import { useParams } from 'next/navigation';
import { api } from '@/utils/api';
import { Suspense, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Calendar, Edit2, Save, User, Eye } from 'lucide-react';
import { marked } from 'marked';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

// Configure marked for safe rendering
marked.setOptions({
  breaks: true,
  gfm: true
  // 'sanitize' is not supported in latest marked version
});

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;
  
  // Only log in development and only log the slug
  if (process.env.NODE_ENV === 'development') {
    console.log("Rendering BlogPost with slug:", slug);
  }
  
  return (
    <div className="w-full">
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
  const { theme } = useTheme();
  
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    slug: slug,
    queryStarted: false,
    queryCompleted: false,
    hasError: false,
    hasBlog: false
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState('');
  const [editableTitle, setEditableTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('edit');
  const [viewCount, setViewCount] = useState(0);
  const [viewIncremented, setViewIncremented] = useState(false);
  
  const { 
    data: blog, 
    isLoading, 
    error,
    isError,
    refetch
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
        // Set editable content when blog data is received
        if (data?.content) {
          setEditableContent(data.content);
        }
        if (data?.title) {
          setEditableTitle(data.title);
        }
        if (data?.viewCount !== undefined) {
          setViewCount(data.viewCount);
        }
        // Only log minimal information
        if (process.env.NODE_ENV === 'development') {
          console.log("Blog data received:", data ? "Yes" : "No");
        }
      },
      onError: (err) => {
        setDebugInfo((prev: DebugInfo) => ({
          ...prev,
          queryCompleted: true,
          hasError: true,
          errorMessage: err.message
        }));
        // Only log the error message, not the full error object
        console.error("Error fetching blog:", err.message);
      }
    }
  );
  
  // Hook up the update blog mutation
  const updateBlogMutation = api.blog.updateBlog.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      setIsSaving(false);
      refetch();
      toast.success("Blog updated successfully", {
        description: "Your changes have been saved.",
        duration: 3000
      });
    },
    onError: (err) => {
      console.error("Error updating blog:", err.message);
      setIsSaving(false);
      toast.error("Failed to update blog", {
        description: err.message || "Please try again later.",
        duration: 5000
      });
    }
  });
  
  // Hook up the increment view count mutation
  const incrementViewMutation = api.blog.incrementViewCount.useMutation({
    onSuccess: (data) => {
      if (data?.viewCount !== undefined) {
        setViewCount(data.viewCount);
      }
    }
  });
  
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    setDebugInfo((prev: DebugInfo) => ({
      ...prev,
      queryStarted: true
    }));
  }, []);

  // Increment view count when blog is loaded
  useEffect(() => {
    if (blog && !viewIncremented && !isEditing) {
      incrementViewMutation.mutate({ id: blog.id });
      setViewIncremented(true);
    }
  }, [blog, viewIncremented, isEditing, incrementViewMutation]);

  useEffect(() => {
    if (blog?.content) {
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log("Setting HTML content from blog");
      }
      try {
        const parsedContent = marked.parse(blog.content);
        setHtmlContent(parsedContent as string);
      } catch (err) {
        // Only log that an error occurred, not the full error
        console.error("Error parsing markdown");
        setHtmlContent("Error parsing content");
      }
    }
  }, [blog?.content]);
  
  // Generate preview HTML from markdown as user types
  const updatePreview = useCallback(() => {
    try {
      const parsedContent = marked.parse(editableContent);
      setHtmlContent(parsedContent as string);
    } catch (err) {
      console.error("Error parsing markdown preview");
    }
  }, [editableContent]);
  
  // Update preview when content changes
  useEffect(() => {
    if (isEditing) {
      updatePreview();
    }
  }, [isEditing, editableContent, updatePreview]);
  
  const handleSave = async () => {
    if (!blog || !editableContent) return;
    
    setIsSaving(true);
    
    updateBlogMutation.mutate({
      id: blog.id,
      content: editableContent,
      title: editableTitle
    });
  };

  // Handle MDEditor onChange properly
  const handleEditorChange = (value?: string) => {
    if (value !== undefined) {
      setEditableContent(value);
    }
  };

  if (isLoading) {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log("Blog is loading...");
    }
    return <BlogSkeleton />;
  }
  
  if (isError || error) {
    // Only log the error message, not the full error object
    console.error("Error in blog component:", error?.message || "Unknown error");
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-red-500">Error Loading Blog</h1>
        <p className="mt-4">{error?.message || "Unknown error occurred"}</p>
        {/* Only show debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-left overflow-auto max-h-60">
            <pre className="text-xs">Debug Info: {JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
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
    // Only log minimal information
    console.error("Blog not found for slug:", slug);
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Blog Not Found</h1>
        <p className="mt-4 text-muted-foreground">Could not find a blog post with the slug: {slug}</p>
        {/* Only show debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-left overflow-auto max-h-60">
            <pre className="text-xs">Debug Info: {JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
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
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/blogs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Link>
        </Button>
        
        {isEditing ? (
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditing(false);
                setEditableContent(blog.content);
                setEditableTitle(blog.title);
              }}
              disabled={isSaving}
              size="sm"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? 'Saving...' : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        ) : (
          <Button 
            onClick={() => setIsEditing(true)}
            variant="default"
            size="sm"
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Blog
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4">
              <Label htmlFor="blog-title" className="text-sm font-medium mb-2 block">
                Blog Title
              </Label>
              <Input
                id="blog-title"
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                className="text-lg font-semibold"
                placeholder="Enter blog title..."
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-2 grid grid-cols-2">
                <TabsTrigger value="edit">Edit Content</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="edit" className="mt-0">
                <div
                  className="border rounded-md overflow-hidden"
                  data-color-mode={theme === 'dark' ? 'dark' : 'light'}
                >
                  <MDEditor
                    value={editableContent}
                    onChange={handleEditorChange}
                    height={600}
                    preview="edit"
                    className="w-full"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="mt-0">
                <div className="border rounded-md p-6 min-h-[600px] prose prose-lg dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold mb-4">{editableTitle}</h1>
                  <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 border-b pb-4">
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
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>Author</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-0.5 rounded-full text-xs">
              {blog.published ? 'Published' : 'Draft'}
            </span>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-1 text-xs">
              <Eye className="h-3 w-3" />
              <span>{viewCount} {viewCount === 1 ? 'view' : 'views'}</span>
            </div>
          </div>
          
          <div 
            className="blog-content mt-8"
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        </article>
      )}
    </div>
  );
}

function BlogSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="w-32 h-10" />
        <Skeleton className="w-32 h-10" />
      </div>
      
      <Skeleton className="w-[80%] h-12 mb-6" />
      
      <div className="flex gap-2 mb-8">
        <Skeleton className="w-24 h-5" />
        <Skeleton className="w-24 h-5" />
        <Skeleton className="w-24 h-5" />
      </div>
      
      <div className="space-y-4">
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-24" />
      </div>
    </div>
  );
} 