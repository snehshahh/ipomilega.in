"use client";

import "./globals.css";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";
import { useState, Suspense, useEffect } from "react";
import { LoginDialog } from "@/components/ui/login";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronDown,
  LogOut,
  TrendingUp,
  Landmark,
  FileText,
  LineChart,
  Rocket,
  Loader2,
} from "lucide-react";
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
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { GeistSans, GeistMono } from "geist/font";

// Array of loading "scenes" for the creative loader
const loadingStates = [
  {
    icon: <FileText className="h-10 w-10 text-[#0073E6]" />,
    text: "Reviewing IPO Documents...",
  },
  {
    icon: <Landmark className="h-10 w-10 text-[#0073E6]" />,
    text: "Listing on the Stock Exchange...",
  },
  {
    icon: <LineChart className="h-10 w-10 text-[#0073E6]" />,
    text: "Analyzing Market Growth...",
  },
  {
    icon: <Rocket className="h-10 w-10 text-[#0073E6] animate-bounce" />,
    text: "Preparing for Launch!",
  },
];

// The new creative IPO-themed loader component
function CreativeIPOLoader() {
  const [index, setIndex] = useState(0);

  // This effect cycles through the loading states
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % loadingStates.length);
    }, 2500); // Change state every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4 h-24"
          >
            <div className="relative h-12 w-12 flex items-center justify-center">
              {loadingStates[index].icon}
            </div>
            <p className="text-xl font-black text-gray-900 font-ibm-plex tracking-wide">
              {loadingStates[index].text}
            </p>
          </motion.div>
        </AnimatePresence>
        <div className="pt-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto" />
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
  };

  const isAdmin = ["admin@gmail.com", "snehshah7634@gmail.com", "shahvraj114@gmail.com"].includes(
    session?.user?.email || ""
  );

  // Hide header on specific routes
  const hideHeaderRoutes = ["/analysis"];
  const shouldShowHeader = !hideHeaderRoutes.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Suravaram&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <ProgressProvider>
          {shouldShowHeader && (
            <header className="fixed font-ibm-plex top-0 z-50 w-full backdrop-blur-md bg-transparent border-b border-white/10">
              <div className="w-full">
                <div
                  className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16 justify-between"
                  style={{ fontWeight: "400" }}
                >
                  <ProgressLink
                    href="/"
                    className="flex items-center space-x-2 transition-opacity hover:opacity-80"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <span className="text-xl sm:text-2xl font-bold text-black tracking-tight drop-shadow-lg">
                      IPO Milega
                    </span>
                  </ProgressLink>
                  <div className="flex items-center space-x-2 sm:space-x-4 text-xl">
                    <nav className="hidden sm:flex items-center space-x-1">
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
                              <p className="text-sm font-medium leading-none">{session?.user.name}</p>
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
          )}

          <main className="flex-1 pt-16">
            <Suspense fallback={<CreativeIPOLoader />}>
              {children}
            </Suspense>
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