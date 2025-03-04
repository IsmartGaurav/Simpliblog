"use client";

import { DashboardNavigation } from "@/components/dashboard/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <DashboardNavigation />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Add top spacing to prevent content from being hidden under the header */}
        <div className="h-16"></div>
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}