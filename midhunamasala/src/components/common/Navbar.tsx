'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  // Don't show navbar on login/signup pages
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <>
      {/* Marquee Section */}
      <div className="bg-[#8B1E1E] text-[#F6C84C] py-2 overflow-hidden whitespace-nowrap relative z-50">
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-100%); }
            }
            .animate-marquee {
              animation: marquee 25s linear infinite;
            }
          `
        }} />
        <div className="animate-marquee inline-block">
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ PURE AUTHENTIC CHETTINAD FLAVORS ★</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">TRADITIONAL STONE GROUND MASALAS</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ FROM OUR VILLAGE TO YOUR KITCHEN ★</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">100% NATURAL &amp; SUN DRIED</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ PURE AUTHENTIC CHETTINAD FLAVORS ★</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">TRADITIONAL STONE GROUND MASALAS</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ FROM OUR VILLAGE TO YOUR KITCHEN ★</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">100% NATURAL &amp; SUN DRIED</span>
        </div>
        <div className="animate-marquee inline-block absolute top-2 left-0">
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ PURE AUTHENTIC CHETTINAD FLAVORS ★</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">TRADITIONAL STONE GROUND MASALAS</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ FROM OUR VILLAGE TO YOUR KITCHEN ★</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">100% NATURAL &amp; SUN DRIED</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ PURE AUTHENTIC CHETTINAD FLAVORS ★</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">TRADITIONAL STONE GROUND MASALAS</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ FROM OUR VILLAGE TO YOUR KITCHEN ★</span>
          <span className="mx-4 text-xs font-bold tracking-widest uppercase">100% NATURAL &amp; SUN DRIED</span>
        </div>
      </div>

      {/* Navbar Section */}
      <nav className="bg-[#FFFDF5] border-b border-[#E5D2C5] relative overflow-visible">
        {/* Dotted pattern overlay */}
        <div className="absolute inset-0 opacity-50 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#8B1E1E 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 overflow-visible">
          <div className="flex justify-between items-center h-24 overflow-visible">
            {/* Logo */}
            <div className="flex flex-col items-start">
              <Link href="/" className="flex flex-col">
                <span className="text-4xl font-bold text-[#8B1E1E] font-serif tracking-wide">
                  Midhuna Masala
                </span>
                <span className="text-[10px] font-bold text-[#8B1E1E] tracking-[0.2em] uppercase mt-1 text-center w-full">
                  Traditional Stone Ground Spices
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-12">
              <Link
                href="/"
                className={`text-[#8B1E1E] font-bold text-xs hover:text-[#D4AF37] transition-colors tracking-[0.2em] uppercase pb-1 ${pathname === '/' ? 'border-b-2 border-[#D4AF37]' : ''
                  }`}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className={`text-[#8B1E1E] font-bold text-xs hover:text-[#D4AF37] transition-colors tracking-[0.2em] uppercase pb-1 ${pathname === '/shop' ? 'border-b-2 border-[#D4AF37]' : ''
                  }`}
              >
                Our Spices
              </Link>
              <Link
                href="/track-order"
                className={`text-[#8B1E1E] font-bold text-xs hover:text-[#D4AF37] transition-colors tracking-[0.2em] uppercase pb-1 ${pathname === '/track-order' ? 'border-b-2 border-[#D4AF37]' : ''
                  }`}
              >
                Track Order
              </Link>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-12 overflow-visible">
              {/* Cart */}
              <Link href="/cart" className="text-[#8B1E1E] hover:text-[#D4AF37] transition-colors relative">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#D4AF37] text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 text-[#8B1E1E] hover:text-[#D4AF37] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8B1E1E] to-[#6B1616] flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50"
                      >
                        {/* User Info */}
                        <div className="px-4 py-4 bg-gradient-to-r from-[#8B1E1E]/5 to-[#F6C84C]/10 border-b border-gray-100 rounded-t-xl">
                          <p className="font-bold text-gray-800">{user?.name}</p>
                          <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            href="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-[#8B1E1E]/5 transition-colors"
                          >
                            <User className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm font-medium">My Profile</span>
                          </Link>
                          <Link
                            href="/orders"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-[#8B1E1E]/5 transition-colors"
                          >
                            <ShoppingCart className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm font-medium">My Orders</span>
                          </Link>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-100 py-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                          >
                            <LogOut className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm font-medium">Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-[#8B1E1E] hover:text-[#D4AF37] transition-colors"
                  title="Login / Sign Up"
                >
                  <User className="w-6 h-6" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
