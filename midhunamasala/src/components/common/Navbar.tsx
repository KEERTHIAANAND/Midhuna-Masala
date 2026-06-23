'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { useEffect } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Our Spices' },
  { href: '/our-craft', label: 'Our Craft' },
  { href: '/track-order', label: 'Track Order' },
  { href: '/contact-us', label: 'Contact Us' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lenis = useLenis();

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      document.body.style.overflow = '';
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      lenis?.start();
    };
  }, [mobileMenuOpen, lenis]);

  // Don't show navbar on login/signup pages or admin pages
  if (pathname === '/login' || pathname === '/signup' || pathname?.startsWith('/admin')) {
    return null;
  }

  const marqueePhrases = [
    "★ PURE AUTHENTIC CHETTINAD FLAVORS ★",
    "TRADITIONAL STONE GROUND MASALAS",
    "★ FROM OUR VILLAGE TO YOUR KITCHEN ★",
    "100% NATURAL & SUN DRIED",
    "★ AACHI'S SECRET RECIPES ★",
    "NO PRESERVATIVES OR ADDED COLORS",
    "★ HAND-POUNDED TO PERFECTION ★"
  ];
  
  // We repeat the array twice per block to guarantee it spans wider than 4K monitors
  const displayPhrases = [...marqueePhrases, ...marqueePhrases];

  return (
    <>
      {/* Marquee Section */}
      <div className="bg-[#8B1E1E] text-[#F6C84C] py-1.5 sm:py-2 overflow-hidden whitespace-nowrap relative z-50 flex">
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 40s linear infinite;
            }
          `
        }} />
        
        <div className="animate-marquee flex w-max">
          {/* First Block */}
          <div className="flex shrink-0 items-center">
            {displayPhrases.map((phrase, idx) => (
              <span key={`block1-${idx}`} className="mx-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                {phrase}
              </span>
            ))}
          </div>

          {/* Second Duplicate Block for Seamless Loop */}
          <div className="flex shrink-0 items-center">
            {displayPhrases.map((phrase, idx) => (
              <span key={`block2-${idx}`} className="mx-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                {phrase}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Navbar Section */}
      <nav className="bg-[#FFFDF5] border-b border-[#E5D2C5] relative overflow-visible">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 overflow-visible">
          <div className="flex justify-between items-center h-16 sm:h-20 md:h-24 overflow-visible">
            {/* Logo */}
            <div className="flex flex-col items-start -ml-4 sm:-ml-8 md:-ml-12 lg:-ml-16">
              <Link href="/" className="flex items-center">
                <div className="relative h-14 sm:h-16 md:h-20 w-48 sm:w-56 md:w-64 lg:w-[260px]">
                  <Image
                    src="/images/logo.png"
                    alt="Midhuna Masala"
                    fill
                    className="object-contain object-left scale-110"
                    priority
                  />
                </div>
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

        {/* Premium Full-Screen Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: '-100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-100%' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[100] bg-[#8B1E1E] md:hidden flex flex-col"
            >

              {/* Header inside Menu */}
              <div className="flex justify-between items-center h-16 sm:h-20 px-4 sm:px-6 relative z-10 border-b border-[#F6C84C]/20">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
                  <div className="relative h-8 sm:h-10 w-28 sm:w-32">
                    <Image
                      src="/images/logo.png"
                      alt="Midhuna Masala"
                      fill
                      className="object-contain object-left brightness-0 invert" 
                    />
                  </div>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#F6C84C] hover:text-[#8B1E1E] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 flex flex-col justify-center items-center relative z-10 px-6 gap-8">
                {NAV_LINKS.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <div key={link.href} className="overflow-hidden">
                      <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`text-2xl sm:text-3xl font-serif font-bold tracking-[0.15em] uppercase transition-colors relative group flex items-center gap-3 ${
                            isActive ? 'text-[#F6C84C]' : 'text-white/80 hover:text-white'
                          }`}
                        >
                          {isActive && (
                            <motion.span 
                              layoutId="mobile-nav-indicator"
                              className="w-2 h-2 bg-[#F6C84C] rounded-full" 
                            />
                          )}
                          {link.label}
                        </Link>
                      </motion.div>
                    </div>
                  );
                })}
              </div>

              {/* Footer inside menu */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="p-8 text-center relative z-10 border-t border-[#F6C84C]/20"
              >
                 <p className="text-[#F6C84C] text-xs tracking-[0.2em] uppercase opacity-80 font-bold">
                   Traditional Stone Ground Spices
                 </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
