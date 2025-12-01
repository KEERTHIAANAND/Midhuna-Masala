"use client";
import React from 'react';

const orders = [
  {
    id: 'ORD-1001',
    date: '10/15/2023',
    title: 'In Your Kitchen',
    items: [
      { name: 'Guntur Red Chilli Powder', quantity: '200G X 2', price: 12.98, img: '/images/products/chilli.jpg' },
      { name: 'Chettinad Masala Blend', quantity: '100G X 1', price: 9.99, img: '/images/products/masala.jpg' },
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
    items: [
      { name: 'Chettinad Masala Blend', quantity: '100G X 1', price: 4.99, img: '/images/products/masala.jpg' },
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
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#8B1E1E] to-[#A02C2C] rounded-full mb-4 shadow-md">
            <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#8B1E1E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Spice Chronicles
          </h1>
          <p className="text-base text-[#D4AF37] italic" style={{ fontFamily: 'Crimson Text, serif' }}>
            Track the journey of your authentic flavors.
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-[#8B1E1E]">
              {/* Order Header - Always Visible */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#8B1E1E]/5 to-transparent">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8B1E1E] to-[#A02C2C] rounded-lg flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#8B1E1E]" style={{ fontFamily: 'Playfair Display, serif' }}>{order.id}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{order.date}</p>
                    <p className="text-sm font-semibold text-[#A02C2C] mt-0.5" style={{ fontFamily: 'Crimson Text, serif' }}>{order.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#8B1E1E]" style={{ fontFamily: 'Playfair Display, serif' }}>${order.total.toFixed(2)}</p>
                  <button 
                    onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                    className="mt-2 text-xs text-[#D4AF37] hover:text-[#8B1E1E] font-medium transition-colors uppercase tracking-wider"
                  >
                    {selectedOrder === order.id ? 'Hide Details ↑' : 'View Journey →'}
                  </button>
                </div>
              </div>

              {/* Expandable Order Details */}
              {selectedOrder === order.id && (
                <div className="p-4 border-t border-gray-100">
                  <h4 className="text-base font-bold text-[#8B1E1E] mb-4 flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Story of your Spice
                  </h4>
                  
                  {/* Timeline */}
                  <div className="relative mb-6">
                    <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200"></div>
                    <div className="flex justify-between relative">
                      {order.timeline.map((step, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-3 ${
                            step.completed ? 'bg-white border-[#8B1E1E]' : 'bg-gray-50 border-gray-200'
                          } shadow-md z-10`}>
                            <svg className={`w-6 h-6 ${step.completed ? 'text-[#8B1E1E]' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
                              {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />}
                              {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />}
                              {index === 3 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />}
                            </svg>
                          </div>
                          <p className={`mt-2 text-xs font-bold uppercase tracking-wider ${
                            step.completed ? 'text-[#8B1E1E]' : 'text-gray-400'
                          }`} style={{ fontFamily: 'Crimson Text, serif' }}>{step.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-center text-sm italic text-[#D4AF37] mb-6" style={{ fontFamily: 'Crimson Text, serif' }}>
                    &ldquo;Ready to create magic.&rdquo;
                  </p>

                  {/* Contents Section */}
                  <div className="bg-gradient-to-br from-[#FAF8F3] to-white rounded-lg p-4 border border-[#E5D4B8]">
                    <h4 className="text-base font-bold text-[#8B1E1E] mb-4 uppercase tracking-wider" style={{ fontFamily: 'Playfair Display, serif' }}>Contents</h4>
                    
                    <div className="space-y-3 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#E5D4B8] to-[#D4C4A8] rounded-lg flex items-center justify-center overflow-hidden">
                              <span className="text-xl">🌶️</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-sm text-[#8B1E1E]" style={{ fontFamily: 'Crimson Text, serif' }}>{item.name}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{item.quantity}</p>
                            </div>
                          </div>
                          <p className="text-base font-bold text-[#8B1E1E]" style={{ fontFamily: 'Playfair Display, serif' }}>${item.price.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>

                    {/* Total Summary - Split Layout */}
                    <div className="border-t border-gray-200 pt-3 flex gap-6">
                      {/* Left Side - Total Calculation */}
                      <div className="space-y-1.5 min-w-[280px]">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600" style={{ fontFamily: 'Crimson Text, serif' }}>Subtotal:</span>
                          <span className="font-semibold text-[#8B1E1E]">${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600" style={{ fontFamily: 'Crimson Text, serif' }}>Shipping:</span>
                          <span className="font-semibold text-[#8B1E1E]">${order.shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base border-t border-gray-200 pt-1.5 mt-1.5">
                          <span className="font-bold text-[#8B1E1E] uppercase tracking-wider" style={{ fontFamily: 'Playfair Display, serif' }}>Total Paid:</span>
                          <span className="font-bold text-[#A02C2C] text-xl" style={{ fontFamily: 'Playfair Display, serif' }}>${order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Right Side - Download Receipt */}
                      <div className="flex items-center ml-auto">
                        <button className="py-2 px-4 bg-white border-2 border-[#8B1E1E] text-[#8B1E1E] text-sm font-bold rounded-lg hover:bg-[#8B1E1E] hover:text-white transition-all shadow-sm flex items-center gap-2 whitespace-nowrap" style={{ fontFamily: 'Crimson Text, serif' }}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
