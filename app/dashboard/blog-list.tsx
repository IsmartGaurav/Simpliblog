'use client'

import React, { useState } from "react"
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
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
import {useRefetch} from "@/hooks/useRefetch"

const BlogList = () => {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState('');
  const [description, setDescription] = useState('');
  const [numBlogs, setNumBlogs] = useState('');
  const [writingStyle, setWritingStyle] = useState('');
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const refetch = useRefetch()
  const getTopics = api.blog.getTopics.useMutation()
  const generateBlogs = api.blog.generateBlogs.useMutation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme || !description || !numBlogs || !writingStyle) return;
    
    getTopics.mutate({
      projectId: "default",
      theme,
      description,
      number: parseInt(numBlogs),
      style: writingStyle
    },
    {
      onSuccess: (data) => {
        setGeneratedTitles(data)
        refetch()
      }
    })
  };

  const handleGenerateBlogs = () => {
    if (generatedTitles.length === 0) return;
    
    generateBlogs.mutate({
      projectId: "default",
      titles: generatedTitles,
      style: writingStyle
    },
    {
      onSuccess: () => {
        setOpen(false)
        setGeneratedTitles([])
        refetch()
      }
    })
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full sm:w-auto">Generate New Blogs</Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] max-w-[425px] p-4 sm:p-6 max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Generate Blog Posts</DialogTitle>
          <DialogClose className="absolute right-4 top-4" />
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Blog Theme</label>
            <Input 
              placeholder="Enter blog theme..." 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Enter blog description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Number of Blogs</label>
            <Input
              type="number"
              min={1}
              max={10}
              value={numBlogs}
              onChange={(e) => setNumBlogs(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Writing Style</label>
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
            className="w-full" 
            disabled={getTopics.isLoading || !theme || !description || !numBlogs || !writingStyle}
          >
            {getTopics.isLoading ? 'Generating...' : 'Generate Titles'}
          </Button>
          {generatedTitles.length > 0 && (
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Generated Blog Topics:</h3>
                <ul className="space-y-2">
                  {generatedTitles.map((topic, index) => (
                    <li 
                      key={index}
                      className="p-2 bg-secondary/50 rounded-md text-sm"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
              <Button 
                type="button" 
                className="w-full" 
                onClick={handleGenerateBlogs}
                disabled={generateBlogs.isLoading}
              >
                {generateBlogs.isLoading ? 'Generating Blogs...' : 'Generate Blog Content'}
              </Button>
            </div>
          )}
        </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BlogList;