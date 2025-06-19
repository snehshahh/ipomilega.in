import { Metadata } from "next";
import EditBlog from "../EditBlog";
import { Blog } from "@/app/models/ipo";


async function getBlogPost(id: string): Promise<Blog | null> {
  try {
    const url = new URL(`${process.env.NEXTAUTH_URL}/api/blogs/edit-a-blog/${id}`);
    const slugResponse = await fetch(url, {
      method: "GET",
    });

    if (slugResponse.ok) {
      const data = await slugResponse.json();
      return data.blog as Blog;
    }
    return null;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params; // Await the params Promise
  const blog = await getBlogPost(id);

  console.log("blog", blog);

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: blog.title,
    description: blog.meta_description,
    keywords: blog.tags.join(", "),
    authors: [{ name: blog.author }],
    openGraph: {
      title: blog.title,
      description: blog.meta_description,
      type: "article",
      publishedTime: blog.created_at,
      modifiedTime: blog.updated_at,
      authors: [blog.author],
      tags: blog.tags,
      images: blog.featured_image ? [{ url: blog.featured_image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.meta_description,
      images: blog.featured_image ? [blog.featured_image] : undefined,
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ blogId: string }> }) {
  const { blogId } = await params; // Await the params Promise
  const blogdata = await getBlogPost(blogId);


  return <EditBlog blog={blogdata || {} as Blog} />;
}