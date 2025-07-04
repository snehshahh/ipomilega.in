import { Blog } from "@/app/models/ipo";

export function BlogSection({ blogs }: { blogs: Blog[] }) {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Latest Blog Posts</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog: Blog) => (
                        <div  key={blog._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{blog.title}</h3>
                                <p className="text-gray-600">{blog.excerpt}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
