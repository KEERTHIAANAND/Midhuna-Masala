"use client";
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, shipping, total } = useCart();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Toggle item selection
  const toggleSelection = (itemId: number) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Calculate selected items total
  const selectedSubtotal = items
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const selectedShipping = selectedSubtotal >= 25 ? 0 : selectedSubtotal > 0 ? 4.99 : 0;
  const selectedTotal = selectedSubtotal + selectedShipping;

  return (
    <div className="min-h-screen bg-[#FAF8F3] px-4 py-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#8B1E1E] to-[#A02C2C] rounded-full mb-4 shadow-md">
            <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#8B1E1E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Your Cart
          </h1>
          <p className="text-base text-[#D4AF37] italic" style={{ fontFamily: 'Crimson Text, serif' }}>
            {items.length} {items.length === 1 ? 'item' : 'items'} in cart • {selectedItems.length} selected
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FAF8F3] to-[#F0E6D8] rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg mb-6" style={{ fontFamily: 'Crimson Text, serif' }}>Your cart is empty</p>
            <Link href="/shop" className="inline-block bg-gradient-to-r from-[#8B1E1E] to-[#A02C2C] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Clean Card Grid Layout */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
                {items.map((item) => {
                  const isSelected = selectedItems.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full ${isSelected ? 'ring-2 ring-[#8B1E1E]' : ''
                        }`}
                      onClick={() => toggleSelection(item.id)}
                    >
                      {/* Selection Checkbox - Top Right */}
                      <div className="absolute top-3 right-3 z-30">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                          ? 'bg-[#8B1E1E] border-[#8B1E1E]'
                          : 'bg-white border-gray-300'
                          }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Product Image - 3:4 aspect ratio for compact height */}
                      <div className="relative aspect-[4/3] bg-gradient-to-br from-[#FAF7F2] to-[#F5EDE1] overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-[#E5D4B8] to-[#D4C4A8] flex items-center justify-center text-3xl">🌶️</div>';
                          }}
                        />
                      </div>

                      {/* Product Info Section - Compact Design */}
                      <div className="p-3 text-center flex flex-col flex-grow">
                        {/* Product Name - Reduced min height */}
                        <div className="min-h-[44px] flex items-start justify-center">
                          <h3 className="text-base font-semibold text-[#8B1E1E] line-clamp-2 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                            {item.name}
                          </h3>
                        </div>

                        {/* Weight */}
                        <p className="text-xs text-[#9B8B7A] mb-2">
                          {item.weight} Pack
                        </p>

                        {/* Price */}
                        <p className="text-xl font-bold text-[#8B1E1E] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>

                        {/* Spacer to push controls to bottom */}
                        <div className="flex-grow"></div>

                        {/* Quantity Controls - Smaller buttons */}
                        <div className="flex items-center justify-center gap-2 mb-3" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, item.quantity - 1); }}
                            className="w-8 h-8 rounded-full bg-[#FAF8F3] border border-[#E5D4B8] text-[#8B1E1E] font-bold text-sm hover:bg-[#8B1E1E] hover:text-white hover:border-[#8B1E1E] transition-all flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-bold text-base text-[#8B1E1E]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, item.quantity + 1); }}
                            className="w-8 h-8 rounded-full bg-[#FAF8F3] border border-[#E5D4B8] text-[#8B1E1E] font-bold text-sm hover:bg-[#8B1E1E] hover:text-white hover:border-[#8B1E1E] transition-all flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button - More compact */}
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                          className="w-full py-2.5 text-xs font-semibold text-white bg-[#8B1E1E] hover:bg-[#6B1515] rounded-full transition-all flex items-center justify-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove from Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary - Only shows when items are selected */}
            {selectedItems.length > 0 && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-6">
                  {/* Summary Header */}
                  <div className="bg-gradient-to-r from-[#8B1E1E] to-[#A02C2C] px-6 py-4">
                    <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Order Summary
                    </h2>
                    <p className="text-xs text-white/70">{selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected</p>
                  </div>

                  <div className="p-6">
                    {/* Selected Items List */}
                    <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                      {items.filter(item => selectedItems.includes(item.id)).map(item => (
                        <div key={item.id} className="flex items-center justify-between text-xs bg-[#FAF8F3] px-3 py-2 rounded-lg">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="font-semibold text-[#8B1E1E] truncate">{item.name}</span>
                            <span className="text-gray-400">×{item.quantity}</span>
                          </div>
                          <span className="font-bold text-[#8B1E1E]">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 mb-6 border-t border-[#E5D4B8] pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-semibold text-[#8B1E1E]">${selectedSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping:</span>
                        <span className={`font-semibold ${selectedShipping === 0 ? 'text-emerald-600' : 'text-[#8B1E1E]'}`}>
                          {selectedShipping === 0 ? 'FREE' : `$${selectedShipping.toFixed(2)}`}
                        </span>
                      </div>
                      {selectedShipping > 0 && (
                        <p className="text-xs text-[#D4AF37] italic bg-[#D4AF37]/10 px-3 py-2 rounded-lg">
                          Add ${(25 - selectedSubtotal).toFixed(2)} more for free shipping!
                        </p>
                      )}
                      <div className="border-t border-[#E5D4B8] pt-3">
                        <div className="flex justify-between">
                          <span className="font-bold text-[#8B1E1E]" style={{ fontFamily: 'Playfair Display, serif' }}>Total:</span>
                          <span className="font-bold text-[#A02C2C] text-2xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                            ${selectedTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-[#8B1E1E] to-[#A02C2C] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all mb-3 flex items-center justify-center gap-2 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Checkout ({selectedItems.length})
                    </button>

                    <Link href="/shop" className="block w-full text-center border-2 border-[#8B1E1E] text-[#8B1E1E] py-2.5 rounded-xl font-semibold hover:bg-[#8B1E1E] hover:text-white transition-all text-sm">
                      Continue Shopping
                    </Link>

                    {/* Trust Badges */}
                    <div className="mt-6 pt-5 border-t border-[#E5D4B8]">
                      <div className="space-y-2.5 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                          </svg>
                          <span>Secure checkout</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                          </svg>
                          <span>Free delivery over $25</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                          </svg>
                          <span>Freshly ground on order</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Show empty summary state when no items selected */}
            {selectedItems.length === 0 && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <p className="text-sm text-gray-500 text-center italic" style={{ fontFamily: 'Crimson Text, serif' }}>
                    Click on items to select them for checkout
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div >
  );
}