import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";
import { Toaster } from "sonner";

// Geist fonts are now imported directly from the geist package
const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "IPO Dekho",
  description: "IPO Analysis & Investment Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <Link href="/" className="text-xl font-bold">
                IPO Dekho
              </Link>
              <nav className="flex items-center gap-6">
                <Link href="/admin" className="hover:underline">
                  Admin
                </Link>
                <Link href="/blogs" className="hover:underline">
                  Blogs
                </Link>
                <ThemeToggle />
              </nav>
            </div>
          </header>
          <main className="flex-1">
            {children}
            <Toaster position="top-right" richColors />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}