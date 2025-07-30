"use client";
import { useState, useEffect, useRef } from "react";
import { Blog } from "@/app/models/ipo";
import { BlogCard } from "./BlogCard";
import { MailOpen, PenBox } from "lucide-react";
import { ProgressLink } from "@/components/Progressbar/ProgressLink";
import { Input } from "../ui/input";
import { toast } from "sonner"
import { Button } from "../ui/button";

export function BlogSection({ blogs }: { blogs: Blog[] }) {
    const [blogSectionHeight, setBlogSectionHeight] = useState(0);
    const [email, setEmail] = useState('');
    console.log(blogSectionHeight);
    const blogSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const measureHeight = () => {
            if (blogSectionRef.current) {
                const height = blogSectionRef.current.offsetHeight;
                setBlogSectionHeight(height);
            }
        };

        measureHeight();
        const resizeObserver = new ResizeObserver(measureHeight);
        if (blogSectionRef.current) {
            resizeObserver.observe(blogSectionRef.current);
        }
        window.addEventListener('resize', measureHeight);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', measureHeight);
        };
    }, []);

    const subscribeToNewsletter = async (email: string) => {
        try {
          const response = await fetch('/api/subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });
      
          const data = await response.json();
      
          if (response.ok) {
            // Show a success message to the user
            toast.success(data.message);    
            setEmail('');
          } else {
            // Show an error message
            console.error(data.message);
            toast.error(data.message);
          }
        } catch (error) {
          console.error('Failed to subscribe:', error);
          toast.error('Failed to subscribe');
        }
      };

    return (
        <div className="relative py-10 app-container">
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `
                    radial-gradient(circle at 20% 30%, rgba(240, 248, 255, 1), rgba(240, 248, 255, 0) 40%),
                    radial-gradient(circle at 70% 20%, rgba(173, 216, 230, 0.6), rgba(173, 216, 230, 0) 50%),
                    radial-gradient(circle at 30% 80%, rgba(135, 206, 250, 0.5), rgba(135, 206, 250, 0) 50%),
                    radial-gradient(circle at 90% 70%, rgba(173, 216, 250, 0.5), rgba(173, 216, 250, 0) 60%)
                  `,
                    backgroundColor: '#e6f4fe',
                    filter: 'blur(50px)'
                }}
            />
            <div className="relative z-10">
                <section className="py-10" ref={blogSectionRef}>
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
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
                    </div>
                    <div className="max-w-7xl mx-auto">
                        {blogs.length === 0 ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center py-6 bg-white rounded-xl shadow-sm border border-gray-100 max-w-sm w-full mx-4">
                                    <PenBox className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-base font-medium">No blogs available at the moment</p>
                                    <p className="text-gray-400 text-sm mt-2">Check back soon for new insights!</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center py-5">
                                        {blogs.map((blog: Blog) => (
                                            <div
                                                key={blog._id}
                                                className="transition-all duration-300 hover:scale-105 w-full max-w-sm motion-safe:hover:shadow-xl"
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
                <section className="py-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="text-center sm:text-left">
                                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 font-ibm-plex flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-3">
                                    <MailOpen className="w-8 h-8 text-gray-600" />
                                    <div>
                                        <div>Stay Updated with IPOs</div>
                                        <div className="text-gray-600 mt-2 font-ibm-plex text-sm sm:text-base font-medium">Get exclusive IPO insights, comprehensive market analysis, GMP updates, and investment opportunities delivered to your inbox weekly.</div>
                                    </div>
                                </h2>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row mt-3 gap-2 items-center sm:items-start justify-center sm:justify-start">
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="max-w-md bg-background text-black font-ibm-plex"
                                style={{ fontWeight: '500' }}
                            />
                            <Button onClick={() => subscribeToNewsletter(email)} variant="default" className="font-ibm-plex" style={{ fontWeight: '500' }}>
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </section>
                <hr className="border-black w-full mx-auto" />
                <footer className="py-1">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-2xl font-dm-serif text-gray-900 mb-2 text-center" style={{ fontWeight: '700' }}>IPO Milega</h2>
                        <div className="text-center">
                            <div className="w-full overflow-hidden text-center">
                                <p className="text-gray-600 font-ibm-plex" style={{ fontWeight: '400' }}> {new Date().getFullYear()} IPO Milega. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}