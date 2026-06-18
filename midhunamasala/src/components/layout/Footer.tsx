'use client';

import Link from 'next/link';
import { Youtube, Instagram } from 'lucide-react';

const QUICK_LINKS = [
  { href: '/shop', label: 'Our Spices' },
  { href: '/track-order', label: 'Track Order' },
  { href: '/contact-us', label: 'Contact Us' },
];

const POLICY_LINKS = [
  { href: '/terms-and-conditions', label: 'Terms & Conditions' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/cancellation-and-refund', label: 'Cancellation & Refund' },
  { href: '/shipping-and-delivery', label: 'Shipping & Delivery' },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#8B1E1E] overflow-hidden">
      {/* Dotted background pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#F6C84C 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-7xl mx-auto">

          {/* Brand */}
          <div className="md:col-span-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-serif tracking-wide">
              Midhuna Masala
            </h2>
            <p className="text-sm text-[#F6C84C] font-serif tracking-[0.2em] uppercase mt-2">
              Traditional Stone Ground Spices
            </p>
            <p className="text-xs text-white/50 mt-4 leading-relaxed max-w-xs mx-auto md:mx-0">
              Hand-pounded, sun-dried masalas crafted in the heart of Chettinad — from our village to your kitchen.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xs font-bold text-[#F6C84C] tracking-[0.2em] uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-[#F6C84C] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="text-center md:text-left">
            <h3 className="text-xs font-bold text-[#F6C84C] tracking-[0.2em] uppercase mb-4">
              Policies
            </h3>
            <ul className="space-y-2.5">
              {POLICY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-[#F6C84C] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social media icons */}
          <div className="text-center md:text-left">
            <h3 className="text-xs font-bold text-[#F6C84C] tracking-[0.2em] uppercase mb-4">
              Follow Us
            </h3>
            <div className="flex items-center justify-center md:justify-start space-x-3">

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@MIDHUNAMASALA"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 hover:-translate-y-1 transition-all duration-300 drop-shadow-md"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.58 7.19C21.36 6.31 20.69 5.64 19.81 5.42C18.25 5 12 5 12 5C12 5 5.75 5 4.19 5.42C3.31 5.64 2.64 6.31 2.42 7.19C2 8.75 2 12 2 12C2 12 2 15.25 2.42 16.81C2.64 17.69 3.31 18.36 4.19 18.58C5.75 19 12 19 12 19C12 19 18.25 19 19.81 18.58C20.69 18.36 21.36 17.69 21.58 16.81C22 15.25 22 12 22 12C22 12 22 8.75 21.58 7.19Z" fill="#FF0000"/>
                  <path d="M10 15L15.5 12L10 9V15Z" fill="white"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/midhunamasala?igsh=MWJ3d3Y4YWtnc2R1aw=="
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 hover:-translate-y-1 transition-all duration-300 drop-shadow-md"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="ig-grad" x1="12%" y1="100%" x2="88%" y2="0%">
                      <stop offset="0%" stopColor="#feda75" />
                      <stop offset="25%" stopColor="#fa7e1e" />
                      <stop offset="50%" stopColor="#d62976" />
                      <stop offset="75%" stopColor="#962fbf" />
                      <stop offset="100%" stopColor="#4f5bd5" />
                    </linearGradient>
                  </defs>
                  <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#ig-grad)" />
                  <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" stroke="white" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="3.2" stroke="white" strokeWidth="1.5" />
                  <circle cx="16.5" cy="7.5" r="1.1" fill="white" />
                </svg>
              </a>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="w-full text-center py-6 relative z-10 border-t border-[#F6C84C]/20">
        <p className="text-sm text-[#F6C84C]/80 font-serif">© 2026 Midhuna Masala. All rights reserved.</p>
      </div>
    </footer>
  );
}