'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import Footer from '@/components/layout/Footer';

interface PolicyLayoutProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  lastUpdated: string;
  children: ReactNode;
}

export default function PolicyLayout({ title, subtitle, icon, lastUpdated, children }: PolicyLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FFFDF5]">
      {/* Hero Banner */}
      <section className="relative bg-[#8B1E1E] overflow-hidden">
        {/* Dotted background pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#F6C84C 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

        {/* Diagonal accent line */}
        <div className="absolute top-0 right-0 w-80 h-80 opacity-10 pointer-events-none">
          <svg viewBox="0 0 320 320" fill="none">
            <path d="M0 320L320 0" stroke="#F6C84C" strokeWidth="1" />
            <path d="M40 320L320 40" stroke="#F6C84C" strokeWidth="0.5" />
            <path d="M80 320L320 80" stroke="#F6C84C" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex justify-center mb-5"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#F6C84C]/40 flex items-center justify-center text-[#F6C84C]">
              {icon}
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-serif tracking-wide mb-3"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm sm:text-base text-[#F6C84C]/80 font-serif italic"
          >
            {subtitle}
          </motion.p>

          {/* Last updated badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-5 inline-flex items-center gap-2 bg-[#F6C84C]/10 border border-[#F6C84C]/20 rounded-full px-4 py-1.5"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#F6C84C]" />
            <span className="text-xs text-[#F6C84C]/70 tracking-wider uppercase">
              Last updated: {lastUpdated}
            </span>
          </motion.div>
        </div>

        {/* Bottom wave separator */}
        <div className="absolute -bottom-px left-0 right-0">
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="block w-full h-6 sm:h-8 md:h-10">
            <path
              d="M0 40V20C240 0 480 0 720 20C960 40 1200 40 1440 20V40H0Z"
              fill="#FFFDF5"
            />
          </svg>
        </div>
      </section>


      {/* Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(139,30,30,0.06)] border border-[#F5E9DB]/60 overflow-hidden"
        >
          {/* Top decorative border */}
          <div className="h-1 bg-gradient-to-r from-[#8B1E1E] via-[#D4AF37] to-[#8B1E1E]" />

          <div className="p-6 sm:p-8 md:p-12 lg:p-16 policy-content">
            {children}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

/* Reusable section component for policy pages */
export function PolicySection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="mb-10 last:mb-0"
    >
      <div className="flex items-start gap-3 sm:gap-4 mb-4">
        <span className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#8B1E1E]/5 border border-[#8B1E1E]/10 flex items-center justify-center text-xs sm:text-sm font-bold text-[#8B1E1E]/60 font-serif">
          {number}
        </span>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#8B1E1E] font-serif pt-0.5 sm:pt-1">
          {title}
        </h2>
      </div>
      <div className="pl-11 sm:pl-[52px] text-sm sm:text-base text-[#4A3728] leading-relaxed space-y-3">
        {children}
      </div>
    </motion.section>
  );
}
