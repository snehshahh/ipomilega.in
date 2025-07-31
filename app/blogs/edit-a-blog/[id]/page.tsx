import { Metadata } from "next";
import EditBlog from "../EditBlog";
import { Blog } from "@/app/models/ipo";

async function getBlogPost(id: string): Promise<Blog | null> {
  try {
    if (!id) {
      console.log("No ID provided");
      return null;
    }
    
    console.log("Blog ID", id);
    const url = new URL(`${process.env.NEXTAUTH_URL}/api/blogs/edit-a-blog/${id}`);
    const slugResponse = await fetch(url, {
      cache: 'no-store', // For real-time data
    });
    
    if (slugResponse.ok) {
      const data = await slugResponse.json();
      console.log("Blog in server", data.blog as Blog);
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
  params: Promise<{ id: string }>; // Using id
}): Promise<Metadata> {
  const { id } = await params; // Using id
  const blog = await getBlogPost(id);

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
      images: blog.image_url ? [{ url: blog.image_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.meta_description,
      images: blog.image_url ? [blog.image_url] : undefined,
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Using id
  const blogdata = await getBlogPost(id);

  return <EditBlog blog={blogdata || {} as Blog} />;
}