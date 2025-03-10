'use client';

import { useState, useEffect, useCallback } from 'react';
import BlogList from "@/app/dashboard/blog-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PencilLine, Sparkles, Lightbulb, Edit, Target } from "lucide-react";
import { cn } from "@/lib/utils";

// Same constant as in project-selector to maintain consistency
const PROJECT_STORAGE_KEY = 'selectedProjectId';
const DEFAULT_PROJECT_ID = 'default';

const GenerateBlog = () => {
  const [projectId, setProjectId] = useState<string>(DEFAULT_PROJECT_ID);
  
  // Handle project change event
  const handleProjectChange = useCallback((newProjectId: string) => {
    setProjectId(newProjectId);
    console.log(`Generate Blog page: Project changed to ${newProjectId}`);
  }, [setProjectId]);
  
  // Initialize from localStorage and listen for changes
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

  return (
    <div className="space-y-10 pb-8">
      {/* Enhanced Hero Section with integrated blog generator */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5 rounded-xl p-8 border border-border/50 shadow-sm overflow-hidden relative transition-all duration-300 hover:shadow-md">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] dark:bg-grid-black/10" />
        <div className="max-w-3xl relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shadow-sm transition-transform duration-300 hover:scale-105">
              <PencilLine className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Generate Blog Posts</h1>
          </div>
          <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
            Create high-quality blog content with AI assistance. Define your topic, style, and preferences, 
            then let our AI generate engaging blog posts tailored to your needs.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/50 backdrop-blur-sm rounded-full px-4 py-2 w-fit shadow-sm border border-border/50 mb-6">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span>Powered by advanced AI to create SEO-friendly content</span>
          </div>
          
          {/* Integrated Blog Generator - Directly in hero section */}
          <div className="mt-8 w-full">
            <BlogList selectedProjectId={projectId} />
          </div>
        </div>
      </div>

      {/* Tips Section with enhanced styling */}
      <div>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <span>Tips for Great Content</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className={cn(
            "bg-card/50 backdrop-blur-sm border-border/50 shadow-sm",
            "transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
          )}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Define Clear Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Specify clear topics and themes to get more focused and relevant blog content.
              </p>
            </CardContent>
          </Card>
          <Card className={cn(
            "bg-card/50 backdrop-blur-sm border-border/50 shadow-sm",
            "transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
          )}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <PencilLine className="h-4 w-4 text-primary" />
                Choose Your Style
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Select a writing style that matches your brand voice and audience preferences.
              </p>
            </CardContent>
          </Card>
          <Card className={cn(
            "bg-card/50 backdrop-blur-sm border-border/50 shadow-sm",
            "transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
          )}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Edit className="h-4 w-4 text-primary" />
                Review & Edit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Always review and edit generated content to add your personal touch and ensure accuracy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GenerateBlog;