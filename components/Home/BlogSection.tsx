import { Blog } from "@/app/models/ipo";
import { BlogCard } from "./BlogCard";
import { PenBox } from "lucide-react";
export function BlogSection({ blogs }: { blogs: Blog[] }) {
    return (
        <section className="py-6 sm:py-8 lg:py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center sm:justify-start gap-4 lg:gap-6">
                    {/* Red pulsing dot in separate div */}
                    <div className="relative flex items-center justify-center">
                        <PenBox className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 font-ibm-plex" />
                    </div>

                    {/* Title and description stacked */}
                    <div className="flex flex-col">
                        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 font-ibm-plex" style={{ fontWeight: '700' }}>
                            Blogs                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm font-medium font-ibm-plex" style={{ fontWeight: '400' }}>
                            IPO Recap: What&apos;s Closed, What&apos;s Gained                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 mt-2 sm:mt-4 lg:mt-6">
                    {blogs.map((blog: Blog) => (
                        <BlogCard key={blog._id} blog={blog} />
                    ))}
                </div>
            </div>
        </section>
    );
}




