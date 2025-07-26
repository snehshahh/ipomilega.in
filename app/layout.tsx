"use client";

import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
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
import { ProgressProvider } from "@/components/Progressbar/ProgressProvider";
import { ProgressLink } from "@/components/Progressbar/ProgressLink";

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

  const isAdmin = ["admin@gmail.com", "snehshah7634@gmail.com", "shahvraj114@gmail.com"].includes(session?.user?.email || "");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Suravaram&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen items-center"
      >
        <ProgressProvider>
          <header className="fixed  font-ibm-plex top-0 z-50 w-full backdrop-blur-md bg-transparent border-b border-white/10">
            {/* Full width responsive container like homepage sections */}
            <div className="w-full app-container">
              <div className="max-w-7xl mx-auto  flex h-15 font-bold justify-between" style={{ fontWeight: "400" }}>
                <ProgressLink
                  href="/"
                  className="flex items-center space-x-2 transition-opacity hover:opacity-80"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <span className="text-2xl font-bold text-black tracking-tight drop-shadow-lg">
                    IPO Milega
                  </span>
                </ProgressLink>
                <div className="flex items-center space-x-4 text-xl">
                  <nav className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-1">
                    {isAdmin && (
                      <ProgressLink
                        href="/admin"
                        className="relative px-4 py-2 text-sm font-medium text-black/80 transition-colors hover:text-black rounded-md hover:bg-white/10 backdrop-blur-sm w-full sm:w-auto text-center"
                      >
                        Admin
                      </ProgressLink>
                    )}
                    <ProgressLink
                      href="/"
                      className="relative px-4 py-2 text-sm font-medium text-black/80 transition-colors hover:text-black rounded-md hover:bg-white/10 backdrop-blur-sm w-full sm:w-auto text-center"
                    >
                      Home
                    </ProgressLink>
                    <ProgressLink
                      href="/blogs"
                      className="relative px-4 py-2 text-sm font-medium text-black/80 transition-colors hover:text-black rounded-md hover:bg-white/10 backdrop-blur-sm w-full sm:w-auto text-center"
                    >
                      Blogs
                    </ProgressLink>
                    <ProgressLink
                      href="/ipos"
                      className="relative px-4 py-2 text-sm font-medium text-black/80 transition-colors hover:text-black rounded-md hover:bg-white/10 backdrop-blur-sm w-full sm:w-auto text-center"
                    >
                      IPOs
                    </ProgressLink>
                    <ProgressLink
                      href="/analysis"
                      className="relative px-4 py-2 text-sm font-medium text-black/80 transition-colors hover:text-black rounded-md hover:bg-white/10 backdrop-blur-sm w-full sm:w-auto text-center"
                    >
                      Analysis
                    </ProgressLink>
                  </nav>
                  {session ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-10 w-auto px-3 rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
                        >
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={session?.user.image || ""} />
                              <AvatarFallback className="text-xs">
                                {session?.user.name?.charAt(0)?.toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="hidden sm:block text-sm font-medium text-black">
                              {session?.user.name}
                            </span>
                            <ChevronDown className="h-4 w-4 text-black/60" />
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-56 mt-2 backdrop-blur-md bg-white/90 dark:bg-gray-900/90"
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
                      className="bg-[#212121] hover:bg-[#212121]/10 text-white px-6 py-2 rounded-full font-medium transition-all hover:shadow-md backdrop-blur-sm"
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </header>
          <main> {/* Adjusted padding for fixed header */}
            {children}
            <Toaster position="top-right" richColors />
          </main>
          <LoginDialog
            isOpen={showLoginDialog}
            onClose={() => setShowLoginDialog(false)}
          />
        </ProgressProvider>
      </body>
    </html>
  );
}