'use client';

import { useState } from 'react';
import { api } from "@/utils/api";
import BlogGeneratorButton from "@/app/dashboard/blog-list";
import { ProjectSelector } from '@/components/project-selector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Create = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('default');
  
  // Get the current project name for display
  const { data: projects } = api.project.getProjects.useQuery();
  const currentProjectName = selectedProjectId === 'default' 
    ? 'Default Project' 
    : projects?.find(p => p.id === selectedProjectId)?.name || 'Unknown Project';
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Create Blog Content</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Project</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <ProjectSelector 
              selectedProjectId={selectedProjectId} 
              onProjectChange={setSelectedProjectId} 
            />
            <p className="text-sm text-muted-foreground mt-4">
              Currently working with: <span className="font-medium">{currentProjectName}</span>
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        <BlogGeneratorButton selectedProjectId={selectedProjectId} />
      </div>
    </div>
  )
}

export default Create; 