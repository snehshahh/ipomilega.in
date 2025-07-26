"use client";

import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";
import { useState } from "react";
import { LoginDialog } from "@/components/ui/login";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, LogOut, TrendingUp, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProgressLink } from "@/components/Progressbar/ProgressLink";

export default function Header() {
  const { data: session } = useSession();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const isAdmin = [
    "admin@gmail.com",
    "snehshah7634@gmail.com",
    "shahvraj114@gmail.com",
  ].includes(session?.user?.email || "");

  return (
    <>
      <header className="fixed font-ibm-plex top-0 z-50 w-full backdrop-blur-md bg-transparent border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-30 py-2">
          <div
            className="flex h-15 items-center font-bold justify-between"
            style={{ fontWeight: "400" }}
          >
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
            <div className="hidden lg:flex items-center space-x-4 text-xl">
              <nav className="flex items-center space-x-1">
                {isAdmin && (
                  <ProgressLink
                    href="/admin"
                    className="relative px-4 py-2 text-sm font-medium text-black/80 transition-colors hover:text-black rounded-md hover:bg-white/10 backdrop-blur-sm"
                  >
                    Admin
                  </ProgressLink>
                )}
                <ProgressLink
                  href="/"
                  className="relative px-4 py-2 text-sm font-medium text-black/80 transition-colors hover:text-black rounded-md hover:bg-white/10 backdrop-blur-sm"
                >
                  Home
                </ProgressLink>
                <ProgressLink
                  href="/blogs"
                  className="relative px-4 py-2 text-sm font-medium text-black/80 transition-colors hover:text-black rounded-md hover:bg-white/10 backdrop-blur-sm"
                >
                  Blogs
                </ProgressLink>
                <ProgressLink
                  href="/ipos"
                  className="relative px-4 py-2 text-sm font-medium text-black/80 transition-colors hover:text-black rounded-md hover:bg-white/10 backdrop-blur-sm"
                >
                  IPOs
                </ProgressLink>
                <ProgressLink
                  href="/analysis"
                  className="relative px-4 py-2 text-sm font-medium text-black/80 transition-colors hover:text-black rounded-md hover:bg-white/10 backdrop-blur-sm"
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
                            {session?.user.name?.charAt(0)?.toUpperCase() ||
                              "U"}
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
                  style={{
                    width: 161,
                    height: 40,
                    border: "8px",
                  }}
                >
                  Sign In
                </Button>
              )}
            </div>
            <div className="lg:hidden flex items-center">
              <Button
                variant="ghost"
                className="p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-black" />
                ) : (
                  <Menu className="h-6 w-6 text-black" />
                )}
              </Button>
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="lg:hidden backdrop-blur-md bg-transparent border-t border-white/10">
            <nav className="flex flex-col items-center space-y-2 py-4 max-w-md mx-auto">
              {isAdmin && (
                <ProgressLink
                  href="/admin"
                  className="w-3/4 text-center px-3 py-1.5 text-sm font-medium text-black/80 transition-all duration-200 hover:text-black rounded-lg hover:bg-white/20 hover:shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </ProgressLink>
              )}
              <ProgressLink
                href="/"
                className="w-3/4 text-center px-3 py-1.5 text-sm font-medium text-black/80 transition-all duration-200 hover:text-black rounded-lg hover:bg-white/20 hover:shadow-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </ProgressLink>
              <ProgressLink
                href="/blogs"
                className="w-3/4 text-center px-3 py-1.5 text-sm font-medium text-black/80 transition-all duration-200 hover:text-black rounded-lg hover:bg-white/20 hover:shadow-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blogs
              </ProgressLink>
              <ProgressLink
                href="/ipos"
                className="w-3/4 text-center px-3 py-1.5 text-sm font-medium text-black/80 transition-all duration-200 hover:text-black rounded-lg hover:bg-white/20 hover:shadow-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                IPOs
              </ProgressLink>
              <ProgressLink
                href="/analysis"
                className="w-3/4 text-center px-3 py-1.5 text-sm font-medium text-black/80 transition-all duration-200 hover:text-black rounded-lg hover:bg-white/20 hover:shadow-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Analysis
              </ProgressLink>
              {session ? (
                <Button
                  variant="ghost"
                  className="w-3/4 text-center px-3 py-1.5 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg hover:shadow-sm"
                  onClick={async () => {
                    await handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setShowLoginDialog(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-3/4 bg-[#212121] hover:bg-[#212121]/20 text-white px-4 py-1.5 rounded-full font-medium transition-all duration-200 hover:shadow-md"
                >
                  Sign In
                </Button>
              )}
            </nav>
          </div>
        )}
      </header>
      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />
    </>
  );
}
