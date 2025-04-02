'use client'

import React, { useState, useEffect } from "react"
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from "@/utils/api";
import { useRefetch } from "@/hooks/useRefetch";
import { toast } from "sonner";

interface BlogListProps {
  selectedProjectId?: string;
}

const BlogList: React.FC<BlogListProps> = ({ selectedProjectId = 'default' }) => {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState('');
  const [description, setDescription] = useState('');
  const [numBlogs, setNumBlogs] = useState('');
  const [writingStyle, setWritingStyle] = useState('');
  const [projectId, setProjectId] = useState(selectedProjectId);
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const refetch = useRefetch();
  
  // Update project ID when the selectedProjectId prop changes
  useEffect(() => {
    setProjectId(selectedProjectId);
  }, [selectedProjectId]);
  
  // Fetch all available projects
  const { data: projects } = api.project.getProjects.useQuery();
  
  // Get current project name
  const currentProjectName = projectId === 'default' 
    ? 'Default Project' 
    : projects?.find(p => p.id === projectId)?.name || 'Unknown Project';
  
  const getTopics = api.blog.getTopics.useMutation({
    onSuccess: (data) => {
      if (Array.isArray(data)) {
        setGeneratedTitles(data);
        toast.success(`Generated ${data.length} blog topics for ${currentProjectName}`);
      } else {
        toast.error("Failed to generate topics: Invalid response format");
      }
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to generate topics: ${error.message}`);
    }
  });
  
  const generateBlogs = api.blog.generateBlogs.useMutation({
    onSuccess: () => {
      toast.success(`Successfully generated blogs for ${currentProjectName}`);
      setOpen(false);
      setGeneratedTitles([]);
      setTheme('');
      setDescription('');
      setNumBlogs('');
      setWritingStyle('');
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to generate blogs: ${error.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme || !description || !numBlogs || !writingStyle) return;
    
    const toastId = toast.loading(`Generating topics for ${currentProjectName}...`);
    
    getTopics.mutate({
      projectId,
      theme,
      description,
      number: parseInt(numBlogs),
      style: writingStyle
    }, {
      onSettled: () => {
        toast.dismiss(toastId);
      }
    });
  };

  const handleGenerateBlogs = () => {
    if (generatedTitles.length === 0) return;
    
    const toastId = toast.loading(`Creating blogs for ${currentProjectName}...`);
    
    generateBlogs.mutate({
      projectId,
      titles: generatedTitles,
      style: writingStyle
    }, {
      onSettled: () => {
        toast.dismiss(toastId);
      }
    });
  };

  const resetForm = () => {
    setTheme('');
    setDescription('');
    setNumBlogs('');
    setWritingStyle('');
    setGeneratedTitles([]);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          // Only reset if we're closing and there are no generated titles
          if (generatedTitles.length === 0) {
            resetForm();
          }
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full sm:w-auto">Generate New Blogs</Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] max-w-[500px] p-5 sm:p-7 max-h-[90vh] rounded-lg">
        <DialogHeader>
          <DialogTitle>Generate Blog Posts for {currentProjectName}</DialogTitle>
          <DialogClose className="absolute right-4 top-4" />
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="space-y-2"> 
            <label className="text-sm font-medium block px-1">Blog Theme</label>
            <Input 
              placeholder="Enter blog theme..." 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              required
              
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium block px-1">Description</label>
            <Textarea
              placeholder="Enter blog description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium block px-1">Number of Blogs</label>
            <Input
              type="number"
              min={1}
              max={10}
              value={numBlogs}
              onChange={(e) => setNumBlogs(e.target.value)}
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium block px-1">Writing Style</label>
            <Select
              value={writingStyle}
              onValueChange={setWritingStyle}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            type="submit" 
            className="w-full mt-2" 
            disabled={getTopics.isLoading || !theme || !description || !numBlogs || !writingStyle}
          >
            {getTopics.isLoading ? 'Generating...' : 'Generate Titles'}
          </Button>
          {generatedTitles.length > 0 && (
            <div className="mt-6 space-y-5 pt-2 border-t border-gray-200 dark:border-gray-800">
              <div>
                <h3 className="text-sm font-medium px-1 py-2">Generated Blog Topics for {currentProjectName}:</h3>
                <ul className="space-y-3">
                  {generatedTitles.map((topic, index) => (
                    <li 
                      key={index}
                      className="p-3 bg-secondary/50 rounded-md text-sm hover:bg-secondary/70 transition-colors"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex space-x-3 mt-4 mb-2">
                <Button 
                  type="button" 
                  variant="outline"
                  className="flex-1" 
                  onClick={() => setGeneratedTitles([])}
                >
                  Reset
                </Button>
                <Button 
                  type="button" 
                  className="flex-1" 
                  onClick={handleGenerateBlogs}
                  disabled={generateBlogs.isLoading}
                >
                  {generateBlogs.isLoading ? 'Generating...' : 'Create Blog Content'}
                </Button>
              </div>
            </div>
          )}
        </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BlogList;