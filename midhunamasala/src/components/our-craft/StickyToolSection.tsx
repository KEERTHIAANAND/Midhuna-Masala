'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { CraftTool } from './craftData';

interface Props {
  tool: CraftTool;
  index: number;
}

export default function StickyToolSection({ tool, index }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isReversed = index % 2 !== 0;

  return (
    <section
      id={tool.id}
      ref={sectionRef}
      className="relative scroll-mt-20"
    >
      {/* ===== MOBILE LAYOUT (stacked) ===== */}
      <div className="lg:hidden px-4 sm:px-6 py-16 sm:py-20">
        {/* Mobile Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase mb-1.5" style={{ color: tool.color }}>
            {tool.subtitle}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#1a0a0a]">
            {tool.name}
            <span className="block text-lg sm:text-xl text-[#F6C84C]/70 mt-1">{tool.tamilName}</span>
          </h2>
        </motion.div>

        {/* Mobile Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative flex justify-center mb-10"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-3xl opacity-20" style={{ background: `radial-gradient(circle, ${tool.color}, transparent 70%)` }} />
            <Image
              src={tool.image}
              alt={tool.name}
              width={280}
              height={280}
              className="relative w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] object-contain drop-shadow-xl"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>
        </motion.div>

        {/* Mobile Description */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm text-[#1a0a0a]/50 leading-relaxed text-center max-w-md mx-auto mb-10"
        >
          {tool.description}
        </motion.p>

        {/* Mobile Benefit Cards */}
        <div className="space-y-4 max-w-md mx-auto">
          {tool.benefits.map((benefit, i) => (
            <MobileBenefitCard key={i} benefit={benefit} index={i} color={tool.color} />
          ))}
        </div>

        {/* Mobile Fun Fact */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 max-w-md mx-auto bg-[#F6C84C]/8 border border-[#F6C84C]/20 rounded-xl px-5 py-4"
        >
          <div className="flex items-start gap-3">
            <span className="text-lg">💡</span>
            <p className="text-xs text-[#1a0a0a]/50 leading-relaxed italic">{tool.funFact}</p>
          </div>
        </motion.div>
      </div>

      {/* ===== DESKTOP LAYOUT (sticky image + scrolling benefits) ===== */}
      <div className="hidden lg:block">
        <div className={`flex ${isReversed ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Sticky Image Column */}
          <div className="w-[42%] relative">
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
              {/* Background gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${tool.color}08 0%, ${tool.color}03 50%, transparent 100%)`,
                }}
              />

              {/* Dot pattern */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(${tool.color} 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }}
              />

              <div className="relative px-12">
                {/* Glow behind image */}
                <div
                  className="absolute inset-[-30%] rounded-full blur-[80px] opacity-20 animate-glow-pulse"
                  style={{ background: `radial-gradient(circle, ${tool.color}60, #F6C84C30, transparent 70%)` }}
                />

                {/* Tool label */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-6 relative z-10"
                >
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-1" style={{ color: tool.color }}>
                    {tool.subtitle}
                  </p>
                  <h2 className="text-4xl xl:text-5xl font-bold font-serif text-[#1a0a0a]">
                    {tool.name}
                  </h2>
                  <p className="text-xl text-[#F6C84C]/60 mt-1">{tool.tamilName}</p>
                </motion.div>

                {/* Product image with levitation */}
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="relative animate-levitate"
                >
                  <Image
                    src={tool.image}
                    alt={tool.name}
                    width={420}
                    height={420}
                    className="relative w-full max-w-[360px] xl:max-w-[400px] mx-auto object-contain drop-shadow-2xl"
                    style={{ mixBlendMode: 'multiply' }}
                    priority={index === 0}
                  />
                </motion.div>

                {/* Ground shadow */}
                <div
                  className="mx-auto w-[55%] h-[14px] rounded-full blur-xl opacity-15 mt-2"
                  style={{ backgroundColor: tool.color }}
                />

                {/* Fun fact */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 bg-[#F6C84C]/6 border border-[#F6C84C]/15 rounded-lg px-4 py-3 relative z-10"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-sm flex-shrink-0">💡</span>
                    <p className="text-[11px] text-[#1a0a0a]/45 leading-relaxed italic">{tool.funFact}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Scrolling Benefits Column */}
          <div className="w-[58%] py-28 xl:py-36">
            <div className={`max-w-xl ${isReversed ? 'mr-auto pl-8 xl:pl-12 pr-12 xl:pr-20' : 'ml-auto pr-8 xl:pr-12 pl-12 xl:pl-20'}`}>
              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-sm xl:text-base text-[#1a0a0a]/50 leading-relaxed mb-12 xl:mb-16"
              >
                {tool.description}
              </motion.p>

              {/* Benefit cards */}
              <div className="space-y-6 xl:space-y-8">
                {tool.benefits.map((benefit, i) => (
                  <BenefitCard key={i} benefit={benefit} index={i} color={tool.color} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- Benefit Card (Desktop) ---- */
function BenefitCard({
  benefit,
  index,
  color,
}: {
  benefit: { icon: string; title: string; description: string };
  index: number;
  color: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 40, y: 10 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white rounded-xl border border-black/[0.04] shadow-sm hover:shadow-lg p-6 xl:p-7 transition-all duration-400 cursor-default"
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full transition-all duration-300 group-hover:top-3 group-hover:bottom-3"
        style={{ backgroundColor: color, opacity: 0.5 }}
      />

      <div className="flex items-start gap-4 pl-3">
        {/* Number */}
        <span
          className="text-3xl xl:text-4xl font-black font-serif leading-none flex-shrink-0 select-none"
          style={{ color: `${color}18` }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{benefit.icon}</span>
            <h4 className="font-bold text-sm xl:text-base text-[#1a0a0a]">{benefit.title}</h4>
          </div>
          <p className="text-xs xl:text-sm text-[#1a0a0a]/45 leading-relaxed">{benefit.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ---- Benefit Card (Mobile) ---- */
function MobileBenefitCard({
  benefit,
  index,
  color,
}: {
  benefit: { icon: string; title: string; description: string };
  index: number;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative bg-white rounded-xl border border-black/[0.04] shadow-sm p-5"
    >
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
        style={{ backgroundColor: color, opacity: 0.4 }}
      />
      <div className="flex items-start gap-3 pl-2.5">
        <span
          className="text-2xl font-black font-serif leading-none flex-shrink-0 select-none"
          style={{ color: `${color}15` }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">{benefit.icon}</span>
            <h4 className="font-bold text-sm text-[#1a0a0a]">{benefit.title}</h4>
          </div>
          <p className="text-xs text-[#1a0a0a]/45 leading-relaxed">{benefit.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
