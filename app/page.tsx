import { Suspense } from 'react';

// Add resource preloading
export async function generateStaticParams() {
  return [];
}

import { BlogSection } from '@/components/Home/BlogSection';
import { LiveIposSection } from '@/components/Home/LiveIposSection';
import { PastIposSection } from '@/components/Home/PastIposSection';
import { UpcomingIposSection } from '@/components/Home/UpcomingIpos';
import { getHomePageData } from '@/lib/data-fetching';
import { Metadata } from 'next';
import { HomePageData } from './types/homepage';
import { HeroSection } from '@/components/Home/HeroSection';
import { Footer } from '@/components/Home/Footer';

export const metadata: Metadata = {
  title: 'IPO Milega - Your Gateway to IPO Investments | Live, Upcoming & Past IPOs',
  description: 'Discover the latest IPO opportunities with IPO Milega. Track live IPOs, upcoming listings, and past performance. Get expert insights and make informed investment decisions.',
  keywords: [
    'IPO',
    'Initial Public Offering',
    'IPO investments',
    'upcoming IPO',
    'live IPO',
    'stock market',
    'IPO listing',
    'investment opportunities',
    'IPO Milega',
    'India IPO'
  ],
  authors: [{ name: 'IPO Milega Team' }],
  creator: 'IPO Milega',
  publisher: 'IPO Milega',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ipomilega.com',
    title: 'IPO Milega - Your Gateway to IPO Investments',
    description: 'Discover the latest IPO opportunities with IPO Milega. Track live IPOs, upcoming listings, and past performance.',
    siteName: 'IPO Milega',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'IPO Milega - IPO Investment Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IPO Milega - Your Gateway to IPO Investments',
    description: 'Discover the latest IPO opportunities. Track live IPOs, upcoming listings, and past performance.',
    images: ['/twitter-image.png'],
    creator: '@ipomilega',
  },
  alternates: {
    canonical: 'https://ipomilega.com',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default async function HomePage() {
  // Move data fetching outside of component for better performance
  const homeDataPromise = getHomePageData();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 min-h-screen pt-15 md:pt-15 lg:pt-0">
        <Suspense fallback={<HomePageSkeleton />}>
          <HomeContent dataPromise={homeDataPromise} />
        </Suspense>
      </div>
    </div>
  );
}

// Create a new component to handle the data
async function HomeContent({ dataPromise }: { dataPromise: Promise<HomePageData> }) {
  const homeData = await dataPromise;

  return (
    <div className="app-container mt-5">
      <HeroSection ipos={homeData.data.live} />
      <LiveIposSection ipos={homeData.data.live} count={homeData.counts.live} />
      <UpcomingIposSection ipos={homeData.data.upcoming} count={homeData.counts.upcoming} />
      <PastIposSection ipos={homeData.data.past} count={homeData.counts.past} />
      <BlogSection blogs={homeData.blogList} />
      <Footer />
    </div>
  );
}

// Add a lightweight skeleton
function HomePageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}
