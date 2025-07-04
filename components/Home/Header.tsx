
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">IPO Milega</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/ipos" className="text-gray-700 hover:text-blue-600 transition-colors">
              IPOs
            </Link>
            <Link href="/analysis" className="text-gray-700 hover:text-blue-600 transition-colors">
              Analysis
            </Link>
            <Link href="/blogs" className="text-gray-700 hover:text-blue-600 transition-colors">
              Blog
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
