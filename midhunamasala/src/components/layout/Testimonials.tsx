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
        <span key={i} className="text-yellow-400 text-lg">★</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400 text-lg">☆</span>
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
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif tracking-wider uppercase">
            Voices of Tradition
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-sans tracking-wide">
            Hear from our happy customers who love the taste of tradition
          </p>
        </div>

        {/* Marquee Testimonials */}
        <div className="overflow-hidden">
          <div className="flex animate-marquee">
            {/* First set of testimonials */}
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex-shrink-0 w-80 mx-4">
                <div className="bg-white rounded-xl p-6 shadow-lg h-full">
                  {/* Star Rating */}
                  <div className="flex mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-gray-700 leading-relaxed font-sans mb-4">
                    "{testimonial.text}"
                  </p>
                  
                  {/* Customer Name */}
                  <p className="text-gray-900 font-semibold font-sans">
                    — {testimonial.name}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {testimonials.map((testimonial) => (
              <div key={`duplicate-${testimonial.id}`} className="flex-shrink-0 w-80 mx-4">
                <div className="bg-white rounded-xl p-6 shadow-lg h-full">
                  {/* Star Rating */}
                  <div className="flex mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-gray-700 leading-relaxed font-sans mb-4">
                    "{testimonial.text}"
                  </p>
                  
                  {/* Customer Name */}
                  <p className="text-gray-900 font-semibold font-sans">
                    — {testimonial.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
