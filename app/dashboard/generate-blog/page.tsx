"use client";

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Same constant as in project-selector to maintain consistency
const PROJECT_STORAGE_KEY = 'selectedProjectId';
const DEFAULT_PROJECT_ID = 'default';

export default function GenerateBlogPage() {
  // State management
  const [projectId, setProjectId] = useState<string>(DEFAULT_PROJECT_ID);
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [isGeneratingTopics, setIsGeneratingTopics] = useState(false);
  const [isGeneratingBlog, setIsGeneratingBlog] = useState(false);
  const [toneOfVoice, setToneOfVoice] = useState('professional');
  const router = useRouter();
  
  // Get projectId from localStorage and listen for changes
  const handleProjectChange = useCallback((newProjectId: string) => {
    setProjectId(newProjectId);
    console.log(`Generate Blog page: Project changed to ${newProjectId}`);
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
  
  // Get project data for display
  const { data: projects } = api.project.getProjects.useQuery();
  const currentProjectName = projectId === DEFAULT_PROJECT_ID 
    ? 'Default Project' 
    : projects?.find(p => p.id === projectId)?.name || 'Unknown Project';
  
  // Topic generation mutation
  const generateTopics = api.blog.getTopics.useMutation({
    onSuccess: (data) => {
      setSuggestedTopics(data.topics);
      setIsGeneratingTopics(false);
    },
    onError: (error) => {
      toast.error(`Failed to generate topics: ${error.message}`);
      setIsGeneratingTopics(false);
    }
  });
  
  // Blog generation mutation
  const generateBlogs = api.blog.generateBlogs.useMutation({
    onSuccess: () => {
      toast.success('Blog generated successfully!');
      setIsGeneratingBlog(false);
      router.push('/dashboard/blogs');
    },
    onError: (error) => {
      toast.error(`Failed to generate blog: ${error.message}`);
      setIsGeneratingBlog(false);
    }
  });
  
  const handleGenerateTopics = () => {
    if (!keywords.trim()) {
      toast.error('Please enter keywords');
      return;
    }
    
    setIsGeneratingTopics(true);
    generateTopics.mutate({ keywords: keywords.trim() });
  };
  
  const handleGenerateBlog = () => {
    if (!topic.trim()) {
      toast.error('Please enter or select a topic');
      return;
    }
    
    setIsGeneratingBlog(true);
    generateBlogs.mutate({
      projectId,
      topic: topic.trim(),
      keywords: keywords.trim(),
      toneOfVoice
    });
  };
  
  const handleTopicSelect = (selectedTopic: string) => {
    setTopic(selectedTopic);
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Generate Blog Content</h1>
      
      <Card className="p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Current Project</h2>
          <p className="text-muted-foreground">
            Currently working with: <span className="font-medium">{currentProjectName}</span>
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="keywords" className="block text-sm font-medium mb-2">
              Keywords
            </label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Enter keywords separated by commas"
              className="w-full"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Example: AI, technology, future, machine learning
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleGenerateTopics}
              disabled={isGeneratingTopics}
            >
              {isGeneratingTopics ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Topics...
                </>
              ) : (
                'Generate Topic Ideas'
              )}
            </Button>
          </div>
        </div>
      </Card>
      
      {suggestedTopics.length > 0 && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Suggested Topics</h2>
          <div className="grid gap-2">
            {suggestedTopics.map((suggestedTopic, index) => (
              <div 
                key={index}
                className="p-3 border border-border rounded-md cursor-pointer hover:bg-secondary/10"
                onClick={() => handleTopicSelect(suggestedTopic)}
              >
                {suggestedTopic}
              </div>
            ))}
          </div>
        </Card>
      )}
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Generate Blog</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium mb-2">
              Blog Topic
            </label>
            <Textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic for your blog"
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="tone" className="block text-sm font-medium mb-2">
              Tone of Voice
            </label>
            <Select value={toneOfVoice} onValueChange={setToneOfVoice}>
              <SelectTrigger id="tone" className="w-full">
                <SelectValue placeholder="Select a tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="conversational">Conversational</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                <SelectItem value="informative">Informative</SelectItem>
                <SelectItem value="authoritative">Authoritative</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleGenerateBlog}
              disabled={isGeneratingBlog || !topic.trim()}
              className="w-full md:w-auto"
            >
              {isGeneratingBlog ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Blog...
                </>
              ) : (
                'Generate Blog Article'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}