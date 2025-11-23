'use client';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      text: "Masala Heritage has brought back the taste of my grandmother's cooking! The Garam Masala is truly exceptional.",
      rating: 5
    },
    {
      id: 2,
      name: "Rahul Singh",
      text: "Ordered the Biryani Masala, and it made my weekend dinner a huge hit. Freshness you can taste!",
      rating: 4.5
    },
    {
      id: 3,
      name: "Anjali Rao",
      text: "The Sambar Powder is simply the best I've tried. Authentic flavors that remind me of home.",
      rating: 5
    },
    {
      id: 4,
      name: "Sameer Gupta",
      text: "Highly recommend their Chole Masala. It's incredibly flavorful and easy to use. Great quality!",
      rating: 5
    },
    {
      id: 5,
      name: "Meera Patel",
      text: "The quality and authenticity of these masalas is unmatched. Every dish tastes like it's made with love.",
      rating: 5
    },
    {
      id: 6,
      name: "Vikram Kumar",
      text: "Fresh, aromatic, and perfectly balanced spices. Masala Heritage has become a staple in our kitchen.",
      rating: 4.5
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-[#F6C84C] text-lg">★</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-[#F6C84C] text-lg">☆</span>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300 text-lg">★</span>
      );
    }

    return stars;
  };

  return (
    <section className="py-20 bg-[#EBE4D8] relative overflow-hidden">
      {/* Decorative pattern border at top */}
      <div className="absolute top-0 left-0 right-0 h-6 flex items-center justify-center overflow-hidden">
        <div className="flex gap-4 text-[#D4AF37] opacity-60">
          {[...Array(50)].map((_, i) => (
            <span key={i} className="text-lg">✦</span>
          ))}
        </div>
      </div>

      {/* Dotted background pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(#8B1E1E 1px, transparent 1px)', 
             backgroundSize: '30px 30px' 
           }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Decorative line with icon */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-24 h-px bg-[#8B1E1E]"></div>
            <div className="text-[#8B1E1E]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div className="w-24 h-px bg-[#8B1E1E]"></div>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-[#8B1E1E] mb-4 font-serif">
            Voices of Tradition
          </h2>
          <p className="text-lg text-[#8B1E1E] italic font-serif max-w-2xl mx-auto">
            Hear from our happy customers who love the taste of tradition
          </p>
        </div>

        {/* Marquee Testimonials */}
        <div className="overflow-hidden">
          <div className="flex animate-marquee">
            {/* First set of testimonials */}
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex-shrink-0 w-80 mx-4">
                <div className="bg-white rounded-2xl p-8 shadow-xl h-full border-4 border-[#D4AF37]/30 relative">
                  {/* Decorative corner accent */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-[#F6C84C] rounded-full"></div>
                  
                  {/* Star Rating */}
                  <div className="flex mb-6">
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-[#4A4A4A] leading-relaxed font-sans mb-6 text-base">
                    "{testimonial.text}"
                  </p>
                  
                  {/* Customer Name */}
                  <p className="text-[#8B1E1E] font-bold font-serif text-lg">
                    — {testimonial.name}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {testimonials.map((testimonial) => (
              <div key={`duplicate-${testimonial.id}`} className="flex-shrink-0 w-80 mx-4">
                <div className="bg-white rounded-2xl p-8 shadow-xl h-full border-4 border-[#D4AF37]/30 relative">
                  {/* Decorative corner accent */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-[#F6C84C] rounded-full"></div>
                  
                  {/* Star Rating */}
                  <div className="flex mb-6">
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-[#4A4A4A] leading-relaxed font-sans mb-6 text-base">
                    "{testimonial.text}"
                  </p>
                  
                  {/* Customer Name */}
                  <p className="text-[#8B1E1E] font-bold font-serif text-lg">
                    — {testimonial.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative pattern border at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-6 flex items-center justify-center overflow-hidden">
        <div className="flex gap-4 text-[#D4AF37] opacity-60">
          {[...Array(50)].map((_, i) => (
            <span key={i} className="text-lg">✦</span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
