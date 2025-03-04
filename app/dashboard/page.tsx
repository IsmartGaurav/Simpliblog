"use client";

import { FileText, BarChart3, Settings, Sparkles, X } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="p-4">
          {/* Alert banner */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 flex items-start">
            <div className="mr-3 mt-0.5">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">This is a demo starter kit.</p>
              <p className="text-sm text-muted-foreground">
                Replace this component after you have set up your environment.
              </p>
            </div>
            <button className="p-1 hover:bg-secondary/20 rounded-md">
              <X className="h-4 w-4" />
            </button>
          </div>

          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Recent Posts</h3>
              <p className="text-muted-foreground text-sm">
                You haven't created any posts yet.
              </p>
              <button className="mt-4 bg-primary text-primary-foreground px-4 py-2 text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
                Create New Post
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-muted-foreground text-sm">
                No analytics data available yet.
              </p>
              <button className="mt-4 bg-secondary text-secondary-foreground px-4 py-2 text-sm font-medium rounded-md hover:bg-secondary/80 transition-colors">
                View Details
              </button>
            </div>

            {/* Card 3 */}
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Settings</h3>
              <p className="text-muted-foreground text-sm">
                Configure your blog settings and preferences.
              </p>
              <button className="mt-4 bg-secondary text-secondary-foreground px-4 py-2 text-sm font-medium rounded-md hover:bg-secondary/80 transition-colors">
                Manage Settings
              </button>
            </div>
          </div>
    </div>
  );
};

export default Dashboard;