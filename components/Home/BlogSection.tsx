"use client";
import { useState, useEffect, useRef } from "react";
import { Blog } from "@/app/models/ipo";
import { BlogCard } from "./BlogCard";
import { MailOpen, PenBox } from "lucide-react";
import { ProgressLink } from "@/components/Progressbar/ProgressLink";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function BlogSection({ blogs }: { blogs: Blog[] }) {
    const [blogSectionHeight, setBlogSectionHeight] = useState(0);
    // Refs for measuring heights
    const blogSectionRef = useRef<HTMLDivElement>(null);

    // Measure Live IPO section height
    useEffect(() => {
        const measureHeight = () => {
            if (blogSectionRef.current) {
                const height = blogSectionRef.current.offsetHeight;
                setBlogSectionHeight(height);
            }
        };

        // Measure initially
        measureHeight();

        // Create ResizeObserver to watch for height changes
        const resizeObserver = new ResizeObserver(measureHeight);
        if (blogSectionRef.current) {
            resizeObserver.observe(blogSectionRef.current);
        }

        // Also listen to window resize
        window.addEventListener('resize', measureHeight);

        // Cleanup
        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', measureHeight);
        };
    }, []);

    return (
        <div className="relative">
            {/* Gradient Background */}
            <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `linear-gradient(
                        to bottom,
                        transparent 0%,
                        transparent ${blogSectionHeight / 2}px,
                        rgba(59, 130, 246, 0.1) ${blogSectionHeight / 2}px,
                        rgba(59, 130, 246, 0.2) 100%
                    )`
                }}
            />
            
            {/* Content */}
            <div className="relative z-10">
                <section className="py-6" ref={blogSectionRef}>
                    {/* Header */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 lg:mb-12">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                            <div className="text-center sm:text-left">
                                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 mb-2 font-ibm-plex">
                                    <div className="flex items-center justify-center sm:justify-start gap-2 lg:gap-3">
                                        <PenBox className="w-8 h-8 text-gray-600" />
                                        <div>
                                            <div>Blogs</div>
                                            <div className="text-gray-600 mt-1 text-sm sm:text-base font-medium font-ibm-plex">IPO Recap: What&apos;s Closed, What&apos;s Gained</div>
                                        </div>
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
                    </div>

                    {/* Blogs Content */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {blogs.length === 0 ? (
                            <div className="flex items-center justify-center py-8 sm:py-12">
                                <div className="text-center py-6 sm:py-8 lg:py-12 bg-white rounded-xl shadow-sm border border-gray-100 max-w-sm sm:max-w-md w-full mx-4">
                                    <PenBox className="w-10 sm:w-12 h-10 sm:h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-base sm:text-lg font-medium">No blogs available at the moment</p>
                                    <p className="text-gray-400 text-sm mt-2">Check back soon for new insights!</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Blogs Grid Container */}
                                <div className="px-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-items-center py-5">
                                        {blogs.map((blog: Blog) => (
                                            <div
                                                key={blog._id}
                                                className="transition-all duration-300 hover:scale-105 w-full max-w-sm"
                                            >
                                                <div className="h-full rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                                    <BlogCard blog={blog} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <section className="py-6" >
                    <div>
                        <section className="py-10 sm:py-16 lg:py-24" >
                            {/* Header */}
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                    <div className="text-center sm:text-left">
                                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 mb-2 font-ibm-plex">
                                            <div className="flex items-center justify-center sm:justify-start gap-2 lg:gap-3">
                                                <MailOpen className="w-8 h-8 text-gray-600 font-ibm-plex" />
                                                <div>
                                                    <div>Stay Updated with IPOs</div>
                                                    <div className="text-gray-600 mt-2 font-ibm-plex text-sm sm:text-base font-medium">Get exclusive IPO insights, comprehensive market analysis, GMP updates, and investment opportunities delivered to your inbox weekly.</div>
                                                </div>
                                            </div>
                                        </h2>
                                    </div>
                                </div>
                                <div className="flex mt-3 gap-2 ml-10 lg:ml-12">
                                    <Input
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="max-w-md bg-background text-black font-ibm-plex"
                                        style={{ fontWeight: '500' }}
                                    />
                                    <Button variant="default" className="font-ibm-plex" style={{ fontWeight: '500' }}>
                                        Subscribe
                                    </Button>
                                </div>
                            </div>
                        </section>
                        <hr className="border-black  w-[100%] mx-auto" />
                        <footer className="py-1 sm:py-1 lg:py-2">
                            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                                <h2 className="text-2xl font-dm-serif text-gray-900 mb-2 text-center" style={{ fontWeight: '700' }}>IPO Milega</h2>
                                <div className="text-center">
                                    <div className="w-full overflow-hidden text-center">
                                        <p className="text-gray-600 font-ibm-plex" style={{ fontWeight: '400' }}> {new Date().getFullYear()} IPO Milega. All rights reserved.</p>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
                </section>
            </div>
        </div>
    );
}