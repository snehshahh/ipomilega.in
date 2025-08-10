import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AnalysisPageClient from './AnalysisPageClient'
import { IpoComprehensiveAnalysis } from "@/app/models/ipo_comprehensive_analysis"
import { Ipo } from '@/app/models/ipo';

// Server-side function to fetch analysis data
async function getAnalysisData(id: string): Promise<{ ipos_analysis: IpoComprehensiveAnalysis; ipo: Ipo } | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/analysis/${id}`, {
      cache: 'no-store', // For real-time data
      // Alternatively use: cache: 'force-cache' for static data
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching analysis:', error)
    return null
  }
}

// Generate dynamic metadata - FIXED: Changed params to Promise type
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params // Await the params Promise
  const data = await getAnalysisData(id)
  const analysis = data?.ipos_analysis
  const ipo = data?.ipo
  
  if (!analysis) {
    return {
      title: 'IPO Analysis Not Found',
      description: 'The requested IPO analysis could not be found.',
    }
  }

  const overallScore = ((analysis.summary_metrics?.fundamentals_score ?? 0) + (analysis.summary_metrics?.performance_score ?? 0) / 2).toFixed(1)
  const gainsPercentage = analysis.ipo_details.approximate_gains_potential
  
  const title = `${analysis.company_name} IPO Analysis - Score ${overallScore}/10 | ${gainsPercentage}% Potential Gains`
  const description = `Comprehensive IPO analysis of ${analysis.company_name}. Issue size: ${analysis.ipo_details.issue_size}, Price band: ${analysis.ipo_details.price_band}. Investment score ${overallScore}/10 with ${gainsPercentage}% potential gains. Risk assessment, fundamentals review & timeline details.`
  
  const keywords = [
    `${analysis.company_name} IPO`,
    `${analysis.company_name} IPO analysis`,
    `${analysis.company_name} IPO review`,
    'IPO investment analysis',
    'IPO fundamentals',
    'IPO risk assessment',
    'IPO gains potential',
    'IPO performance analysis',
    'Stock market IPO',
    'IPO allotment',
    'IPO listing gains',
    `${analysis.company_name} stock analysis`,
    'IPO investment guide',
    'IPO rating',
    'IPO score'
  ]

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'IPO Analysis Team' }],
    creator: 'IPO Analysis Platform',
    publisher: 'IPO Analysis Platform',
    
    // Open Graph metadata for social sharing
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/analysis/${id}`,
      siteName: 'IPO Analysis Platform',
      images: [
        {
          url: `${ipo?.image_url}`, // You'll need to create this
          width: 1200,
          height: 630,
          alt: `${analysis.company_name} IPO Analysis`,
        }
      ],
      locale: 'en_IN',
    },
    
    // Twitter Card metadata
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${ipo?.image_url}`], // You'll need to create this
      creator: '@yourtwitterhandle', // Replace with your Twitter handle
    },
    
    // Additional SEO metadata
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
    
    // Structured data for rich snippets
    other: {
      'article:published_time': new Date().toISOString(),
      'article:modified_time': new Date().toISOString(),
      'article:author': 'IPO Analysis Team',
      'article:section': 'IPO Analysis',
      'article:tag': keywords.slice(0, 5).join(','),
    },
    
    // Canonical URL
    alternates: {
      canonical: `/analysis/${id}`,
    },
    
    // Additional metadata
    category: 'Finance',
    classification: 'IPO Analysis',
  }
}

// Generate JSON-LD structured data
function generateStructuredData(analysis: IpoComprehensiveAnalysis, id: string) {
  const overallScore = ((analysis.summary_metrics?.fundamentals_score ?? 0 + (analysis.summary_metrics?.performance_score ?? 0)) / 2).toFixed(1)
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: `${analysis.company_name} IPO`,
    description: `Comprehensive IPO analysis of ${analysis.company_name} with detailed fundamentals, risk assessment, and investment potential evaluation.`,
    provider: {
      '@type': 'Organization',
      name: 'IPO Analysis Platform',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: analysis.ipo_details.price_band,
      availability: 'https://schema.org/InStock',
      validFrom: analysis.time.issue_dates.opening,
      validThrough: analysis.time.issue_dates.closing,
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: overallScore,
        bestRating: '10',
        worstRating: '0',
      },
      author: {
        '@type': 'Organization',
        name: 'IPO Analysis Team',
      },
      reviewBody: analysis.fundamentals.summary,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: overallScore,
      bestRating: '10',
      worstRating: '0',
      ratingCount: '1',
    },
    url: `/analysis/${id}`,
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    mainEntity: {
      '@type': 'Corporation',
      name: analysis.company_name,
      description: analysis.fundamentals.business_model,
    }
  }
}

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const analysis = await getAnalysisData(id)
  
  if (!analysis) {
    notFound()
  }

  const structuredData = generateStructuredData(analysis.ipos_analysis, id)

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      {/* Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: '/',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'IPO Analysis',
                item: '/admin',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: `${analysis.ipos_analysis.company_name} Analysis`,
                item: `/analysis/${id}`,
              },
            ],
          })
        }}
      />
      
      <AnalysisPageClient analysis={analysis.ipos_analysis} ipo={analysis.ipo} />
    </>
  )
}