import { notFound } from 'next/navigation';
import { blogPosts } from '../blogData';

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = blogPosts.find((post) => post.id === params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <article className="prose lg:prose-xl mx-auto">
        <div className="mb-8">
          <span className="text-blue-600 font-medium">{post.category}</span>
          <h1 className="text-4xl font-bold mt-2 mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-500 text-sm">
            <span>{post.date}</span>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">IPO Snapshot</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Company</p>
              <p className="font-medium">{post.ipoDetails.companyName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Issue Size</p>
              <p className="font-medium">{post.ipoDetails.issueSize}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Price Range</p>
              <p className="font-medium">{post.ipoDetails.priceRange}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Listing Date</p>
              <p className="font-medium">{post.ipoDetails.listingDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Min Investment</p>
              <p className="font-medium">{post.ipoDetails.minInvestment}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Lot Size</p>
              <p className="font-medium">{post.ipoDetails.lotSize} shares</p>
            </div>
          </div>
        </div>

        <div 
          className="prose lg:prose-lg max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: post.content.replace(/\n/g, '<br />')
              .replace(/^##\s+(.*$)/gm, '<h2>$1</h2>')
              .replace(/^###\s+(.*$)/gm, '<h3>$1</h3>')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/^-\s+(.*$)/gm, '<li>$1</li>')
              .replace(/<li>.*<\/li>/g, function(match) {
                return '<ul>' + match + '</ul>';
              })
          }}
        />

        <div className="mt-12 pt-6 border-t border-gray-200">
          <a 
            href="/blogs" 
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            ← Back to all IPOs
          </a>
        </div>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    id: post.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = blogPosts.find((post) => post.id === params.id);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | IPO Insights`,
    description: post.excerpt,
  };
}
