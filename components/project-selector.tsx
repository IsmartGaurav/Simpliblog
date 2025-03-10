"use client";

import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Project = {
  id: string;
  name: string;
  slug: string;
};

interface ProjectSelectorProps {
  selectedProjectId?: string;
  onProjectChange?: (projectId: string) => void;
}

// This is for cross-component communication
const PROJECT_STORAGE_KEY = 'selectedProjectId';
const DEFAULT_PROJECT = { id: "default", name: "Default Project", slug: "default" };

export function ProjectSelector({ selectedProjectId, onProjectChange }: ProjectSelectorProps = {}) {
  // Fetch all projects using TRPC
  const { data: projects = [], isLoading, refetch } = api.project.getProjects.useQuery();
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [newProjectName, setNewProjectName] = useState("");
  const [editProjectName, setEditProjectName] = useState("");
  const [editProjectId, setEditProjectId] = useState("");
  
  const router = useRouter();

  // Initialize from localStorage or props on component mount
  useEffect(() => {
    const initializeProject = () => {
      // First check localStorage
      const storedProjectId = typeof window !== 'undefined' ? localStorage.getItem(PROJECT_STORAGE_KEY) : null;
      
      // Logic to select initial project
      if (storedProjectId) {
        // If we have a stored ID, try to find it in the projects list
        if (projects.length > 0) {
          const project = projects.find(p => p.id === storedProjectId);
          if (project) {
            setSelectedProject(project);
            return;
          }
        }
        
        // If it's the default project, we can set it without checking the projects list
        if (storedProjectId === DEFAULT_PROJECT.id) {
          setSelectedProject(DEFAULT_PROJECT);
          return;
        }
      }
      
      // Fall back to prop if no valid localStorage value
      if (selectedProjectId) {
        if (selectedProjectId === DEFAULT_PROJECT.id) {
          setSelectedProject(DEFAULT_PROJECT);
          return;
        }
        
        if (projects.length > 0) {
          const project = projects.find(p => p.id === selectedProjectId);
          if (project) {
            setSelectedProject(project);
            return;
          }
        }
      }
      
      // Final fallback: use default project
      setSelectedProject(DEFAULT_PROJECT);
    };
    
    initializeProject();
  }, [projects, selectedProjectId]);

  // Create project mutation
  const createProjectMutation = api.project.createProject.useMutation({
    onSuccess: (newProject) => {
      toast.success("Project created successfully");
      setIsCreateDialogOpen(false);
      setNewProjectName("");
      refetch();
      
      // Select the newly created project
      handleProjectSelect(newProject);
      
      router.refresh();
    },
    onError: (error) => {
      toast.error(`Failed to create project: ${error.message}`);
    }
  });
  
  // Update project mutation
  const updateProjectMutation = api.project.updateProject.useMutation({
    onSuccess: (updatedProject) => {
      toast.success("Project updated successfully");
      setIsEditDialogOpen(false);
      setEditProjectName("");
      setEditProjectId("");
      refetch();
      
      // If we updated the currently selected project, update the display
      if (selectedProject && selectedProject.id === updatedProject.id) {
        setSelectedProject(updatedProject);
      }
      
      router.refresh();
    },
    onError: (error) => {
      toast.error(`Failed to update project: ${error.message}`);
    }
  });

  // Delete project mutation
  const deleteProjectMutation = api.project.deleteProject.useMutation({
    onSuccess: () => {
      toast.success("Project deleted successfully");
      setIsDeleteDialogOpen(false);
      refetch();
      
      // If we deleted the currently selected project, switch to default
      if (selectedProject && selectedProject.id === editProjectId) {
        handleProjectSelect(DEFAULT_PROJECT);
      }
      
      router.refresh();
    },
    onError: (error) => {
      toast.error(`Failed to delete project: ${error.message}`);
    }
  });

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast.error("Project name is required");
      return;
    }

    createProjectMutation.mutate({
      name: newProjectName.trim()
    });
  };

  const handleEditProject = () => {
    if (!editProjectName.trim() || !editProjectId) {
      toast.error("Project name is required");
      return;
    }

    updateProjectMutation.mutate({
      id: editProjectId,
      name: editProjectName.trim()
    });
  };

  const handleDeleteProject = () => {
    if (!editProjectId) {
      toast.error("No project selected for deletion");
      return;
    }

    deleteProjectMutation.mutate({
      id: editProjectId
    });
  };

  const openEditDialog = (project: Project) => {
    setEditProjectId(project.id);
    setEditProjectName(project.name);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (project: Project) => {
    setEditProjectId(project.id);
    setEditProjectName(project.name);
    setIsDeleteDialogOpen(true);
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setIsDropdownOpen(false);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(PROJECT_STORAGE_KEY, project.id);
    }
    
    // Dispatch a custom event for real-time updates
    if (typeof window !== 'undefined') {
      // Use both methods to ensure all components get updated
      // 1. CustomEvent for in-page communication
      window.dispatchEvent(new CustomEvent('projectChanged', { 
        detail: { projectId: project.id }
      }));
      
      // 2. Storage event for cross-tab communication
      // We need to manually dispatch a storage event for the current tab
      window.dispatchEvent(new StorageEvent('storage', {
        key: PROJECT_STORAGE_KEY,
        newValue: project.id,
        storageArea: localStorage
      }));
    }
    
    // Call the prop callback if provided
    if (onProjectChange) {
      onProjectChange(project.id);
    }
  };

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 px-4 py-2 w-full hover:bg-secondary/10 rounded-md"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span className="font-medium text-sm truncate">
          {selectedProject?.name || "Select Project"}
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isDropdownOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-card border border-border rounded-md shadow-lg z-50">
          <div className="p-2 space-y-1">
            <button
              className="flex items-center space-x-2 px-3 py-2 w-full text-sm hover:bg-secondary/10 rounded-md"
              onClick={() => handleProjectSelect(DEFAULT_PROJECT)}
            >
              <span className="truncate">Default Project</span>
            </button>
            
            {projects.map((project) => (
              <div key={project.id} className="flex items-center">
              <button
                  className="flex-1 flex items-center space-x-2 px-3 py-2 text-sm hover:bg-secondary/10 rounded-md"
                  onClick={() => handleProjectSelect(project)}
              >
                <span className="truncate">{project.name}</span>
              </button>
                
                {/* Edit button */}
                <button
                  className="p-1 hover:bg-secondary/10 rounded-md mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditDialog(project);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </button>
                
                {/* Delete button */}
                <button
                  className="p-1 hover:bg-destructive/10 hover:text-destructive rounded-md mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteDialog(project);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          
          {/* Create Project button */}
          <button 
            className="flex items-center space-x-2 px-3 py-2 w-full text-sm hover:bg-secondary/10 border-t border-border"
            onClick={() => setIsCreateDialogOpen(true)}
          >
                <Plus className="h-4 w-4" />
                <span>Create Project</span>
              </button>
        </div>
      )}

      {/* Create Project Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium block mb-2">Project Name</label>
                  <Input
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name"
                  />
                </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateProject} disabled={createProjectMutation.isLoading}>
              {createProjectMutation.isLoading ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium block mb-2">Project Name</label>
                  <Input
              value={editProjectName}
              onChange={(e) => setEditProjectName(e.target.value)}
              placeholder="Enter project name"
                  />
                </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditProject} disabled={updateProjectMutation.isLoading}>
              {updateProjectMutation.isLoading ? 'Updating...' : 'Update Project'}
                </Button>
          </DialogFooter>
            </DialogContent>
          </Dialog>

      {/* Delete Project Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the project "{editProjectName}" and all its associated blogs. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}