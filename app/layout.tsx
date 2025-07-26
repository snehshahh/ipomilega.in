"use client";

import { usePathname } from "next/navigation";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import { Toaster } from "sonner";
import { useState } from "react";
import { LoginDialog } from "@/components/ui/login";
import { ProgressProvider } from "@/components/Progressbar/ProgressProvider";
import Header from "@/components/Header";

const geistSans = GeistSans;
const geistMono = GeistMono;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const pathname = usePathname();

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ProgressProvider>
          {shouldShowHeader && <Header />}
          <main className="flex-1">
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
