'use client'

import React, { useState } from "react"
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
  const refetch = useRefetch()
  const getTopics = api.blog.getTopics.useMutation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme || !description || !numBlogs || !writingStyle) return;
    
    // Set the dialog to remain open during API call
    getTopics.mutate({
      projectId: "default",
      theme,
      description,
      number: parseInt(numBlogs),
      style: writingStyle
    })
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full sm:w-auto">Generate New Blogs</Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] max-w-[425px] p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Blog Posts</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Blog Theme</label>
            <Input 
              placeholder="Enter blog theme..." 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              placeholder="Enter blog description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium mb-2 block">Number of Blogs</label>
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
            <label className="text-sm font-medium mb-2 block">Writing Style</label>
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
            variant="default"
            disabled={getTopics.isLoading || !theme || !description || !numBlogs || !writingStyle}
            aria-busy={getTopics.isLoading}
            className={`w-full ${getTopics.isLoading ? "cursor-wait" : "cursor-pointer"}`}
          >
            {getTopics.isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating Titles...</span>
              </div>
            ) : (
              'Generate Titles'
            )}
          </Button>
          {getTopics.data && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Generated Blog Topics:</h3>
              <div className="max-h-[200px] overflow-y-auto">
                <ul className="space-y-2">
                  {getTopics.data.map((topic, index) => (
                    <li 
                      key={index}
                      className="p-2 bg-secondary/50 rounded-md text-sm"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogList;