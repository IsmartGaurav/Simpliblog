'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { 
  Pencil, 
  PlusCircle, 
  ExternalLink,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

// Same constant as in project-selector to maintain consistency
const PROJECT_STORAGE_KEY = 'selectedProjectId';
const DEFAULT_PROJECT_ID = 'default';

export default function BlogsPage() {
  const [projectId, setProjectId] = useState<string>(DEFAULT_PROJECT_ID);
  const [searchTerm, setSearchTerm] = useState('');
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  
  // Get projectId from localStorage and listen for changes
  const handleProjectChange = useCallback((newProjectId: string) => {
    setProjectId(newProjectId);
    console.log(`Blog page: Project changed to ${newProjectId}`);
  }, []);
  
  // Handle project change event
  useEffect(() => {
    // Get initial project from localStorage
    const getInitialProject = () => {
      if (typeof window !== 'undefined') {
        const storedProjectId = localStorage.getItem(PROJECT_STORAGE_KEY);
        if (storedProjectId) {
          handleProjectChange(storedProjectId);
        }
      }
    };
    
    // Listen for custom events
    const onProjectChanged = (event: Event) => {
      const customEvent = event as CustomEvent<{projectId: string}>;
      if (customEvent.detail && customEvent.detail.projectId) {
        handleProjectChange(customEvent.detail.projectId);
      }
    };
    
    // Listen for storage events (cross-tab)
    const onStorageChange = (event: StorageEvent) => {
      if (event.key === PROJECT_STORAGE_KEY && event.newValue) {
        handleProjectChange(event.newValue);
      }
    };
    
    // Initialize
    getInitialProject();
    
    // Add event listeners
    window.addEventListener('projectChanged', onProjectChanged);
    window.addEventListener('storage', onStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('projectChanged', onProjectChanged);
      window.removeEventListener('storage', onStorageChange);
    };
  }, [handleProjectChange]);
  
  // Fetch blogs for the selected project
  const { 
    data: blogs = [], 
    isLoading,
    refetch
  } = api.blog.getBlogs.useQuery({ 
    projectId 
  }, {
    // Ensure we don't cache the results so it refreshes when changing projects
    refetchOnWindowFocus: true,
    enabled: Boolean(projectId),
  });
  
  // Delete blog mutation
  const deleteBlogMutation = api.blog.deleteBlog.useMutation({
    onSuccess: () => {
      toast.success('Blog deleted successfully');
      refetch(); // Refresh the blog list
      setBlogToDelete(null); // Reset the blog to delete
    },
    onError: (error) => {
      toast.error(`Failed to delete blog: ${error.message}`);
      setBlogToDelete(null); // Reset the blog to delete
    }
  });
  
  // Handle delete blog
  const handleDeleteBlog = (id: string) => {
    deleteBlogMutation.mutate({ id });
  };
  
  // Refetch when project changes
  useEffect(() => {
    if (projectId) {
      refetch();
    }
  }, [projectId, refetch]);
  
  // Helper function to get excerpt from content
  const getExcerpt = (content: string, maxLength: number = 150) => {
    // Strip markdown and HTML tags
    const plainText = content.replace(/(\*\*|__)(.*?)\1/g, '$2')
                             .replace(/[#*_~`>|-]/g, '')
                             .replace(/<[^>]*>/g, '');
    
    if (plainText.length <= maxLength) return plainText;
    
    return plainText.substring(0, maxLength) + '...';
  };
  
  // Get the current project name for display
  const { data: projects } = api.project.getProjects.useQuery();
  const currentProjectName = projectId === DEFAULT_PROJECT_ID 
    ? 'Default Project' 
    : projects?.find(p => p.id === projectId)?.name || 'Unknown Project';

  // Filter blogs by search term
  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Blog Articles</h1>
            <p className="text-muted-foreground mt-1">Project: {currentProjectName}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search blogs..."
              className="max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Link href="/dashboard/generate-blog">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Blog
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="mt-6 pt-4 border-t border-border">
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              </Card>
            ))
          ) : filteredBlogs.length > 0 ? (
            // Blog cards
            filteredBlogs.map(blog => (
              <Card key={blog.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">{blog.title}</h2>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {getExcerpt(blog.content)}
                  </p>
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
                    <time className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                    </time>
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/blogs/${blog.slug}`}>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1 cursor-pointer" />
                          View
                        </Button>
                      </Link>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4 mr-1 cursor-pointer" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the blog
                              article "{blog.title}" and remove it from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteBlog(blog.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            // No blogs found
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="text-center">
                <h3 className="text-xl font-medium mb-2">No blog articles found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? 'Try a different search term' : 'Create your first blog article'}
                </p>
                {!searchTerm && (
                  <Link href="/dashboard/generate-blog">
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Blog
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}