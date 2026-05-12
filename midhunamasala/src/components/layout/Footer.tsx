'use client';

import Link from 'next/link';

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

              {/* Facebook */}
              <a
                href="#"
                className="w-10 h-10 bg-transparent border-2 border-[#F6C84C]/40 rounded-full flex items-center justify-center hover:bg-[#F6C84C]/20 hover:border-[#F6C84C] transition-all"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 text-[#F6C84C]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24H12.82v-9.294H9.692V11.09h3.128V8.41c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.794.716-1.794 1.764v2.313h3.587l-.467 3.616h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z" />
                </svg>
              </a>

              {/* Twitter/X */}
              <a
                href="#"
                className="w-10 h-10 bg-transparent border-2 border-[#F6C84C]/40 rounded-full flex items-center justify-center hover:bg-[#F6C84C]/20 hover:border-[#F6C84C] transition-all"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 text-[#F6C84C]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M23 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724 9.864 9.864 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.38 4.482A13.944 13.944 0 0 1 1.671 3.149a4.916 4.916 0 0 0 1.523 6.574 4.897 4.897 0 0 1-2.228-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.93 4.93 0 0 1-2.224.085c.626 1.956 2.444 3.379 4.6 3.419A9.868 9.868 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.212c9.056 0 14.01-7.506 14.01-14.01 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 23 4.557z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="#"
                className="w-10 h-10 bg-transparent border-2 border-[#F6C84C]/40 rounded-full flex items-center justify-center hover:bg-[#F6C84C]/20 hover:border-[#F6C84C] transition-all"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5 text-[#F6C84C]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                className="w-10 h-10 bg-transparent border-2 border-[#F6C84C]/40 rounded-full flex items-center justify-center hover:bg-[#F6C84C]/20 hover:border-[#F6C84C] transition-all"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 text-[#F6C84C]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M7.001 2C4.243 2 2 4.243 2 7.001v9.998C2 19.757 4.243 22 7.001 22h9.998C19.757 22 22 19.757 22 17V7.001C22 4.243 19.757 2 17 2H7.001zM12 7.5A4.5 4.5 0 1 1 7.5 12 4.505 4.505 0 0 1 12 7.5zm5.25-1.875a1.125 1.125 0 1 1-1.125 1.125A1.124 1.124 0 0 1 17.25 5.625zM12 9.75A2.25 2.25 0 1 0 14.25 12 2.253 2.253 0 0 0 12 9.75z" />
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