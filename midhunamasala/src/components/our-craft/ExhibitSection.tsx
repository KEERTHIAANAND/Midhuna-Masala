'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { CraftTool } from './craftData';

interface Props {
  tool: CraftTool;
  index: number;
}

const BG_TONES = [
  'radial-gradient(ellipse at 50% 40%, rgba(139,30,30,0.15) 0%, rgba(10,6,6,1) 70%)',
  'radial-gradient(ellipse at 50% 40%, rgba(92,64,51,0.15) 0%, rgba(10,6,6,1) 70%)',
  'radial-gradient(ellipse at 50% 40%, rgba(107,91,62,0.12) 0%, rgba(10,6,6,1) 70%)',
];

export default function ExhibitSection({ tool, index }: Props) {
  const leftBenefits = tool.benefits.slice(0, 3);
  const rightBenefits = tool.benefits.slice(3, 6);

  return (
    <section
      id={tool.id}
      className="relative min-h-screen flex flex-col items-center justify-center py-20 sm:py-24 px-4 sm:px-6 overflow-hidden scroll-mt-16"
      style={{ background: BG_TONES[index] || BG_TONES[0] }}
    >
      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#F6C84C 0.4px, transparent 0.4px)',
          backgroundSize: '18px 18px',
        }}
      />

      {/* ── TOOL NAME ── */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8 sm:mb-10 relative z-10"
      >
        <p className="text-[10px] sm:text-xs font-bold tracking-[0.4em] uppercase text-[#F6C84C]/50 mb-2">
          {tool.subtitle}
        </p>
        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-serif text-white/95 tracking-tight">
          {tool.name}
        </h2>
        <p className="text-lg sm:text-xl text-[#F6C84C]/40 mt-1 font-serif">{tool.tamilName}</p>
      </motion.div>

      {/* ── SPOTLIGHT + IMAGE ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-10 sm:mb-14"
      >
        {/* Outer glow ring */}
        <div className="absolute inset-[-60%] rounded-full animate-glow-pulse pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${tool.color}20 0%, ${tool.color}08 40%, transparent 65%)`,
          }}
        />
        {/* Inner spotlight */}
        <div className="absolute inset-[-30%] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, #F6C84C10 0%, transparent 60%)`,
          }}
        />

        <div className="animate-levitate">
          <Image
            src={tool.image}
            alt={tool.name}
            width={380}
            height={380}
            className="relative w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[340px] md:h-[340px] object-contain drop-shadow-[0_20px_60px_rgba(246,200,76,0.08)]"
            style={{ mixBlendMode: 'multiply', filter: 'brightness(1.1) contrast(1.05)' }}
            priority={index === 0}
          />
        </div>

        {/* Ground reflection */}
        <div className="absolute bottom-[-12px] left-1/2 -translate-x-1/2 w-[50%] h-3 rounded-full blur-xl bg-[#F6C84C]/8" />
      </motion.div>

      {/* ── DESCRIPTION ── */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-center text-sm sm:text-base text-white/30 max-w-xl leading-relaxed mb-12 sm:mb-16 relative z-10"
      >
        {tool.description}
      </motion.p>

      {/* ── BENEFITS GRID ── */}
      <div className="relative z-10 w-full max-w-5xl">
        {/* Thin golden separator */}
        <div className="w-16 h-px bg-[#F6C84C]/30 mx-auto mb-10 sm:mb-12" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8 lg:gap-y-10">
          {/* Left benefits on desktop, all in grid on mobile */}
          {[...leftBenefits, ...rightBenefits].map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group"
            >
              <div className="flex items-start gap-3">
                {/* Golden dot accent */}
                <div className="mt-1.5 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#F6C84C]/60 group-hover:bg-[#F6C84C] group-hover:shadow-[0_0_8px_rgba(246,200,76,0.4)] transition-all duration-300" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white/80 group-hover:text-[#F6C84C]/90 transition-colors duration-300 mb-1.5">
                    {benefit.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-white/25 leading-relaxed group-hover:text-white/40 transition-colors duration-300">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── FUN FACT ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-14 sm:mt-16 relative z-10"
      >
        <p className="text-center text-xs sm:text-sm text-[#F6C84C]/25 italic max-w-md mx-auto leading-relaxed">
          &ldquo;{tool.funFact}&rdquo;
        </p>
      </motion.div>
    </section>
  );
}
