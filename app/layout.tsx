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
  DollarSign,
  BarChart3,
  Globe,
  Building2,
  Coins,
  Activity,
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
// import Header from "@/components/Header";

// Enhanced loading states with more variety and animations
const loadingStates = [
  {
    icon: <FileText className="h-12 w-12 text-[#0073E6] animate-pulse" />,
    text: "Reviewing IPO Documents...",
    bgPattern: "📄",
  },
  {
    icon: <Building2 className="h-12 w-12 text-[#0073E6] animate-bounce" />,
    text: "Evaluating Company Structure...",
    bgPattern: "🏢",
  },
  {
    icon: <DollarSign className="h-12 w-12 text-[#0073E6] animate-spin" />,
    text: "Calculating Valuation...",
    bgPattern: "💰",
  },
  {
    icon: <BarChart3 className="h-12 w-12 text-[#0073E6] animate-pulse" />,
    text: "Analyzing Market Trends...",
    bgPattern: "📈",
  },
  {
    icon: <Globe className="h-12 w-12 text-[#0073E6] animate-bounce" />,
    text: "Expanding Global Reach...",
    bgPattern: "🌍",
  },
  {
    icon: <Landmark className="h-12 w-12 text-[#0073E6] animate-pulse" />,
    text: "Listing on Stock Exchange...",
    bgPattern: "🏛️",
  },
  {
    icon: <Activity className="h-12 w-12 text-[#0073E6] animate-pulse" />,
    text: "Monitoring Trading Activity...",
    bgPattern: "📊",
  },
  {
    icon: <Coins className="h-12 w-12 text-[#0073E6] animate-bounce" />,
    text: "Generating Returns...",
    bgPattern: "🪙",
  },
  {
    icon: <Rocket className="h-12 w-12 text-[#0073E6] animate-bounce" />,
    text: "Preparing for Launch! 🚀",
    bgPattern: "🚀",
  },
];

// Enhanced creative IPO-themed loader component
function CreativeIPOLoader() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Cycle through loading states
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % loadingStates.length);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Simulate progress
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0; // Reset when complete
        return prev + Math.random() * 3;
      });
    }, 150);

    return () => clearInterval(progressInterval);
  }, []);

  // Generate floating background elements
  const backgroundElements = Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute text-2xl opacity-10 select-none pointer-events-none"
      initial={{
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }}
      animate={{
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
      }}
      transition={{
        duration: 15 + Math.random() * 10,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      {loadingStates[Math.floor(Math.random() * loadingStates.length)].bgPattern}
    </motion.div>
  ));

  return (
    <div className="fixed inset-0 z-[100] min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {typeof window !== 'undefined' && backgroundElements}
      </div>

      {/* Main loader content */}
      <div className="relative z-10 text-center space-y-8 max-w-md mx-auto px-6">
        {/* IPO Milega Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex items-center justify-center space-x-3 mb-8"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0073E6] text-white shadow-lg">
            <TrendingUp className="h-6 w-6" />
          </div>
          <span className="text-3xl font-bold text-gray-900 tracking-tight">
            IPO Milega
          </span>
        </motion.div>

        {/* Main loading animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="flex flex-col items-center justify-center space-y-6"
          >
            {/* Icon with glowing effect */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#0073E6]/20 blur-xl animate-pulse"></div>
              <div className="relative bg-white rounded-2xl p-6 shadow-2xl border border-blue-100">
                {loadingStates[index].icon}
              </div>
            </div>

            {/* Loading text */}
            <div className="space-y-2">
              <p className="text-xl font-bold text-gray-900 font-ibm-plex tracking-wide">
                {loadingStates[index].text}
              </p>
              
              {/* Progress bar */}
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#0073E6] to-blue-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.8}}
                />
              </div>
              <p className="text-sm text-gray-500 font-medium">
                {Math.round(Math.min(progress, 100))}% Complete
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Loading dots animation */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-[#0073E6] rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Layout content component
function LayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const isAdmin = ["admin@gmail.com", "snehshah7634@gmail.com", "shahvraj114@gmail.com"].includes(
    session?.user?.email || ""
  );

  const path = usePathname();
  const hideHeaderRoutes = ["/analysis"];
  const shouldShowHeader = !hideHeaderRoutes.some((route) =>
    path.startsWith(route)
  );

  return (
    <ProgressProvider>
      <header className="fixed font-ibm-plex top-0 z-50 w-full backdrop-blur-md bg-transparent border-b border-white/10">
        <div className="w-full">
          <div
            className="max-w-7xl mx-auto app-container flex items-center h-16 justify-between"
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
      <main>
        <Suspense fallback={<CreativeIPOLoader />}>{children}</Suspense>
        <Toaster position="top-right" richColors />
      </main>
      <LoginDialog isOpen={showLoginDialog} onClose={() => setShowLoginDialog(false)} />
    </ProgressProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Suravaram&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen items-center">
        <Suspense fallback={<CreativeIPOLoader />}>
          <LayoutContent>{children}</LayoutContent>
        </Suspense>
      </body>
    </html>
  );
}