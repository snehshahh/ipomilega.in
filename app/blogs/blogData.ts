interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  ipoDetails: {
    companyName: string;
    issueSize: string;
    priceRange: string;
    listingDate: string;
    minInvestment: string;
    lotSize: number;
  };
}

export const blogPosts: BlogPost[] = [
  {
    id: 'paytm-ipo',
    title: 'Paytm IPO: A Deep Dive into India\'s Biggest Public Offering',
    excerpt: 'Analyzing the much-anticipated Paytm IPO, its valuation, and future prospects in the digital payments space.',
    content: `## Paytm IPO: A Deep Dive into India's Biggest Public Offering

### Company Overview
Paytm, India's leading digital payments and financial services company, made headlines with its record-breaking IPO in November 2021. The company, officially known as One97 Communications Limited, raised approximately $2.5 billion in what was India's largest IPO at the time.

### Key IPO Details
- **Issue Size:** ₹18,300 crores (approximately $2.5 billion)
- **Price Band:** ₹2,080 - ₹2,150 per share
- **Listing Date:** November 18, 2021
- **Minimum Investment:** ₹14,280
- **Lot Size:** 6 shares

### Business Model Analysis
Paytm operates a two-sided platform connecting consumers and merchants through its digital payments ecosystem. The company generates revenue through:
1. Payment services (UPI, wallet, cards)
2. Financial services (lending, insurance, wealth management)
3. Commerce and cloud services

### Strengths
- Market leadership in digital payments
- Strong brand recognition
- Diversified revenue streams
- Large and growing user base

### Risks
- Intense competition from Google Pay, PhonePe, and others
- History of losses and path to profitability
- Regulatory challenges in the fintech space

### Investment Thesis
While Paytm's IPO was met with significant investor interest, the stock has faced challenges post-listing. Investors should carefully consider the company's growth potential against its current valuation and competitive landscape.`,
    date: 'June 4, 2025',
    category: 'Fintech',
    ipoDetails: {
      companyName: 'One97 Communications Limited (Paytm)',
      issueSize: '₹18,300 crores',
      priceRange: '₹2,080 - ₹2,150',
      listingDate: 'November 18, 2021',
      minInvestment: '₹14,280',
      lotSize: 6
    }
  },
  {
    id: 'zomato-ipo',
    title: 'Zomato IPO: Appetite for Growth in Food Delivery',
    excerpt: 'Examining Zomato\'s journey to becoming a publicly traded company and its position in India\'s food delivery market.',
    content: `## Zomato IPO: Appetite for Growth in Food Delivery

### Company Overview
Zomato, India's leading food delivery and restaurant discovery platform, went public in July 2021, marking a significant milestone for India's startup ecosystem. The company's IPO was oversubscribed more than 38 times, reflecting strong investor confidence.

### Key IPO Details
- **Issue Size:** ₹9,375 crores (approximately $1.26 billion)
- **Price Band:** ₹72 - ₹76 per share
- **Listing Date:** July 23, 2021
- **Minimum Investment:** ₹13,680
- **Lot Size:** 180 shares

### Business Model Analysis
Zomato operates primarily in the food delivery and restaurant discovery space, with multiple revenue streams:
1. Food delivery commissions
2. Restaurant advertising and promotions
3. Subscription services (Zomato Pro)
4. B2B supplies (Hyperpure)

### Strengths
- Market leadership in food delivery
- Strong brand equity
- Diversified revenue streams
- First-mover advantage in many markets

### Risks
- High cash burn rate
- Intense competition from Swiggy and others
- Dependence on discounts and promotions
- Regulatory challenges in the gig economy

### Investment Thesis
Zomato's IPO marked a turning point for Indian startups, being one of the first new-age internet companies to go public. While the company has shown strong growth, investors should be mindful of the competitive landscape and path to profitability.`,
    date: 'June 3, 2025',
    category: 'Food Tech',
    ipoDetails: {
      companyName: 'Zomato Limited',
      issueSize: '₹9,375 crores',
      priceRange: '₹72 - ₹76',
      listingDate: 'July 23, 2021',
      minInvestment: '₹13,680',
      lotSize: 180
    }
  }
];
