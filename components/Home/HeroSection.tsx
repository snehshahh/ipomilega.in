// HeroSection.tsx - Updated compact version
import Link from 'next/link';
import heroSection from '@/public/HeroSection.svg';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br text-black py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl leading-tight mb-4 font-black">
              Know The{' '}
              <span className="text-red-500 font-black">Risk.</span>
              <br />
              Predict The{' '}
              <span className="text-green-500 font-black">Return.</span>
              <br />
              Invest{' '}
              <span className="text-yellow-500 font-black">Smarter.</span>
            </h1>
            <p className="text-lg text-black mb-6 leading-relaxed font-medium">
              IPO Milega helps you make informed IPO decisions by showing real-time risk levels and predicting returns based on your investment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/ipos"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors text-center text-sm"
              >
                Explore IPOs
              </Link>
              <Link
                href="/analysis"
                className="text-white bg-blue-600 px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors text-center text-sm"
              >
                Try Return Predictor
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <Image src={heroSection} alt="Hero Section" width={400} height={400} className="max-w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}