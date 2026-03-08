'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Our Spices' },
  { href: '/track-order', label: 'Track Order' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show navbar on login/signup pages or admin pages
  if (pathname === '/login' || pathname === '/signup' || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Marquee Section */}
      <div className="bg-[#8B1E1E] text-[#F6C84C] py-1.5 sm:py-2 overflow-hidden whitespace-nowrap relative z-50">
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
          <span className="mx-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase">★ PURE AUTHENTIC CHETTINAD FLAVORS ★</span>
          <span className="mx-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase">TRADITIONAL STONE GROUND MASALAS</span>
          <span className="mx-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase">★ FROM OUR VILLAGE TO YOUR KITCHEN ★</span>
          <span className="mx-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase">100% NATURAL &amp; SUN DRIED</span>
          <span className="mx-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase">★ PURE AUTHENTIC CHETTINAD FLAVORS ★</span>
          <span className="mx-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase">TRADITIONAL STONE GROUND MASALAS</span>
          <span className="mx-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase">★ FROM OUR VILLAGE TO YOUR KITCHEN ★</span>
          <span className="mx-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase">100% NATURAL &amp; SUN DRIED</span>
        </div>
        <div className="animate-marquee inline-block absolute top-1.5 sm:top-2 left-0">
          <span className="mx-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase">★ PURE AUTHENTIC CHETTINAD FLAVORS ★</span>
          <span className="mx-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase">TRADITIONAL STONE GROUND MASALAS</span>
          <span className="mx-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase">★ FROM OUR VILLAGE TO YOUR KITCHEN ★</span>
          <span className="mx-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase">100% NATURAL &amp; SUN DRIED</span>
          <span className="mx-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase">★ PURE AUTHENTIC CHETTINAD FLAVORS ★</span>
          <span className="mx-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase">TRADITIONAL STONE GROUND MASALAS</span>
          <span className="mx-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase">★ FROM OUR VILLAGE TO YOUR KITCHEN ★</span>
          <span className="mx-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase">100% NATURAL &amp; SUN DRIED</span>
        </div>
      </div>

      {/* Navbar Section */}
      <nav className="bg-[#FFFDF5] border-b border-[#E5D2C5] relative overflow-visible">
        {/* Dotted pattern overlay */}
        <div className="absolute inset-0 opacity-50 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#8B1E1E 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 overflow-visible">
          <div className="flex justify-between items-center h-16 sm:h-20 md:h-24 overflow-visible">
            {/* Logo */}
            <div className="flex flex-col items-start">
              <Link href="/" className="flex flex-col">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8B1E1E] font-serif tracking-wide">
                  Midhuna Masala
                </span>
                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-[#8B1E1E] tracking-[0.15em] sm:tracking-[0.2em] uppercase mt-0.5 sm:mt-1 text-center w-full">
                  Traditional Stone Ground Spices
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-12">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative text-[#8B1E1E] font-bold text-xs hover:text-[#D4AF37] transition-colors tracking-[0.2em] uppercase pb-1"
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active-indicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4 sm:gap-6 md:gap-12 overflow-visible">
              {/* Cart */}
              <Link href="/cart" id="navbar-cart-icon" className="text-[#8B1E1E] hover:text-[#D4AF37] transition-all duration-300 relative">
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 bg-[#D4AF37] text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center">
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
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#8B1E1E] via-[#A52A2A] to-[#6B1616] flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-300 ring-2 ring-transparent group-hover:ring-[#D4AF37]/50"
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
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                </Link>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-[#8B1E1E] hover:text-[#D4AF37] transition-colors p-1"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden bg-[#FFFDF5] border-t border-[#E5D2C5] relative z-20 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-3 px-4 rounded-lg text-sm font-bold tracking-[0.15em] uppercase transition-all ${pathname === link.href
                      ? 'bg-[#8B1E1E] text-white'
                      : 'text-[#8B1E1E] hover:bg-[#8B1E1E]/5'
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
