"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const ComingSoonPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Chat</h1>
          <p className="text-xl text-muted-foreground">Our intelligent conversation assistant is coming soon</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card className="overflow-hidden border-none shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <CardHeader>
              <CardTitle>Smart Conversations</CardTitle>
              <CardDescription>Engage with our AI to generate ideas and get instant feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-40 w-full rounded-md bg-muted/50 flex items-center justify-center">
                <Image 
                  src="/globe.svg" 
                  alt="AI Conversation" 
                  width={80} 
                  height={80} 
                  className="opacity-80"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-none shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <CardHeader>
              <CardTitle>Content Generation</CardTitle>
              <CardDescription>Create blog posts, articles, and more with AI assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-40 w-full rounded-md bg-muted/50 flex items-center justify-center">
                <Image 
                  src="/file.svg" 
                  alt="Content Generation" 
                  width={80} 
                  height={80} 
                  className="opacity-80"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-6 px-4 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
            <span className="mr-2 size-2 rounded-full bg-green-500 animate-pulse"></span>
            In Development
          </div>
          
          <div className="max-w-2xl mx-auto mb-8">
            <p className="text-muted-foreground">We're working hard to bring you a powerful AI chat experience. This feature will allow you to create content, get writing assistance, and generate ideas through natural conversation.</p>
          </div>
          
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
            Explore Other Features
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;