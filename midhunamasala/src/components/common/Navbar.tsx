'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { cartCount } = useCart();

  // Don't show navbar on login/signup pages or admin pages
  if (pathname === '/login' || pathname === '/signup' || pathname?.startsWith('/admin')) {
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
                className={`text-[#8B1E1E] font-bold text-sm hover:text-[#D4AF37] transition-colors tracking-[0.2em] uppercase pb-1 ${pathname === '/' ? 'border-b-2 border-[#D4AF37]' : ''
                  }`}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className={`text-[#8B1E1E] font-bold text-sm hover:text-[#D4AF37] transition-colors tracking-[0.2em] uppercase pb-1 ${pathname === '/shop' ? 'border-b-2 border-[#D4AF37]' : ''
                  }`}
              >
                Our Spices
              </Link>
              <Link
                href="/track-order"
                className={`text-[#8B1E1E] font-bold text-sm hover:text-[#D4AF37] transition-colors tracking-[0.2em] uppercase pb-1 ${pathname === '/track-order' ? 'border-b-2 border-[#D4AF37]' : ''
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
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-[#8B1E1E] hover:text-[#D4AF37] transition-colors group"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B1E1E] via-[#A52A2A] to-[#6B1616] flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-300 ring-2 ring-transparent group-hover:ring-[#D4AF37]/50"
                  >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </motion.div>
                </Link>
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
