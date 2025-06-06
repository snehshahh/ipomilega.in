interface BlogPost {
    title: string;
    slug: string;
    ipo_id: string;
    content: string;
    excerpt: string;
    tags: string[];
    category: string;
    status: 'draft' | 'published';
    featured_image?: string;
    meta_description: string;
    author: string;
  }
  