"use client";
import React from 'react';

const orders = [
  {
    id: 'ORD-1001',
    date: '10/15/2023',
    title: 'In Your Kitchen',
    displayName: 'Chilli Powder & Masala Combo',
    items: [
      { name: 'Guntur Red Chilli Powder', quantity: '200G X 2', price: 12.98, img: '/images/products/IMG-20250726-WA0019.jpg' },
      { name: 'Chettinad Masala Blend', quantity: '100G X 1', price: 9.99, img: '/images/products/IMG-20250726-WA0021.jpg' },
    ],
    subtotal: 22.97,
    shipping: 1.00,
    total: 23.97,
    timeline: [
      { status: 'Received', completed: true },
      { status: 'Ground', completed: true },
      { status: 'Dispatched', completed: true },
      { status: 'Delivered', completed: true }
    ]
  },
  {
    id: 'ORD-1002',
    date: '10/25/2023',
    title: 'Grinding Fresh',
    displayName: 'Chettinad Masala Blend',
    items: [
      { name: 'Chettinad Masala Blend', quantity: '100G X 1', price: 4.99, img: '/images/products/IMG-20250726-WA0021.jpg' },
    ],
    subtotal: 4.99,
    shipping: 1.00,
    total: 4.99,
    timeline: [
      { status: 'Received', completed: true },
      { status: 'Ground', completed: true },
      { status: 'Dispatched', completed: false },
      { status: 'Delivered', completed: false }
    ]
  },
];

export default function TrackOrderPage() {
  const [selectedOrder, setSelectedOrder] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#FAF8F3] px-4 py-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#8B1E1E] to-[#A02C2C] rounded-full mb-4 shadow-md">
            <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#8B1E1E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Order Tracking
          </h1>
          <p className="text-base text-[#D4AF37] italic" style={{ fontFamily: 'Crimson Text, serif' }}>
            Track your spice journey from our village to your kitchen.
          </p>
        </div>

        {/* Orders Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const isDelivered = order.timeline.every(step => step.completed);
            const currentStep = order.timeline.filter(step => step.completed).length;
            const statusText = isDelivered ? 'Delivered' : order.timeline[currentStep - 1]?.status || 'Processing';

            return (
              <div
                key={order.id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Diagonal Ribbon - Top Right Corner */}
                <div className="absolute top-0 right-0 z-20 overflow-hidden w-28 h-28">
                  <div className={`absolute transform rotate-45 text-center text-[10px] font-bold uppercase tracking-wider py-1.5 w-40 top-6 -right-10 shadow-md ${isDelivered
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                    : 'bg-gradient-to-r from-[#D4AF37] to-[#C9A030] text-[#8B1E1E]'
                    }`}>
                    {statusText}
                  </div>
                </div>

                {/* Product Images Section - Top */}
                <div className="relative h-32 bg-gradient-to-br from-[#FAF8F3] to-[#F0E6D8]">
                  {order.items.length === 1 ? (
                    // Single product - centered image
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg border-2 border-white group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={order.items[0].img}
                          alt={order.items[0].name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-[#E5D4B8] to-[#D4C4A8] flex items-center justify-center text-3xl">🌶️</div>';
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    // Multiple products - horizontal strip
                    <div className="absolute inset-0 flex items-center justify-center gap-3 p-4">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="w-20 h-20 rounded-xl overflow-hidden shadow-lg border-2 border-white group-hover:scale-105 transition-transform duration-300"
                          style={{ transitionDelay: `${idx * 50}ms` }}
                        >
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-[#E5D4B8] to-[#D4C4A8] flex items-center justify-center text-2xl">🌶️</div>';
                            }}
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#8B1E1E] to-[#A02C2C] flex items-center justify-center shadow-lg border-2 border-white">
                          <span className="text-white font-bold text-lg">+{order.items.length - 3}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Decorative wave bottom */}
                  <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 400 20" className="w-full h-5 fill-white">
                      <path d="M0,20 Q100,0 200,10 T400,20 L400,20 L0,20 Z" />
                    </svg>
                  </div>
                </div>

                {/* Order Info Section */}
                <div className="p-4 pt-1">
                  {/* Product Name & Meta */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-4">
                      <h3 className="text-base font-bold text-[#8B1E1E] mb-0.5 line-clamp-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {order.displayName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <svg className="w-3 h-3 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{order.date}</span>
                        <span className="text-[#D4AF37]">•</span>
                        <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#8B1E1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                    className="w-full py-2.5 bg-gradient-to-r from-[#8B1E1E] to-[#A02C2C] text-white text-xs font-semibold rounded-lg hover:from-[#6B1515] hover:to-[#8B1E1E] transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-1.5"
                  >
                    {selectedOrder === order.id ? 'Hide Details' : 'View Journey'}
                    <svg className={`w-4 h-4 transition-transform duration-300 ${selectedOrder === order.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Overlay for Order Details */}
      {selectedOrder && (() => {
        const order = orders.find(o => o.id === selectedOrder);
        if (!order) return null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#8B1E1E] to-[#A02C2C] px-5 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {order.displayName}
                  </h3>
                  <p className="text-xs text-white/70">{order.date}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Order ID */}
              <div className="px-5 py-3 border-b border-[#E5D4B8]/30 flex items-center justify-between bg-[#FAF8F3]">
                <span className="text-sm text-gray-500">Order Reference</span>
                <span className="text-sm font-bold text-[#8B1E1E] bg-[#8B1E1E]/10 px-3 py-1 rounded-full">{order.id}</span>
              </div>

              {/* Timeline */}
              <div className="px-5 py-4">
                <h4 className="text-xs font-bold text-[#8B1E1E] mb-4 uppercase tracking-wider">
                  Spice Journey
                </h4>
                <div className="relative">
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-[#E5D4B8]"></div>
                  <div className="flex justify-between relative">
                    {order.timeline.map((step, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step.completed
                            ? 'bg-gradient-to-br from-[#8B1E1E] to-[#A02C2C] border-[#8B1E1E] text-white'
                            : 'bg-white border-[#E5D4B8] text-gray-300'
                          } shadow-sm z-10`}>
                          {step.completed ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-[10px] font-bold">{index + 1}</span>
                          )}
                        </div>
                        <p className={`mt-1.5 text-[10px] font-semibold ${step.completed ? 'text-[#8B1E1E]' : 'text-gray-400'
                          }`}>{step.status}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Contents */}
              <div className="px-5 pb-4">
                <h4 className="text-xs font-bold text-[#8B1E1E] mb-3 uppercase tracking-wider">
                  Order Contents
                </h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-2.5 bg-[#FAF8F3] rounded-lg">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0 shadow-sm">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-lg">🌶️</div>';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#8B1E1E] truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-[#8B1E1E]">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="px-5 py-4 bg-[#FAF8F3] border-t border-[#E5D4B8]/30">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-500">Subtotal: <span className="font-semibold text-[#8B1E1E]">${order.subtotal.toFixed(2)}</span></span>
                      <span className="text-gray-500">Shipping: <span className="font-semibold text-[#8B1E1E]">${order.shipping.toFixed(2)}</span></span>
                    </div>
                    <p className="text-base font-bold text-[#8B1E1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Total Paid: <span className="text-lg">${order.total.toFixed(2)}</span>
                    </p>
                  </div>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-[#8B1E1E] text-[#8B1E1E] text-xs font-semibold rounded-lg hover:bg-[#8B1E1E] hover:text-white transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
