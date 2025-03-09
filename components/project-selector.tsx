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

  // Initialize from localStorage on component mount
  useEffect(() => {
    const storedProjectId = localStorage.getItem('selectedProjectId');
    
    if (storedProjectId) {
      // If we have a stored project ID, use that
      if (projects.length > 0) {
        const project = projects.find(p => p.id === storedProjectId);
        if (project) {
          setSelectedProject(project);
        } else if (storedProjectId === "default") {
          setSelectedProject({ id: "default", name: "Default Project", slug: "default" });
        }
      } else if (storedProjectId === "default") {
        // Projects haven't loaded yet, but we know it's the default project
        setSelectedProject({ id: "default", name: "Default Project", slug: "default" });
      }
    } else if (selectedProjectId) {
      // Fall back to prop if no localStorage value
      const isDefault = selectedProjectId === "default";
      if (isDefault) {
        setSelectedProject({ id: "default", name: "Default Project", slug: "default" });
      } else if (projects.length > 0) {
        const project = projects.find(p => p.id === selectedProjectId);
        if (project) {
          setSelectedProject(project);
        }
      }
    }
  }, [projects, selectedProjectId]);

  // Update selected project when projects load or selectedProjectId prop changes
  useEffect(() => {
    if (selectedProjectId && projects.length > 0) {
      const project = projects.find(p => p.id === selectedProjectId);
      if (project) {
        setSelectedProject(project);
      } else if (selectedProjectId === "default") {
        setSelectedProject({ id: "default", name: "Default Project", slug: "default" });
      }
    }
  }, [selectedProjectId, projects]);

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
    onSuccess: () => {
      toast.success("Project updated successfully");
      setIsEditDialogOpen(false);
      setEditProjectName("");
      setEditProjectId("");
      refetch();
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
        handleProjectSelect({ id: "default", name: "Default Project", slug: "default" });
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
    localStorage.setItem('selectedProjectId', project.id);
    
    // Dispatch a custom event for real-time updates
    const event = new CustomEvent('projectChanged', { 
      detail: { projectId: project.id }
    });
    window.dispatchEvent(event);
    
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
              onClick={() => handleProjectSelect({ id: "default", name: "Default Project", slug: "default" })}
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
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name</label>
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
              <Button
                onClick={handleCreateProject}
                disabled={createProjectMutation.isLoading || !newProjectName.trim()}
              >
                {createProjectMutation.isLoading ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name</label>
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
              <Button
                onClick={handleEditProject}
                disabled={updateProjectMutation.isLoading || !editProjectName.trim()}
              >
                {updateProjectMutation.isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Project Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project "{editProjectName}" and all its blogs. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteProjectMutation.isLoading ? "Deleting..." : "Delete Project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}