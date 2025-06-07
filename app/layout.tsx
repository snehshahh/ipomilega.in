"use client";

import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";
import { useState } from "react";
import { LoginDialog } from "@/components/ui/login";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, LogOut, TrendingUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Geist fonts are now imported directly from the geist package
const geistSans = GeistSans;
const geistMono = GeistMono;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const isAdmin =["admin@gmail.com","snehshah7634@gmail.com","shahvraj114@gmail.com"].includes(session?.user?.email || "");

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-6 py-3">
              <div className="flex h-14 items-center justify-between">
                {/* Logo Section */}
                <Link
                  href="/"
                  className="flex items-center space-x-2 transition-opacity hover:opacity-80"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <span className="text-xl font-bold text-primary tracking-tight">
                    IPO Dekho
                  </span>
                </Link>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center space-x-1">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-muted/50"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/blogs"
                    className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-muted/50"
                  >
                    Blogs
                  </Link>
                  <Link
                    href="/ipos"
                    className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-muted/50"
                  >
                    IPOs
                  </Link>
                  <Link
                    href="/analysis"
                    className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-muted/50"
                  >
                    Analysis
                  </Link>
                </nav>

                {/* Right Section */}
                <div className="flex items-center space-x-4">
                  <ThemeToggle />
                  {session ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-10 w-auto px-3 rounded-full hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={session?.user.image || ""} />
                              <AvatarFallback className="text-xs">
                                {session?.user.name?.charAt(0)?.toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="hidden sm:block text-sm font-medium text-foreground">
                              {session?.user.name}
                            </span>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-56 mt-2"
                        align="end"
                        forceMount
                      >
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {session?.user.name}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {session?.user.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                          onClick={handleSignOut}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Sign Out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button
                      onClick={() => setShowLoginDialog(true)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full font-medium transition-all hover:shadow-md"
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1">
            {children}
            <Toaster position="top-right" richColors />
          </main>

          <LoginDialog
            isOpen={showLoginDialog}
            onClose={() => setShowLoginDialog(false)}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}