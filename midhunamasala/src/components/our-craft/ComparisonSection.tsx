'use client';

import { motion } from 'framer-motion';
import { COMPARISON_DATA } from './craftData';

export default function ComparisonSection() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-[#1a0a0a]">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(246,200,76,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(246,200,76,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 sm:mb-20"
        >
          <p className="text-[#F6C84C] text-xs sm:text-sm font-bold tracking-[0.3em] uppercase mb-3">
            The Difference Is Clear
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white">
            Stone Ground{' '}
            <span className="text-white/30">vs</span>{' '}
            Machine Ground
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/40 max-w-xl mx-auto">
            See how traditional stone grinding outperforms modern machines across
            every metric that matters for your food.
          </p>
        </motion.div>

        {/* Comparison Bars */}
        <div className="space-y-8 sm:space-y-10">
          {COMPARISON_DATA.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-sm sm:text-base font-bold text-white/90 tracking-wide">
                  {item.label}
                </span>
              </div>

              {/* Stone Ground Bar */}
              <div className="flex items-center gap-3 sm:gap-4 mb-2">
                <span className="text-[10px] sm:text-xs font-bold text-[#F6C84C] tracking-wider w-20 sm:w-24 text-right uppercase">
                  Stone
                </span>
                <div className="flex-1 h-6 sm:h-7 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.stone}%` }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.1 + 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-[#F6C84C] to-[#E5B73B] flex items-center justify-end pr-3"
                  >
                    <span className="text-[10px] sm:text-xs font-bold text-[#1a0a0a]">
                      {item.stone}%
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Machine Ground Bar */}
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-[10px] sm:text-xs font-bold text-white/30 tracking-wider w-20 sm:w-24 text-right uppercase">
                  Machine
                </span>
                <div className="flex-1 h-6 sm:h-7 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.machine}%` }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.1 + 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-white/20 to-white/10 flex items-center justify-end pr-3"
                  >
                    <span className="text-[10px] sm:text-xs font-bold text-white/50">
                      {item.machine}%
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.7 }}
          className="text-center text-xs text-white/25 mt-12 sm:mt-16"
        >
          * Based on comparative studies of traditional vs industrial grinding methods
        </motion.p>
      </div>
    </section>
  );
}
