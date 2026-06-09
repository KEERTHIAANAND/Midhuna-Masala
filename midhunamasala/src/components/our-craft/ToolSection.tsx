'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Lightbulb } from 'lucide-react';
import { CraftTool } from './craftData';

interface Props {
  tool: CraftTool;
  index: number;
}

export default function ToolSection({ tool, index }: Props) {
  const [activeBenefit, setActiveBenefit] = useState(0);
  const isReversed = index % 2 !== 0;

  return (
    <section
      id={tool.id}
      className="relative py-16 sm:py-24 overflow-hidden scroll-mt-20"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF5] via-white to-[#FFFDF5]" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${tool.color} 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p
            className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase mb-2"
            style={{ color: tool.color }}
          >
            {tool.subtitle}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#1a0a0a]">
            {tool.name}{' '}
            <span className="text-[#F6C84C]/80 text-xl sm:text-2xl md:text-3xl">
              {tool.tamilName}
            </span>
          </h2>
        </motion.div>

        {/* Main Content Grid */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start ${
            isReversed ? 'lg:direction-rtl' : ''
          }`}
        >
          {/* Image + Description Column */}
          <motion.div
            initial={{ opacity: 0, x: isReversed ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className={`${isReversed ? 'lg:order-2' : 'lg:order-1'}`}
            style={{ direction: 'ltr' }}
          >
            {/* Image Card */}
            <div className="relative group">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={tool.image}
                  alt={`${tool.name} — ${tool.subtitle}`}
                  width={640}
                  height={480}
                  className="w-full h-[280px] sm:h-[360px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Fun fact overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <div className="flex items-start gap-3 bg-black/30 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/10">
                    <Lightbulb className="w-5 h-5 text-[#F6C84C] flex-shrink-0 mt-0.5" />
                    <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                      {tool.funFact}
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative border glow */}
              <div
                className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
                style={{ background: `${tool.color}33` }}
              />
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mt-6 text-sm sm:text-base text-[#1a0a0a]/70 leading-relaxed"
            >
              {tool.description}
            </motion.p>
          </motion.div>

          {/* Interactive Benefits Column */}
          <motion.div
            initial={{ opacity: 0, x: isReversed ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`${isReversed ? 'lg:order-1' : 'lg:order-2'}`}
            style={{ direction: 'ltr' }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-[#1a0a0a] mb-6 flex items-center gap-2">
              <span
                className="w-8 h-0.5 rounded-full"
                style={{ backgroundColor: tool.color }}
              />
              Key Benefits
            </h3>

            {/* Benefit Selector Tabs */}
            <div className="space-y-2">
              {tool.benefits.map((benefit, i) => (
                <motion.button
                  key={i}
                  onClick={() => setActiveBenefit(i)}
                  className={`w-full text-left rounded-xl transition-all duration-300 ${
                    activeBenefit === i
                      ? 'bg-white shadow-lg shadow-black/5 border border-black/5'
                      : 'bg-transparent hover:bg-white/60 border border-transparent'
                  }`}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-3 sm:gap-4 px-4 py-3 sm:px-5 sm:py-4">
                    {/* Icon */}
                    <span className="text-xl sm:text-2xl flex-shrink-0">
                      {benefit.icon}
                    </span>

                    {/* Title */}
                    <span
                      className={`font-bold text-sm sm:text-base flex-1 transition-colors ${
                        activeBenefit === i
                          ? 'text-[#1a0a0a]'
                          : 'text-[#1a0a0a]/60'
                      }`}
                    >
                      {benefit.title}
                    </span>

                    {/* Arrow */}
                    <ChevronRight
                      className={`w-4 h-4 transition-all duration-300 flex-shrink-0 ${
                        activeBenefit === i
                          ? 'rotate-90 text-[#F6C84C]'
                          : 'text-[#1a0a0a]/20'
                      }`}
                    />
                  </div>

                  {/* Expandable content */}
                  <AnimatePresence>
                    {activeBenefit === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pl-[52px] sm:pl-[64px]">
                          <div
                            className="w-10 h-0.5 rounded-full mb-3"
                            style={{ backgroundColor: tool.color, opacity: 0.4 }}
                          />
                          <p className="text-xs sm:text-sm text-[#1a0a0a]/60 leading-relaxed">
                            {benefit.description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
