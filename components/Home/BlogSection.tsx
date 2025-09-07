// components/sections/BlogSection.tsx (example path)
"use client";

import { useState } from "react";
import { Blog } from "@/app/models/ipo";
import { BlogCard } from "./BlogCard";
import { MailOpen, PenBox } from "lucide-react";
import { ProgressLink } from "@/components/Progressbar/ProgressLink";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";

export function BlogSection({ blogs }: { blogs: Blog[] }) {
  const [email, setEmail] = useState('');

  const subscribeToNewsletter = async (email: string) => {
    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Successfully subscribed!");
        setEmail('');
      } else {
        toast.error(data.message || "Subscription failed.");
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="py-15">
      {/* Section for displaying blog posts */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 font-ibm-plex flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-3">
                <PenBox className="w-8 h-8 text-gray-600" />
                <div>
                  <div>Blogs</div>
                  <div className="text-gray-600 mt-1 text-sm sm:text-base font-medium font-ibm-plex">IPO Recap: What&apos;s Closed, What&apos;s Gained</div>
                </div>
              </h2>
            </div>
            <ProgressLink
              href="/blogs"
              className="text-green-600 hover:text-green-700 font-bold flex items-center justify-center sm:justify-start space-x-2 group text-sm sm:text-base bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition-all duration-200 self-center sm:self-auto"
            >
              <span>View All</span>
              <span className="text-sm group-hover:translate-x-1 transition-transform">&gt;</span>
            </ProgressLink>
          </div>

          {blogs.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center py-6 bg-white rounded-xl shadow-sm border border-gray-100 max-w-sm w-full mx-4">
                <PenBox className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-base font-medium">No blogs available at the moment</p>
                <p className="text-gray-400 text-sm mt-2">Check back soon for new insights!</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center py-5">
              {blogs.map((blog: Blog) => (
                <div key={blog._id} className="transition-all duration-300 hover:scale-105 w-full max-w-sm motion-safe:hover:shadow-xl">
                  <div className="h-full rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <BlogCard blog={blog} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section for Newsletter Subscription */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 font-ibm-plex flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-3">
                <MailOpen className="w-8 h-8 text-gray-600" />
                <div>
                  <div>Stay Updated with IPOs</div>
                  <div className="text-gray-600 mt-2 font-ibm-plex text-sm sm:text-base font-medium">Get exclusive IPO insights, market analysis, and GMP updates delivered to your inbox.</div>
                </div>
              </h2>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row mt-4 gap-2 items-center w-full max-w-lg mx-auto sm:mx-0">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="bg-background text-black font-ibm-plex font-medium"
            />
            <Button onClick={() => subscribeToNewsletter(email)} variant="default" className="font-ibm-plex font-medium w-full sm:w-auto">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}