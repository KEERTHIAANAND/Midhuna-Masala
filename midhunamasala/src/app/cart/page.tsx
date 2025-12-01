"use client";
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, shipping, total } = useCart();

  return (
    <div className="min-h-screen bg-[#FAF8F3] px-4 py-6">
      <div className="mx-auto max-w-5xl">
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
            {items.length} {items.length === 1 ? 'item' : 'items'} ready for checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-gray-500 text-lg mb-4" style={{ fontFamily: 'Crimson Text, serif' }}>Your cart is empty</p>
                <Link href="/shop" className="bg-gradient-to-r from-[#8B1E1E] to-[#A02C2C] text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all inline-block">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-[#8B1E1E]">
                  <div className="flex items-center gap-4 p-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gradient-to-br from-[#E5D4B8] to-[#D4C4A8] rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl">🌶️</span>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-[#8B1E1E] truncate" style={{ fontFamily: 'Crimson Text, serif' }}>
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{item.weight}</p>
                      <p className="text-sm font-bold text-[#A02C2C] mt-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                        ${item.price.toFixed(2)}
                      </p>
                      {item.inStock ? (
                        <span className="inline-block text-xs text-green-600 font-semibold mt-1">In Stock</span>
                      ) : (
                        <span className="inline-block text-xs text-red-600 font-semibold mt-1">Out of Stock</span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border-2 border-[#8B1E1E] text-[#8B1E1E] font-bold hover:bg-[#8B1E1E] hover:text-white transition-all"
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-bold text-[#8B1E1E]" style={{ fontFamily: 'Crimson Text, serif' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg border-2 border-[#8B1E1E] text-[#8B1E1E] font-bold hover:bg-[#8B1E1E] hover:text-white transition-all"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total & Remove */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <p className="text-lg font-bold text-[#8B1E1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold text-[#8B1E1E] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600" style={{ fontFamily: 'Crimson Text, serif' }}>Subtotal:</span>
                  <span className="font-semibold text-[#8B1E1E]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600" style={{ fontFamily: 'Crimson Text, serif' }}>Shipping:</span>
                  <span className="font-semibold text-[#8B1E1E]">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-[#D4AF37] italic">
                    Free shipping on orders over $25
                  </p>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-[#8B1E1E]" style={{ fontFamily: 'Playfair Display, serif' }}>Total:</span>
                    <span className="font-bold text-[#A02C2C] text-2xl" style={{ fontFamily: 'Playfair Display, serif' }}>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-[#8B1E1E] to-[#A02C2C] text-white py-3 px-6 rounded-lg font-bold hover:shadow-lg transition-all mb-3 flex items-center justify-center gap-2" style={{ fontFamily: 'Crimson Text, serif' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Proceed to Checkout
              </button>

              <Link href="/shop" className="block w-full text-center bg-white border-2 border-[#8B1E1E] text-[#8B1E1E] py-3 px-6 rounded-lg font-bold hover:bg-[#8B1E1E] hover:text-white transition-all" style={{ fontFamily: 'Crimson Text, serif' }}>
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3 text-xs text-gray-600">
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
      </div>
    </div>
  );
}