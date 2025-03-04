"use client";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { ProjectSelector } from './project-selector'
import { useState, useEffect } from 'react'
import { ThemeProvider } from "./theme-provider"
import { useTheme } from "next-themes"
import Link from 'next/link'
import { ThemeToggle } from "./ui/theme-toggle"
import { usePathname } from 'next/navigation'

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  // Check if current path is dashboard
  const isDashboard = pathname?.startsWith('/dashboard');
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <ClerkProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <html lang="en" suppressHydrationWarning>
          <body className="antialiased min-h-screen bg-background text-foreground">
            {/* Only show header on non-dashboard pages */}
            {!isDashboard && (
              <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-16 items-center justify-between px-2 sm:px-4">
                  {/* Logo or Project Selector */}
                  {isDashboard ? (
                    <div className="flex items-center">
                      <ProjectSelector />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Link href="/" className="flex items-center space-x-2">
                        <div className="relative h-8 w-8 overflow-hidden">
                          <img src="/logo.svg" alt="SimpliBlog Logo" className="object-contain" width={32} height={32} />
                        </div>
                        <span className="font-bold text-xl">SimpliBlog</span>
                      </Link>
                    </div>
                  )}
                  
                  {/* Navigation - Desktop */}
                  <nav className="hidden md:flex items-center space-x-6">
                    <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
                    <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How It Works</Link>
                    <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
                    
                    <SignedOut>
                      <SignInButton mode="modal">
                        <button className="text-sm font-medium hover:text-primary transition-colors">Login</button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="ml-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors">
                          Get Started
                        </button>
                      </SignUpButton>
                    </SignedOut>
                    
                    <SignedIn>
                      <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
                      <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                    
                    {/* Theme Toggle Button - Moved to the end */}
                    <ThemeToggle />
                  </nav>
                  
                  {/* Mobile menu button */}
                  <div className="md:hidden flex items-center space-x-2">
                    {/* Theme Toggle Button for Mobile */}
                    <ThemeToggle />
                    
                    <button
                      className="p-2 rounded-md hover:bg-secondary/20 transition-colors"
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                      {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                  </div>
                </div>
              </header>
            )}
            
            {/* Mobile Navigation Menu - Updated to cover full screen */}
            {mobileMenuOpen && !isDashboard && (
              <div className="fixed inset-0 z-40 bg-background dark:bg-black md:hidden">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center p-4 border-b border-border dark:border-gray-800">
                    <Link href="/" className="flex items-center space-x-2">
                      <div className="relative h-8 w-8 overflow-hidden">
                        <img src="/logo.svg" alt="SimpliBlog Logo" className="object-contain" width={32} height={32} />
                      </div>
                      <span className="font-bold text-xl">SimpliBlog</span>
                    </Link>
                    <button 
                      className="p-2 rounded-md hover:bg-secondary/20 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <nav className="flex flex-col p-4">
                    <Link 
                      href="#features" 
                      className="py-3 text-lg font-medium border-b border-border dark:border-gray-800 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Features
                    </Link>
                    <Link 
                      href="#how-it-works" 
                      className="py-3 text-lg font-medium border-b border-border dark:border-gray-800 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      How It Works
                    </Link>
                    <Link 
                      href="#pricing" 
                      className="py-3 text-lg font-medium border-b border-border dark:border-gray-800 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Pricing
                    </Link>
                  </nav>
                  
                  <div className="mt-auto p-4">
                    <SignedOut>
                      <p className="text-muted-foreground mb-2">Existing customer?</p>
                      <SignInButton mode="modal">
                        <button 
                          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors w-full mb-3"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Login
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button 
                          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-primary-foreground bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors w-full"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Get Started
                        </button>
                      </SignUpButton>
                    </SignedOut>
                    
                    <SignedIn>
                      <Link 
                        href="/dashboard" 
                        className="inline-flex items-center justify-center px-6 py-3 text-base font-medium bg-primary text-primary-foreground rounded-md shadow-sm hover:bg-primary/90 transition-colors w-full mb-3"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <div className="mt-4 flex justify-center">
                        <UserButton afterSignOutUrl="/" />
                      </div>
                    </SignedIn>
                  </div>
                </div>
              </div>
            )}
            
            {children}
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  )
}