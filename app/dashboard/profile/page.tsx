'use client';

import { UserProfile } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings } from "lucide-react";

const ProfilePage = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* Hero section */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5 rounded-xl p-8 border border-border/50 shadow-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] dark:bg-grid-black/10" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shadow-sm">
              <User className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Profile Settings</h1>
          </div>
          <p className="text-muted-foreground mb-6 text-lg leading-relaxed max-w-3xl">
            Manage your account settings and preferences. Update your profile information, change your password, and configure your notification settings.
          </p>
        </div>
      </div>

      {/* Profile section */}
      <div>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <span>Account Settings</span>
        </h2>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Manage your account information and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full max-w-3xl mx-auto">
              <UserProfile />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;