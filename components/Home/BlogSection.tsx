import { Blog } from "@/app/models/ipo";
import { BlogCard } from "./BlogCard";
import { PenBox } from "lucide-react";
import Link from 'next/link';

export function BlogSection({ blogs }: { blogs: Blog[] }) {
    return (
        <section className="py-6 sm:py-8 lg:py-12">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 lg:mb-12">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div className="flex items-center justify-center sm:justify-start gap-4 lg:gap-6">
                        {/* Animated arrows like in UpcomingIpos */}
                        <div className="relative flex items-center justify-center">
                            <PenBox className="w-4 h-4 text-gray-600" />
                        </div>

                        {/* Title and description stacked */}
                        <div className="flex flex-col">
                            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 font-ibm-plex" style={{ fontWeight: '700' }}>
                                Blogs
                            </h3>
                            <p className="text-gray-600 text-sm sm:text-base font-medium font-ibm-plex" style={{ fontWeight: '400' }}>
                                IPO Recap: What&apos;s Closed, What&apos;s Gained
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/blogs"
                        className="text-green-600 hover:text-green-700 font-bold flex items-center justify-center sm:justify-start space-x-2 group text-sm sm:text-base bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition-all duration-200 self-center sm:self-auto"
                    >
                        <span>View All</span>
                        <span className="text-sm group-hover:translate-x-1 transition-transform">&gt;</span>
                    </Link>
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
    );
}