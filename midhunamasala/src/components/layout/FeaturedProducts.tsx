'use client';

export default function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: "Classic Garam Masala",
      description: "An aromatic blend of 11 whole spices, slow-roasted to perfection. Essential for rich curries and traditional dishes.",
      price: "₹180",
      featured: true
    },
    {
      id: 2,
      name: "Authentic Sambar Powder",
      description: "A staple from South India, perfect for a flavorful and tangy lentil stew that brings comfort to every meal.",
      price: "₹150",
      featured: true
    },
    {
      id: 3,
      name: "Spicy Chole Masala",
      description: "Transform your chickpeas into a delectable, zesty dish with this vibrant and perfectly balanced blend.",
      price: "₹175",
      featured: true
    },
    {
      id: 4,
      name: "Royal Biryani Masala",
      description: "Craft exquisite Biryani at home with our authentic, slow-roasted blend. Fragrant and unforgettable.",
      price: "₹220",
      featured: true
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif tracking-wider uppercase">
            Our Featured Masalas
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-sans tracking-wide">
            Experience the best of our hand-ground, aromatic blends
          </p>
        </div>

        {/* Products Grid - Unique Layout */}
        <div className="space-y-12">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`flex flex-col lg:flex-row items-center gap-8 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Product Image Placeholder */}
              <div className="w-full lg:w-1/3">
                <div className="relative">
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                      <div className="text-4xl text-blue-200">Image</div>
                    </div>
                  </div>
                  {/* Decorative element */}
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-blue-400 rounded-full opacity-20"></div>
                  <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-blue-300 rounded-full opacity-30"></div>
                </div>
              </div>

              {/* Product Info */}
              <div className="w-full lg:w-2/3 space-y-4">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-gray-900 font-serif tracking-wider uppercase">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-sans tracking-wide">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
