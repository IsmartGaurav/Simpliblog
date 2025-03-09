'use client';

import { api } from "@/utils/api";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Eye, File, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectSelector } from '@/components/project-selector';

export default function BlogsPage() {
  const [projectId, setProjectId] = useState<string>('default');
  
  // Fetch blogs for the selected project
  const { data: blogs, isLoading, error, refetch } = api.blog.getBlogs.useQuery({ 
    projectId 
  }, {
    // Ensure we don't cache the results so it refreshes when changing projects
    refetchOnWindowFocus: true
  });

  // Trigger a refetch when the component mounts or projectId changes
  useEffect(() => {
    refetch();
  }, [projectId, refetch]);

  // Helper function to get excerpt from content
  const getExcerpt = (content: string, maxLength: number = 150) => {
    // Remove markdown formatting for cleaner excerpt
    const plainText = content
      .replace(/#{1,6}\s?/g, '') // Remove headings
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italics
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
      .replace(/\n/g, ' '); // Replace newlines with spaces
    
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  // Handle project change
  const handleProjectChange = (value: string) => {
    setProjectId(value);
  };

  // Get the current project name for display
  const { data: projects } = api.project.getProjects.useQuery();
  const currentProjectName = projectId === 'default' 
    ? 'Default Project' 
    : projects?.find(p => p.id === projectId)?.name || 'Unknown Project';

  return (
    <div className="w-full pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Blog Articles</h1>
          <p className="text-muted-foreground mt-1">Manage and browse your blog content</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-64">
            <ProjectSelector 
              selectedProjectId={projectId} 
              onProjectChange={handleProjectChange} 
            />
          </div>
          <Button asChild>
            <Link href="/dashboard/create">
              <Pencil className="mr-2 h-4 w-4" />
              Create New Blog
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">{currentProjectName}</h2>
        <p className="text-sm text-muted-foreground">
          {blogs && blogs.length > 0 
            ? `${blogs.length} blog post${blogs.length === 1 ? '' : 's'}`
            : 'No blog posts yet'}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden border border-border/40 hover:border-border/80 transition-all duration-200">
              <CardHeader className="p-6 pb-3">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="p-6 pt-3">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter className="px-6 py-4 border-t bg-muted/20">
                <Skeleton className="h-8 w-1/4" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10 max-w-md mx-auto">
          <div className="rounded-full bg-red-100 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <File className="h-6 w-6 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-red-500">Error Loading Blogs</h2>
          <p className="mt-4 text-muted-foreground">{error.message}</p>
          <Button variant="outline" className="mt-6" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      ) : blogs && blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Card key={blog.id} className="flex flex-col overflow-hidden border border-border/40 hover:border-border/80 hover:shadow-md transition-all duration-200">
              <CardHeader className="p-6 pb-3">
                <CardTitle className="line-clamp-2 text-xl">{blog.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow p-6 pt-3">
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {blog.excerpt || getExcerpt(blog.content)}
                </p>
              </CardContent>
              <CardFooter className="px-6 py-4 border-t bg-muted/20 flex justify-between items-center">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{new Date(blog.updatedAt).toLocaleDateString()}</span>
                </div>
                <Button variant="outline" size="sm" asChild className="h-8">
                  <Link href={`/dashboard/blogs/${blog.slug}`}>
                    <Eye className="mr-2 h-3 w-3" />
                    View
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 max-w-md mx-auto">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <File className="h-8 w-8 text-blue-500 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-bold">No Blog Posts in {currentProjectName}</h2>
          <p className="text-muted-foreground mt-2 mb-6">Get started by creating your first blog post</p>
          <Button asChild>
            <Link href="/dashboard/create">
              <Pencil className="mr-2 h-4 w-4" />
              Create New Blog
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}