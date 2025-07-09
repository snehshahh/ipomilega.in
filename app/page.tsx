// app/page.tsx - Main Homepage Component
import AnimatedBackground from '@/components/Home/Bg';
import { BlogSection } from '@/components/Home/BlogSection';
import { CtaSection } from '@/components/Home/CtaSection';
import { LiveIposSection } from '@/components/Home/LiveIposSection';
import { PastIposSection } from '@/components/Home/PastIposSection';
import { UpcomingIposSection } from '@/components/Home/UpcomingIpos';
import { getHomePageData } from '@/lib/data-fetching';
import { Metadata } from 'next';


// SEO Metadata
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
        url: '/og-image.jpg',
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
    images: ['/twitter-image.jpg'],
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
  const homeData = await getHomePageData();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Mesh Background */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <LiveIposSection ipos={homeData.data.live} count={homeData.counts.live} />
        <UpcomingIposSection ipos={homeData.data.upcoming} count={homeData.counts.upcoming} />
        <PastIposSection ipos={homeData.data.past} count={homeData.counts.past} />
        <BlogSection blogs={homeData.blogList} />
        <CtaSection />
      </div>
    </div>
  );
}