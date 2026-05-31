"use client";
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/layout/Footer';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, shipping, total } = useCart();
  const [removingId, setRemovingId] = useState<number | null>(null);

  const handleRemove = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);
    }, 300);
  };



  return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col">
      <div className="flex-1">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#8B1E1E] to-[#A02C2C] rounded-full mb-4 shadow-lg"
            >
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8B1E1E] mb-2 font-serif"
            >
              Your Cart
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="text-sm text-[#D4AF37] italic font-serif"
            >
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </motion.p>
          </div>

          {items.length === 0 ? (
            /* Empty Cart State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(139,30,30,0.06)] border border-[#F5E9DB]/60 p-10 sm:p-16 text-center max-w-md mx-auto"
            >
              <div className="w-20 h-20 bg-[#F5E9DB]/30 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-[#8B1E1E]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-[#4A3728]/60 text-lg mb-2 font-serif italic">Your cart is empty</p>
              <p className="text-[#4A3728]/40 text-sm mb-8">
                Explore our collection of authentic stone-ground spices
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#8B1E1E] text-white px-8 py-3.5 rounded-xl font-bold text-sm tracking-[0.1em] uppercase hover:bg-[#6B1616] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                Continue Shopping
              </Link>
            </motion.div>
          ) : (
            /* Cart with Items */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Cart Items List */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(139,30,30,0.06)] border border-[#F5E9DB]/60 overflow-hidden">
                  {/* Table Header */}
                  <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-[#8B1E1E]/[0.03] border-b border-[#F5E9DB]/60 text-xs font-bold text-[#8B1E1E]/50 tracking-[0.15em] uppercase">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>

                  {/* Cart Items */}
                  <AnimatePresence>
                    {items.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{
                          opacity: removingId === item.id ? 0 : 1,
                          y: 0,
                          x: removingId === item.id ? -100 : 0,
                          height: removingId === item.id ? 0 : 'auto',
                        }}
                        exit={{ opacity: 0, x: -100, height: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="border-b border-[#F5E9DB]/40 last:border-b-0"
                      >
                        <div className="grid grid-cols-12 gap-3 sm:gap-4 items-center px-4 sm:px-6 py-4 sm:py-5">
                          {/* Product Info */}
                          <div className="col-span-12 sm:col-span-6 flex items-center gap-3 sm:gap-4">
                            {/* Product Image */}
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#FAF7F2] to-[#F5EDE1] rounded-xl overflow-hidden flex-shrink-0 border border-[#F5E9DB]/60">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-contain p-1.5"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-2xl">🌶️</div>';
                                }}
                              />
                            </div>
                            {/* Name & Weight */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm sm:text-base font-bold text-[#8B1E1E] font-serif line-clamp-2 leading-tight">
                                {item.name}
                              </h3>
                              <p className="text-xs text-[#4A3728]/50 mt-0.5">
                                {item.weight}
                              </p>
                              {/* Mobile: Remove Button */}
                              <button
                                onClick={() => handleRemove(item.id)}
                                className="sm:hidden mt-1.5 text-xs text-[#8B1E1E]/40 hover:text-[#8B1E1E] transition-colors flex items-center gap-1"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove
                              </button>
                            </div>
                          </div>

                          {/* Unit Price */}
                          <div className="hidden sm:flex col-span-2 justify-center">
                            <span className="text-sm text-[#4A3728]/70 font-medium">
                              ₹{item.price.toFixed(2)}
                            </span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="col-span-6 sm:col-span-2 flex justify-start sm:justify-center">
                            <div className="flex items-center gap-0 border border-[#F5E9DB] rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-[#8B1E1E] hover:bg-[#8B1E1E] hover:text-white transition-all duration-200 text-sm font-bold"
                              >
                                −
                              </button>
                              <span className="w-8 sm:w-10 text-center font-bold text-sm text-[#8B1E1E] border-x border-[#F5E9DB]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-[#8B1E1E] hover:bg-[#8B1E1E] hover:text-white transition-all duration-200 text-sm font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Line Total + Remove */}
                          <div className="col-span-6 sm:col-span-2 flex items-center justify-end gap-3">
                            <span className="text-base sm:text-lg font-bold text-[#8B1E1E] font-serif">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                            {/* Desktop: Remove Button */}
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="hidden sm:flex w-7 h-7 items-center justify-center rounded-full text-[#8B1E1E]/30 hover:text-white hover:bg-[#8B1E1E] transition-all duration-200"
                              title="Remove item"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Continue Shopping Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4"
                >
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#8B1E1E]/60 hover:text-[#8B1E1E] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                  </Link>
                </motion.div>
              </div>

              {/* Order Summary — Always Visible */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(139,30,30,0.06)] border border-[#F5E9DB]/60 overflow-hidden sticky top-6"
                >
                  {/* Summary Header */}
                  <div className="bg-gradient-to-r from-[#8B1E1E] to-[#A02C2C] px-6 py-4">
                    <h2 className="text-lg font-bold text-white font-serif">
                      Order Summary
                    </h2>
                    <p className="text-xs text-white/60 mt-0.5">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>

                  <div className="p-6">
                    {/* Items Summary */}
                    <div className="space-y-2 mb-5 max-h-40 overflow-y-auto">
                      {items.map(item => (
                        <div key={item.id} className="flex items-center justify-between text-xs bg-[#F5E9DB]/20 px-3 py-2.5 rounded-lg">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="font-semibold text-[#8B1E1E] truncate">{item.name}</span>
                            <span className="text-[#4A3728]/40 flex-shrink-0">×{item.quantity}</span>
                          </div>
                          <span className="font-bold text-[#8B1E1E] flex-shrink-0 ml-2">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3 mb-6 border-t border-[#F5E9DB] pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#4A3728]/60">Subtotal</span>
                        <span className="font-semibold text-[#8B1E1E]">₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-[#F5E9DB] pt-3">
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-[#8B1E1E] font-serif">Total</span>
                          <span className="font-bold text-[#8B1E1E] text-2xl font-serif">
                            ₹{subtotal.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#4A3728]/40 text-right mt-0.5">
                          Inclusive of all taxes
                        </p>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Link
                      href="/checkout"
                      className="w-full bg-gradient-to-r from-[#8B1E1E] to-[#A02C2C] text-white py-3.5 rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-[0.1em] uppercase"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      Proceed to Checkout
                    </Link>

                    {/* Continue Shopping */}
                    <Link
                      href="/shop"
                      className="block w-full text-center border-2 border-[#8B1E1E]/20 text-[#8B1E1E] py-2.5 rounded-xl font-semibold hover:border-[#8B1E1E] hover:bg-[#8B1E1E]/[0.02] transition-all text-sm mt-3"
                    >
                      Continue Shopping
                    </Link>

                    {/* Trust Badges */}
                    <div className="mt-6 pt-5 border-t border-[#F5E9DB]">
                      <div className="space-y-2.5 text-xs text-[#4A3728]/50">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                          </svg>
                          <span>Secure & encrypted checkout</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                          </svg>
                          <span>Free delivery on all orders</span>
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
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}