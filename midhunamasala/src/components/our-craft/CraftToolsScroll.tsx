'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CRAFT_TOOLS } from './craftData';

// Premium warm editorial color palettes matching Midhuna's brand and tools
const TOOL_THEMES: Record<string, { bg: string; panelBg: string; textAccent: string }> = {
  ammikall: {
    bg: 'bg-[#FFFDF8]',         // Warm Silk/Ivory
    panelBg: 'bg-[#F4EFEA]',    // Soft Warm Clay / Sand
    textAccent: 'text-[#8B1E1E]' // Deep Crimson
  },
  aatukal: {
    bg: 'bg-[#FFFDF8]',
    panelBg: 'bg-[#EAE3DB]',    // Soft Limestone Gray
    textAccent: 'text-[#8B1E1E]'
  },
  chakki: {
    bg: 'bg-[#FFFDF8]',
    panelBg: 'bg-[#E2ECE5]',    // Soft Sage Green / Oatmeal
    textAccent: 'text-[#8B1E1E]'
  }
};

interface FloatingSpice {
  icon: string;
  size: string;
  top: string;
  left?: string;
  right?: string;
  yStart: number;
  yEnd: number;
  rotateStart: number;
  rotateEnd: number;
  duration: number;
}

// Define floating spice coordinates for each grinder
const FLOATING_SPICES: Record<string, FloatingSpice[]> = {
  ammikall: [
    { icon: '🌶️', size: 'text-5xl', top: 'top-[12%]', left: 'left-[5%]', yStart: 0, yEnd: -20, rotateStart: -15, rotateEnd: 20, duration: 4.8 },
    { icon: '🧄', size: 'text-4xl', top: 'top-[22%]', right: 'right-[8%]', yStart: 0, yEnd: 15, rotateStart: 10, rotateEnd: -15, duration: 5.2 },
    { icon: '🌿', size: 'text-3xl', top: 'bottom-[25%]', left: 'left-[6%]', yStart: 0, yEnd: -12, rotateStart: -8, rotateEnd: 12, duration: 4.0 },
    { icon: '🥥', size: 'text-5xl', top: 'bottom-[15%]', right: 'right-[5%]', yStart: 0, yEnd: 18, rotateStart: -20, rotateEnd: 10, duration: 6.2 },
    { icon: '🧅', size: 'text-3xl', top: 'top-[48%]', left: 'left-[10%]', yStart: 0, yEnd: -10, rotateStart: 15, rotateEnd: -10, duration: 4.5 }
  ],
  aatukal: [
    { icon: '🪵', size: 'text-4xl', top: 'top-[10%]', left: 'left-[6%]', yStart: 0, yEnd: -22, rotateStart: -20, rotateEnd: 15, duration: 5.5 },
    { icon: '🫚', size: 'text-5xl', top: 'top-[28%]', right: 'right-[10%]', yStart: 0, yEnd: 12, rotateStart: 15, rotateEnd: -25, duration: 5.0 },
    { icon: '🌶️', size: 'text-4xl', top: 'bottom-[28%]', left: 'left-[8%]', yStart: 0, yEnd: -15, rotateStart: -8, rotateEnd: 20, duration: 4.2 },
    { icon: '✨', size: 'text-3xl', top: 'bottom-[10%]', right: 'right-[8%]', yStart: 0, yEnd: 16, rotateStart: -12, rotateEnd: 12, duration: 5.8 }
  ],
  chakki: [
    { icon: '🌾', size: 'text-5xl', top: 'top-[8%]', left: 'left-[5%]', yStart: 0, yEnd: -18, rotateStart: -5, rotateEnd: 25, duration: 4.9 },
    { icon: '🌱', size: 'text-3xl', top: 'top-[26%]', right: 'right-[8%]', yStart: 0, yEnd: 14, rotateStart: 20, rotateEnd: -20, duration: 4.1 },
    { icon: '🌾', size: 'text-4xl', top: 'bottom-[20%]', left: 'left-[10%]', yStart: 0, yEnd: -12, rotateStart: -12, rotateEnd: 12, duration: 5.3 },
    { icon: '🍂', size: 'text-4xl', top: 'bottom-[12%]', right: 'right-[10%]', yStart: 0, yEnd: 18, rotateStart: -25, rotateEnd: 10, duration: 6.0 }
  ]
};

const floatingVariants = {
  animate: (custom: FloatingSpice) => ({
    y: [custom.yStart, custom.yEnd, custom.yStart],
    rotate: [custom.rotateStart, custom.rotateEnd, custom.rotateStart],
    transition: {
      duration: custom.duration,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  })
};

export default function CraftToolsScroll() {
  return (
    <div className="relative z-10 w-full flex flex-col">
      {CRAFT_TOOLS.map((tool, index) => (
        <FarmMineralsSection key={tool.id} tool={tool} index={index} />
      ))}
    </div>
  );
}

function FarmMineralsSection({ tool, index }: { tool: any; index: number }) {
  const theme = TOOL_THEMES[tool.id] || TOOL_THEMES.ammikall;
  const isEven = index % 2 === 0;

  return (
    <section className={`relative w-full flex flex-col lg:flex-row ${theme.bg} border-b border-[#8B1E1E]/5 last:border-0`}>
      
      {/* 1. Sticky Image Panel (Alternating sides on desktop) */}
      <div className={`w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0 flex items-center justify-center p-8 sm:p-16 lg:p-24 overflow-hidden ${theme.panelBg} ${
        isEven ? 'lg:order-first' : 'lg:order-last'
      }`}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[60vh] lg:h-full max-w-[500px] flex items-center justify-center"
        >
          {/* Subtle warm glow behind the stone grinder */}
          <div className="absolute inset-0 bg-radial-gradient from-[#8B1E1E]/5 to-transparent opacity-40 pointer-events-none" />
          <Image
            src={tool.image}
            alt={tool.name}
            fill
            className="object-contain drop-shadow-[0_20px_45px_rgba(139,30,30,0.08)] transform transition-transform duration-700 hover:scale-105 z-10"
            style={{ mixBlendMode: 'multiply', filter: 'brightness(1.02) contrast(1.02)' }}
            priority={index === 0}
          />

          {/* Floating Spice/Fruit-style Decorations */}
          {FLOATING_SPICES[tool.id]?.map((spice, idx) => (
            <motion.div
              key={idx}
              custom={spice}
              variants={floatingVariants}
              animate="animate"
              whileHover={{ scale: 1.25, rotate: spice.rotateEnd * 1.5 }}
              className={`absolute ${spice.size} pointer-events-auto cursor-pointer select-none opacity-85 hover:opacity-100 transition-all duration-300 z-20 ${spice.top} ${spice.left || ''} ${spice.right || ''}`}
              style={{
                filter: 'drop-shadow(0 10px 15px rgba(139,30,30,0.12))',
              }}
            >
              {spice.icon}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 2. Scrolling Content Panel */}
      <div className="w-full lg:w-1/2 py-20 px-6 sm:px-16 lg:px-24 flex flex-col justify-center bg-[#FFFDF8]">
        
        {/* Sleek Minimal Meta Tag */}
        <div className="mb-6 flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-[#1A0A0A]/40">
          <span>[ 0{index + 1} / 0{CRAFT_TOOLS.length} ]</span>
          <span className="w-8 h-[1px] bg-[#1A0A0A]/20" />
          <span className={`${theme.textAccent} uppercase`}>{tool.id}</span>
        </div>

        {/* Dynamic High-Contrast Editorial Title */}
        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-serif tracking-tight text-[#1A0A0A] mb-3">
          {tool.tamilName}
        </h2>
        <p className="text-lg font-mono tracking-widest text-[#8B1E1E] uppercase mb-8">
          {tool.name} / {tool.subtitle}
        </p>

        {/* Clean, spacious introduction */}
        <p className="text-base sm:text-lg text-[#1A0A0A]/70 font-light leading-relaxed tracking-wide mb-16 max-w-xl">
          {tool.tamilDescription}
        </p>

        {/* Staggered Benefits List */}
        <div className="flex flex-col gap-14 max-w-xl">
          {tool.benefits.map((benefit: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3 group"
            >
              {/* Header */}
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-[#8B1E1E] tracking-widest">[ 0{i + 1} ]</span>
                <span className="text-xl transition-transform duration-300 group-hover:scale-110">{benefit.icon}</span>
                <h4 className="text-lg sm:text-xl font-bold text-[#1A0A0A] group-hover:text-[#8B1E1E] transition-colors duration-300">
                  {benefit.tamilTitle}
                </h4>
                <span className="text-xs font-sans text-[#1A0A0A]/35 font-normal tracking-wide">
                  / {benefit.title}
                </span>
              </div>
              
              {/* Description */}
              <p className="text-sm sm:text-base text-[#1A0A0A]/60 font-light leading-relaxed pl-7 border-l border-[#8B1E1E]/10 group-hover:border-[#8B1E1E]/30 transition-colors duration-300">
                {benefit.tamilDescription}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Minimal Fun Fact Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 pt-8 border-t border-[#8B1E1E]/10 flex flex-col gap-2"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#8B1E1E] font-bold">
            Heritage Fact
          </span>
          <p className="text-sm text-[#1A0A0A]/55 leading-relaxed font-light italic">
            "{tool.tamilFunFact}"
          </p>
        </motion.div>

      </div>
    </section>
  );
}
