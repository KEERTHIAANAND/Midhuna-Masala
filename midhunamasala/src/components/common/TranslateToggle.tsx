'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TranslateToggleProps {
  isEnglish: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md';
  className?: string;
  /** Light mode for dark backgrounds */
  light?: boolean;
}

/**
 * A small translate icon button that toggles between Tamil and English.
 * Shows "EN" when content is in Tamil (click to translate to English),
 * and "த" when content is in English (click to revert to Tamil).
 */
export default function TranslateToggle({
  isEnglish,
  onToggle,
  size = 'sm',
  className = '',
  light = false,
}: TranslateToggleProps) {
  const sizeClasses = size === 'sm' ? 'w-6 h-6 text-[9px]' : 'w-7 h-7 text-[10px]';

  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      title={isEnglish ? 'Switch to Tamil' : 'Translate to English'}
      className={`inline-flex items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-300 font-bold tracking-wider cursor-pointer select-none ${sizeClasses} ${
        light
          ? isEnglish
            ? 'bg-[#F6C84C]/20 border-[#F6C84C]/40 text-[#F6C84C] hover:bg-[#F6C84C]/30'
            : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:text-white'
          : isEnglish
            ? 'bg-[#8B1E1E]/10 border-[#8B1E1E]/25 text-[#8B1E1E] hover:bg-[#8B1E1E]/20'
            : 'bg-[#8B1E1E]/5 border-[#8B1E1E]/15 text-[#8B1E1E]/60 hover:bg-[#8B1E1E]/10 hover:text-[#8B1E1E]'
      } ${className}`}
    >
      {/* Small translate icon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'}
      >
        <path d="m5 8 6 6" />
        <path d="m4 14 6-6 2-3" />
        <path d="M2 5h12" />
        <path d="M7 2h1" />
        <path d="m22 22-5-10-5 10" />
        <path d="M14 18h6" />
      </svg>
    </motion.button>
  );
}
