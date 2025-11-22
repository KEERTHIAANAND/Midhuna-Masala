'use client';

import Link from 'next/link';

export default function BrandStory() {
  return (
    <section className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-400 text-lg">Image Placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content Section */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif tracking-wider">
                Our Journey: A Mother's Legacy of Flavor
              </h2>
              
              <p className="text-lg text-gray-700 leading-relaxed font-sans tracking-wide">
                Masala Heritage began in our family kitchen, born from a mother's passion to share 
                the authentic tastes of India. For generations, our family has carefully curated 
                and perfected these traditional spice blends, passing down recipes that capture 
                the essence of home-cooked meals and cherished memories.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed font-sans tracking-wide">
                Each masala tells a story of love, tradition, and the warmth of family gatherings. 
                We believe that the best flavors come from the heart, and every blend we create 
                carries the soul of authentic Indian cuisine.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-3 border-2 border-gray-900 text-gray-900 font-medium rounded-lg hover:bg-gray-900 hover:text-white transition-colors duration-200 tracking-wide"
              >
                Discover Our Story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
