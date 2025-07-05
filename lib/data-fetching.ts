import { HomePageData } from '@/app/types/homepage';

export async function getHomePageData(): Promise<HomePageData> {
  try {
    const [ipoResponse, blogResponse] = await Promise.all([
      fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/ipo`, {
        cache: 'no-store',
      }),
      fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/blogs/featured`, {
        cache: 'no-store',
      }),
    ]);

    if (!ipoResponse.ok || !blogResponse.ok) {
      throw new Error('Failed to fetch data');
    }

    const ipoData = await ipoResponse.json();
    const blogData = await blogResponse.json();

    return {
      data: ipoData.data,
      counts: ipoData.counts,
      blogList: blogData.blogList || [],
    } as HomePageData;
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return {
      data: { upcoming: [], live: [], past: [] },
      counts: { upcoming: 0, live: 0, past: 0 },
      blogList: [],
    } as HomePageData;
  }
}
