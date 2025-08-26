import { HomePageData } from '@/app/types/homepage';

export async function getHomePageData(): Promise<HomePageData> {
  try {
    // Use Promise.allSettled instead of Promise.all for better error handling
    const [ipoResult, blogResult] = await Promise.allSettled([
      fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/ipo`, {
        next: { revalidate: 300 }, // Cache for 5 minutes instead of no-store
      }),
      fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/blogs/featured`, {
        next: { revalidate: 600 }, // Cache blogs for 10 minutes
      }),
    ]);

    let ipoData = { data: { upcoming: [], live: [], past: [] }, counts: { upcoming: 0, live: 0, past: 0 } };
    let blogData = { blogList: [] };

    if (ipoResult.status === 'fulfilled' && ipoResult.value.ok) {
      ipoData = await ipoResult.value.json();
    }

    if (blogResult.status === 'fulfilled' && blogResult.value.ok) {
      blogData = await blogResult.value.json();
    }

    return {
      data: ipoData.data,
      counts: ipoData.counts,
      blogList: blogData.blogList || [],
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return {
      data: { upcoming: [], live: [], past: [] },
      counts: { upcoming: 0, live: 0, past: 0 },
      blogList: [],
    };
  }
}
