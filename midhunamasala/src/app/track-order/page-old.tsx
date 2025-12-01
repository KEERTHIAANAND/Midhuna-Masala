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
    <div className="min-h-screen bg-[#FFF8ED] flex flex-col items-center justify-center px-6 py-10" style={{ backgroundImage: 'url(/images/dots-bg.png)' }}>
      <div className="text-center mb-6">
        <div className="text-4xl font-serif text-[#8B1E1E] font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          The Spice Register
        </div>
        <div className="text-[#755C48] italic text-lg" style={{ fontFamily: 'Crimson Text, serif' }}>
          "Track your parcel’s journey from our mortar to your meal."
        </div>
      </div>
      <div className="flex w-full max-w-4xl gap-6">
        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-md p-4 w-1/3 flex flex-col">
          <input
            type="text"
            placeholder="Search Order ID..."
            className="mb-4 px-4 py-2 rounded-lg border border-[#E5D4B8] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
          <div className="flex-1 overflow-y-auto">
            {orders.map(order => (
              <div
                key={order.id}
                className={`mb-2 p-3 rounded-lg cursor-pointer border-l-4 ${selectedOrder.id === order.id ? 'border-[#8B1E1E] bg-[#FFF8ED]' : 'border-transparent'} hover:bg-[#F5E6D3]`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-[#8B1E1E] text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>{order.id}</div>
                    <div className="text-[#755C48] text-xs font-semibold">{order.items.length} ITEM{order.items.length > 1 ? 'S' : ''}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status as keyof typeof statusColors]}`}>{order.status}</div>
                </div>
                <div className="text-right text-xs text-[#755C48] mt-1">{order.date}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-md p-8 w-2/3 flex flex-col border border-[#D4AF37]" style={{ boxShadow: '0 0 0 2px #D4AF37' }}>
          <div className="mb-6">
            <div className="text-2xl font-bold text-[#8B1E1E] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Order Summary</div>
            <div className="text-[#755C48] text-sm mb-2">REF: <span className="font-mono">{selectedOrder.id}</span></div>
            <hr className="border-[#E5D4B8] mb-4" />
            {selectedOrder.items.map(item => (
              <div key={item.name} className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img src={item.img} alt={item.name} className="w-12 h-12 rounded object-cover border border-[#E5D4B8]" />
                  <div>
                    <div className="font-bold text-[#8B1E1E]" style={{ fontFamily: 'Lora, serif' }}>{item.name}</div>
                    <div className="text-xs text-[#755C48]">{item.qty * 100}g x {item.qty}</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-[#8B1E1E]">${item.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold text-[#755C48]">Total Amount</div>
              <div className="text-2xl font-bold text-[#A02C2C]" style={{ fontFamily: 'Playfair Display, serif' }}>
                ${selectedOrder.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
              </div>
            </div>
            <div className="bg-[#FFF8ED] border border-[#E5D4B8] rounded-lg p-3 flex items-center gap-2 mb-2">
              <span className="text-[#A02C2C] font-bold">
                <svg className="inline w-5 h-5 mr-1" fill="none" stroke="#A02C2C" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3.5M3 10.5V17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6.5M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
                SHIPPING ADDRESS
              </span>
              <span className="text-[#755C48]">{selectedOrder.address}</span>
            </div>
          </div>
        </div>
        {/* Status Log */}
        <div className="bg-white rounded-xl shadow-md p-8 w-1/3 flex flex-col items-center">
          <div className="text-xl font-bold text-[#755C48] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Status Log
          </div>
          <div className="w-full">
            {selectedOrder.log.map((step, idx) => (
              <React.Fragment key={step.label}>
                <div className="flex items-center mb-6">
                  <div className="flex flex-col items-center mr-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${idx === selectedOrder.log.length - 1 && selectedOrder.status === 'DELIVERED' ? 'bg-green-200 border-2 border-green-600' : 'bg-[#8B1E1E] border-2 border-[#D4AF37]'}`}>
                      <svg className="w-4 h-4" fill="none" stroke={idx === selectedOrder.log.length - 1 && selectedOrder.status === 'DELIVERED' ? '#2E7D32' : '#FFF8ED'} strokeWidth={2} viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M16 8l-4.5 8L8 13" />
                      </svg>
                    </div>
                    {idx < selectedOrder.log.length - 1 && <div className="w-1 h-8 bg-[#D4AF37]"></div>}
                  </div>
                  <div>
                    <div className={`font-bold text-lg ${idx === selectedOrder.log.length - 1 && selectedOrder.status === 'DELIVERED' ? 'text-green-700' : 'text-[#8B1E1E]'}`} style={{ fontFamily: 'Playfair Display, serif' }}>{step.label}</div>
                    <div className="text-[#755C48] text-sm">{step.desc}</div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
          {selectedOrder.status === 'DELIVERED' && (
            <div className="mt-4 px-6 py-2 rounded-full bg-green-100 text-green-700 font-bold text-lg">
              SUCCESSFULLY DELIVERED
            </div>
          )}
          {selectedOrder.status === 'PROCESSING' && (
            <div className="mt-4 px-6 py-2 rounded-full bg-yellow-100 text-yellow-700 font-bold text-lg">
              PROCESSING
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
