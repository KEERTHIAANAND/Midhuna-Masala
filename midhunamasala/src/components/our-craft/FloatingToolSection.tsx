'use client';

import { useCallback, useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CraftTool } from './craftData';

interface Props {
  tool: CraftTool;
  index: number;
}

const SWAY_CLASSES = ['animate-sway-1', 'animate-sway-2', 'animate-sway-3'];

export default function FloatingToolSection({ tool, index }: Props) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x: y * -12, y: x * 12 });
  }, []);

  const handleMouseEnter = useCallback(() => setHovering(true), []);
  const handleMouseLeave = useCallback(() => {
    setHovering(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <section id={tool.id} className="relative py-20 sm:py-28 scroll-mt-20 overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${tool.color} 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 sm:mb-20"
        >
          <p className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase mb-2" style={{ color: tool.color }}>
            {tool.subtitle}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#1a0a0a]">
            {tool.name}{' '}
            <span className="text-[#F6C84C]/70 text-xl sm:text-2xl md:text-3xl">{tool.tamilName}</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#1a0a0a]/50 max-w-xl mx-auto leading-relaxed">
            {tool.description}
          </p>
        </motion.div>

        {/* 3D Floating Image */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-16 sm:mb-20"
        >
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative cursor-pointer"
            style={{
              perspective: '1200px',
              WebkitPerspective: '1200px',
            }}
          >
            {/* Golden glow halo behind image */}
            <div
              className={`absolute inset-0 rounded-full blur-3xl transition-all duration-700 ${
                hovering ? 'opacity-50 scale-110' : 'opacity-20 scale-95'
              }`}
              style={{
                background: `radial-gradient(circle, ${tool.color}44 0%, #F6C84C22 50%, transparent 70%)`,
              }}
            />

            {/* Pulsing glow ring */}
            <div className="absolute inset-[-20%] animate-glow-pulse rounded-full"
              style={{
                background: `radial-gradient(circle, transparent 40%, ${tool.color}15 60%, transparent 70%)`,
              }}
            />

            {/* The image with 3D tilt + levitation */}
            <div
              className={`relative ${hovering ? '' : 'animate-levitate'}`}
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovering ? 1.08 : 1})`,
                transition: hovering ? 'transform 0.1s ease-out' : 'transform 0.6s ease-out',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Glossy light reflection overlay */}
              <div
                className="absolute inset-0 z-10 rounded-2xl pointer-events-none opacity-0 transition-opacity duration-300"
                style={{
                  opacity: hovering ? 0.15 : 0,
                  background: `radial-gradient(circle at ${50 + tilt.y * 2}% ${50 + tilt.x * 2}%, white 0%, transparent 60%)`,
                }}
              />

              <Image
                src={tool.image}
                alt={`${tool.name} — ${tool.subtitle}`}
                width={400}
                height={400}
                className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] md:w-[380px] md:h-[380px] object-contain drop-shadow-2xl"
                style={{ mixBlendMode: 'multiply' }}
                priority={index === 0}
              />
            </div>

            {/* Shadow on ground */}
            <div
              className={`absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-[60%] h-[20px] rounded-full blur-xl transition-all duration-500 ${
                hovering ? 'opacity-30 scale-x-110' : 'opacity-15 scale-x-100'
              }`}
              style={{ backgroundColor: tool.color }}
            />
          </div>
        </motion.div>

        {/* Fun fact banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto mb-14 sm:mb-20"
        >
          <div className="flex items-start gap-3 bg-[#F6C84C]/8 border border-[#F6C84C]/20 rounded-xl px-5 py-4">
            <span className="text-xl flex-shrink-0">💡</span>
            <p className="text-sm text-[#1a0a0a]/60 leading-relaxed italic">{tool.funFact}</p>
          </div>
        </motion.div>

        {/* Hanging Benefits Display */}
        <div className="relative">
          {/* Decorative horizontal rod */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="h-[3px] rounded-full mx-auto max-w-4xl mb-0 origin-center"
            style={{ background: `linear-gradient(90deg, transparent, ${tool.color}40, ${tool.color}, ${tool.color}40, transparent)` }}
          />

          {/* Hanging cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0 max-w-4xl mx-auto">
            {tool.benefits.map((benefit, i) => {
              const swayClass = SWAY_CLASSES[i % 3];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="flex flex-col items-center"
                >
                  {/* Thread */}
                  <div className="w-px h-10 sm:h-14" style={{ backgroundColor: `${tool.color}30` }} />

                  {/* Pin/clip */}
                  <div className="w-3 h-3 rounded-full border-2 -mt-px mb-0 flex-shrink-0" style={{ borderColor: tool.color, backgroundColor: `${tool.color}20` }} />

                  {/* Hanging card */}
                  <div
                    className={`${swayClass} group relative bg-white rounded-xl border border-black/5 shadow-md hover:shadow-xl p-5 sm:p-6 transition-shadow duration-300 cursor-default w-full`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    {/* Top accent line */}
                    <div className="w-8 h-[2px] rounded-full mb-4 transition-all duration-300 group-hover:w-12" style={{ backgroundColor: tool.color }} />

                    <span className="text-2xl mb-3 block">{benefit.icon}</span>
                    <h4 className="font-bold text-sm sm:text-base text-[#1a0a0a] mb-2">{benefit.title}</h4>
                    <p className="text-xs sm:text-sm text-[#1a0a0a]/50 leading-relaxed">{benefit.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
