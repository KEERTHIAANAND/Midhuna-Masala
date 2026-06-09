'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useMemo } from 'react';

function DustParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 6,
        duration: Math.random() * 4 + 3,
        opacity: Math.random() * 0.5 + 0.2,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#F6C84C]"
          style={{
            left: p.left,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            opacity: 0,
          }}
          animate={{
            y: [0, -300 - Math.random() * 400],
            opacity: [0, p.opacity, 0],
            x: [0, (Math.random() - 0.5) * 80],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

export default function CraftHero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#1a0a0a]">
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#F6C84C 0.5px, transparent 0.5px)',
          backgroundSize: '20px 20px',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,30,30,0.35)_0%,_transparent_70%)]" />

      <DustParticles />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[#F6C84C] font-serif text-sm sm:text-base tracking-[0.35em] uppercase mb-4"
        >
          The Ancient Craft
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold text-white font-serif leading-tight"
        >
          Stone Ground.{' '}
          <span className="text-[#F6C84C]">Soul Preserved.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-6 text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed"
        >
          For thousands of years, the Ammikall, Aatukal, and Chakki have been
          the heartbeat of Indian kitchens. Discover why these timeless tools
          create flavours that no machine can replicate.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-10"
        >
          {[
            { name: 'Ammikall', tamil: 'அம்மிக்கல்' },
            { name: 'Aatukal', tamil: 'ஆட்டுக்கல்' },
            { name: 'Chakki', tamil: 'சக்கி' },
          ].map((tool) => (
            <motion.a
              key={tool.name}
              href={`#${tool.name.toLowerCase()}`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group px-5 py-3 sm:px-7 sm:py-3.5 rounded-full border border-[#F6C84C]/30 bg-[#F6C84C]/5 backdrop-blur-sm hover:bg-[#F6C84C]/15 hover:border-[#F6C84C]/60 transition-colors cursor-pointer"
            >
              <span className="text-white font-bold text-sm sm:text-base tracking-wide group-hover:text-[#F6C84C] transition-colors">
                {tool.name}
              </span>
              <span className="ml-2 text-[#F6C84C]/60 text-xs sm:text-sm">
                {tool.tamil}
              </span>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-6 h-6 text-[#F6C84C]/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
