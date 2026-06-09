'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function CraftCTA() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-[#8B1E1E]">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(#F6C84C 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#6A1515] to-transparent" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-12 h-px bg-[#F6C84C]/40 mx-auto mb-8" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white leading-tight">
            Taste What Tradition{' '}
            <span className="text-[#F6C84C]">Truly Means</span>
          </h2>
          <p className="mt-5 text-sm sm:text-base text-white/80 leading-relaxed max-w-lg mx-auto">
            Every packet of Midhuna Masala is stone-ground using these very
            tools — by skilled artisans in Chettinad. No shortcuts. No machines.
            Just pure, ancestral craft.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/shop">
            <motion.span
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#F6C84C] text-[#8B1E1E] font-bold text-sm tracking-widest uppercase rounded-full shadow-lg hover:shadow-xl hover:shadow-[#F6C84C]/20 transition-shadow cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              Shop Our Spices
            </motion.span>
          </Link>

          <Link href="/contact-us">
            <motion.span
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-bold text-sm tracking-widest uppercase rounded-full hover:border-[#F6C84C]/60 hover:text-[#F6C84C] transition-all cursor-pointer"
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
