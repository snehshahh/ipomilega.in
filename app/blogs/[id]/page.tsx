"use client"

import { notFound } from 'next/navigation';
import { blogPosts } from '../blogData';
import { useEffect, useState } from 'react';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params

  const [post, setPost] = useState<BlogPost>({} as BlogPost)

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`/api/blogs/slug/${slug}`)
      const data = await response.json()
      setPost(data)
    }
    fetchPost()
  }, [])

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}

