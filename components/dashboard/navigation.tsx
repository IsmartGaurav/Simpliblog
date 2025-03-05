"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  FileText, 
  Home, 
  Mail, 
  Settings, 
  Upload, 
  User, 
  CreditCard, 
  Youtube, 
  BookOpen, 
  FileCode2, 
  Menu, 
  X,
  Sparkles
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { ProjectSelector } from "@/components/project-selector";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const DashboardNavigation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <div className="flex-1">
            <ProjectSelector />
          </div>
          <button 
            className="lg:hidden p-2 rounded-md hover:bg-secondary/20"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="py-4">
          <div className="px-4 mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Navigation
            </p>
          </div>
          <nav className="space-y-1">
            <Link 
              href="/dashboard" 
              className={`flex items-center px-4 py-2 text-sm font-medium ${pathname === "/dashboard" ? "bg-secondary/20 text-foreground border-l-2 border-primary" : "text-muted-foreground hover:bg-secondary/10 hover:text-foreground"}`}
            >
              <Home className={`mr-3 h-5 w-5 ${pathname === "/dashboard" ? "text-primary" : ""}`} />
              Dashboard
            </Link>
            <Link 
              href="/dashboard/posts" 
              className={`flex items-center px-4 py-2 text-sm font-medium ${pathname === "/dashboard/posts" ? "bg-secondary/20 text-foreground border-l-2 border-primary" : "text-muted-foreground hover:bg-secondary/10 hover:text-foreground"}`}
            >
              <FileText className={`mr-3 h-5 w-5 ${pathname === "/dashboard/posts" ? "text-primary" : ""}`} />
              Posts
            </Link>
          </nav>

          <div className="px-4 mt-8 mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Features
            </p>
          </div>
          <nav className="space-y-1">
            <Link 
              href="/dashboard/emails" 
              className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/10 hover:text-foreground"
            >
              <Mail className="mr-3 h-5 w-5" />
              Send Emails
            </Link>
            <Link 
              href="/dashboard/uploads" 
              className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/10 hover:text-foreground"
            >
              <Upload className="mr-3 h-5 w-5" />
              Upload Files
            </Link>
            <Link 
              href="/dashboard/ai" 
              className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/10 hover:text-foreground"
            >
              <Sparkles className="mr-3 h-5 w-5" />
              AI Integration
            </Link>
          </nav>

          <div className="px-4 mt-8 mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Settings
            </p>
          </div>
          <nav className="space-y-1">
            <Link 
              href="/dashboard/billing" 
              className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/10 hover:text-foreground"
            >
              <CreditCard className="mr-3 h-5 w-5" />
              Billing
            </Link>
            <Link 
              href="/dashboard/profile" 
              className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/10 hover:text-foreground"
            >
              <User className="mr-3 h-5 w-5" />
              Profile
            </Link>
          </nav>

          <div className="px-4 mt-8">
            <Dialog>
              <DialogTrigger asChild>
                <div className="rounded-lg bg-secondary/10 p-4 border border-border cursor-pointer hover:bg-secondary/20 transition-all">
                  <h3 className="font-medium">Upgrade to Pro</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upgrade to access all the features and benefits.
                  </p>
                  <button className="mt-3 w-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium rounded-md hover:bg-primary/90 transition-colors cursor-pointer">
                    Upgrade
                  </button>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>No Subscription Required</DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground mt-2">This is a demo application. No subscription is required to use all features.</p>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </aside>

      {/* Top header */}
      <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 border-b border-border bg-background z-30 flex items-center justify-between px-4">
        <button 
          className="p-2 rounded-md hover:bg-secondary/20 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center ml-auto space-x-4">
          <ThemeToggle />
          <button className="p-2 rounded-full hover:bg-secondary/20 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          <div className="ml-2">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
    </>
  );
};