"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch blog data
  const { data: blog, isLoading: isFetching } = api.blog.getBlogById.useQuery(
    { id: params.id },
    {
      enabled: !!params.id,
      onSuccess: (data) => {
        if (data) {
          setTitle(data.title);
          setContent(data.content);
          setIsLoading(false);
        }
      },
      onError: () => {
        toast.error('Failed to load blog data');
        setIsLoading(false);
      },
    }
  );

  // Update blog mutation
  const updateBlog = api.blog.updateBlog.useMutation({
    onSuccess: () => {
      toast.success('Blog updated successfully');
      router.push('/dashboard/blogs');
    },
    onError: (error) => {
      toast.error(`Failed to update blog: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Content is required');
      return;
    }
    
    updateBlog.mutate({
      id: params.id,
      title: title.trim(),
      content: content.trim(),
    });
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Edit Blog Article</h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Content (Markdown supported)
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here..."
              className="min-h-[300px] font-mono"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.push('/dashboard/blogs')}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={updateBlog.isLoading}
            >
              {updateBlog.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Blog'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 