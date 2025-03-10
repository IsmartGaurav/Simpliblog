'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, Eye, Clock, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for charts
const pageViewsData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 500 },
  { name: 'Apr', value: 200 },
  { name: 'May', value: 450 },
  { name: 'Jun', value: 600 },
  { name: 'Jul', value: 350 },
];

const visitorData = [
  { name: 'Jan', value: 120 },
  { name: 'Feb', value: 150 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 80 },
  { name: 'May', value: 230 },
  { name: 'Jun', value: 300 },
  { name: 'Jul', value: 190 },
];

const popularPostsData = [
  { title: "10 Tips for Better SEO", views: 1245, change: 12.5 },
  { title: "How to Start a Successful Blog", views: 986, change: -3.2 },
  { title: "Content Marketing Strategies", views: 879, change: 8.7 },
  { title: "Social Media Best Practices", views: 654, change: 5.1 },
  { title: "Email Marketing Guide", views: 521, change: -1.8 },
];

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Calculate total views
  const totalViews = pageViewsData.reduce((sum, item) => sum + item.value, 0);
  const totalVisitors = visitorData.reduce((sum, item) => sum + item.value, 0);
  
  // Find max value for scaling the chart
  const maxPageViews = Math.max(...pageViewsData.map(item => item.value));
  const maxVisitors = Math.max(...visitorData.map(item => item.value));

  return (
    <div className="space-y-8 pb-10">
      {/* Hero section */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5 rounded-xl p-8 border border-border/50 shadow-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] dark:bg-grid-black/10" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shadow-sm">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Analytics Dashboard</h1>
          </div>
          <p className="text-muted-foreground mb-6 text-lg leading-relaxed max-w-3xl">
            Track your blog performance with detailed analytics. Monitor page views, visitor engagement, and content performance to optimize your strategy.
          </p>
        </div>
      </div>

      {/* Time range selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Performance Overview</h2>
        <Tabs defaultValue="7d" className="w-[400px]" onValueChange={setTimeRange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="30d">30d</TabsTrigger>
            <TabsTrigger value="90d">90d</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                <div className="flex items-center mt-1 text-xs">
                  <span className="flex items-center text-emerald-500 font-medium">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> 8.2%
                  </span>
                  <span className="text-muted-foreground ml-1">vs. previous period</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unique Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-2xl font-bold">{totalVisitors.toLocaleString()}</div>
                <div className="flex items-center mt-1 text-xs">
                  <span className="flex items-center text-emerald-500 font-medium">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> 12.5%
                  </span>
                  <span className="text-muted-foreground ml-1">vs. previous period</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Time on Page</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-2xl font-bold">3m 42s</div>
                <div className="flex items-center mt-1 text-xs">
                  <span className="flex items-center text-emerald-500 font-medium">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> 5.3%
                  </span>
                  <span className="text-muted-foreground ml-1">vs. previous period</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-2xl font-bold">42.3%</div>
                <div className="flex items-center mt-1 text-xs">
                  <span className="flex items-center text-rose-500 font-medium">
                    <ArrowDownRight className="h-3 w-3 mr-1" /> 2.1%
                  </span>
                  <span className="text-muted-foreground ml-1">vs. previous period</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Page Views</CardTitle>
            <CardDescription>Daily page views over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {/* Simple bar chart visualization */}
              <div className="flex h-[250px] items-end space-x-2">
                {pageViewsData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-12 bg-primary/80 hover:bg-primary rounded-t transition-all" 
                      style={{ height: `${(item.value / maxPageViews) * 200}px` }}
                    />
                    <div className="mt-2 text-xs text-muted-foreground">{item.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Visitors</CardTitle>
            <CardDescription>Unique visitors over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {/* Simple bar chart visualization */}
              <div className="flex h-[250px] items-end space-x-2">
                {visitorData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-12 bg-secondary/80 hover:bg-secondary rounded-t transition-all" 
                      style={{ height: `${(item.value / maxVisitors) * 200}px` }}
                    />
                    <div className="mt-2 text-xs text-muted-foreground">{item.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular posts section */}
      <div>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>Popular Content</span>
        </h2>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
            <CardDescription>Posts with the highest engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularPostsData.map((post, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="text-sm text-muted-foreground">{post.views.toLocaleString()} views</p>
                    </div>
                  </div>
                  <div className={cn(
                    "flex items-center text-sm font-medium",
                    post.change > 0 ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {post.change > 0 ? (
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-4 w-4" />
                    )}
                    {Math.abs(post.change)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar heatmap section */}
      <div>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span>Publishing Activity</span>
        </h2>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Content Calendar</CardTitle>
            <CardDescription>Your publishing frequency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {/* Calendar heatmap visualization would go here */}
              <p className="text-center text-muted-foreground col-span-7">Calendar visualization coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;