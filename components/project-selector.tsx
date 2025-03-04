"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

export function ProjectSelector() {
  const [projects, setProjects] = useState<Project[]>([
    { id: "1", name: "Project 1", slug: "project-1" },
    { id: "2", name: "Project 2", slug: "project-2" },
  ]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const router = useRouter();

  const handleCreateProject = async () => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const newProject = await response.json();
      setProjects([...projects, newProject]);
      setSelectedProject(newProject);
      setNewProjectName("");
      setNewProjectDescription("");
      router.refresh();
    } catch (error) {
      console.error("Error creating project:", error);
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
            {projects.map((project) => (
              <button
                key={project.id}
                className="flex items-center space-x-2 px-3 py-2 w-full text-sm hover:bg-secondary/10 rounded-md"
                onClick={() => {
                  setSelectedProject(project);
                  setIsDropdownOpen(false);
                }}
              >
                <span className="truncate">{project.name}</span>
              </button>
            ))}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center space-x-2 px-3 py-2 w-full text-sm hover:bg-secondary/10 border-t border-border">
                <Plus className="h-4 w-4" />
                <span>Create Project</span>
              </button>
            </DialogTrigger>
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Enter project description"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleCreateProject}
                  disabled={!newProjectName}
                >
                  Create Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}