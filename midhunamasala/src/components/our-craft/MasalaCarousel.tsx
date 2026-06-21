'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import TranslateToggle from '@/components/common/TranslateToggle';

/* ─────────────────────────────────────────────
   Data for each masala / powder
   ───────────────────────────────────────────── */
const TOOLS = [
  {
    id: 'ammikall',
    name: 'Ammikall',
    tamilName: 'அம்மிக்கல்',
    tag: 'Hand-Rolled',
    rating: '4.9',
    englishName: 'Ammikall (Flat Stone Grinder)',
    description: (
      <>
        அம்மிக்கல் என்பது பாரம்பரியமாக சமையலில் மசாலா, சட்னி மற்றும் மூலிகைகளை அரைக்கப் பயன்படும் ஒரு <strong className="font-semibold text-[#1A0A0A]">தட்டையான கருங்கல்</strong> ஆகும். இதன் மீது பொருட்களை வைத்து அரைக்க உருளை வடிவக் குழவிக்கல் பயன்படுகிறது. இயந்திரங்களின் வரவுக்குப் பிறகும் பல வீடுகளில் இது இன்றளவும் பயன்படுத்தப்படுவதற்கு முக்கியக் காரணம், இதில் குறைந்த வெப்பநிலையில் பொருட்கள் அரைக்கப்படுவதால் <strong className="font-semibold text-[#1A0A0A]">அவற்றின் ஊட்டச்சத்துக்கள் அழியாமல் பாதுகாக்கப்படுவதோடு</strong>, மசாலாப் பொருட்களின் <strong className="font-semibold text-[#1A0A0A]">இயற்கை சுவை மற்றும் நிறம் சற்றும் மாறாமல் முழுமையான ஆரோக்கியத்துடன்</strong> கிடைப்பதுதான்.
      </>
    ),
    englishDescription: 'The Ammikall is a flat granite slab used traditionally to grind masala, chutney, and herbs. A cylindrical rolling stone is used on top of it. The key reason it is still used in many homes is that grinding at low temperatures preserves the nutrients, natural flavour, and colour of the spices completely.',
    image: '/images/benefits/ammikall.png',
    accentColor: '#C4A265',
    bgGradient: 'from-[#F5EFE0] to-[#FFFDF8]',
  },
  {
    id: 'aatukal',
    name: 'Aatukal',
    tamilName: 'ஆட்டுக்கல்',
    tag: 'Mortar & Pestle',
    rating: '4.9',
    englishName: 'Aatukal (Stone Mortar)',
    description: (
      <>
        ஆட்டுக்கல் என்பது சமையலில் மசாலாப் பொருட்கள் மற்றும் மாவுகளை பாரம்பரிய முறையில் அரைக்கப் பயன்படும் <strong className="font-semibold text-[#1A0A0A]">கருங்கல்லால் செய்யப்பட்ட</strong> ஒரு சமையலறை சாதனமாகும். தேங்காய், மிளகாய், மசாலா மற்றும் இட்லி, தோசைக்கான மாவு அரைக்கப் பயன்படுகிறது. நடுவில் குழி உள்ள உரல் போன்ற பகுதி (ஆட்டுக்கல்) மற்றும் கையால் பிடித்து அரைக்க உருண்டையான கல் (குழவி) ஆகிய இரு பகுதிகளைக் கொண்டது. <strong className="font-semibold text-[#1A0A0A]">மின்சாரம் தேவையில்லை</strong>. இதில் அரைக்கும் போது பொருட்களின் <strong className="font-semibold text-[#1A0A0A]">சுவை மற்றும் மணம் மாறாமல்</strong> இருக்கும்.
      </>
    ),
    englishDescription: 'The Aatukal is a granite kitchen tool used to grind spices and batters traditionally. It is used for grinding coconut, chilli, masala, and batter for idli and dosa. It consists of a bowl-shaped mortar and a round stone pestle. No electricity needed. The flavour and aroma of ingredients remain unchanged when ground in it.',
    image: '/images/benefits/Aatukal.png',
    accentColor: '#C46B28',
    bgGradient: 'from-[#F0E4D4] to-[#FFFDF8]',
  },
  {
    id: 'chakki',
    name: 'Chakki',
    tamilName: 'சக்கி',
    tag: 'Rotary Stone',
    rating: '5.0',
    englishName: 'Chakki (Rotary Stone Mill)',
    description: (
      <>
        இந்தியில் 'சக்கி' (Chakki) என்று அழைக்கப்படுவது தமிழில் <strong className="font-semibold text-[#1A0A0A]">'திருகல்'</strong>, <strong className="font-semibold text-[#1A0A0A]">'அரைக்கும் கல்'</strong>, <strong className="font-semibold text-[#1A0A0A]">'திரிகை'</strong> அல்லது <strong className="font-semibold text-[#1A0A0A]">'திருவை'</strong> என்று அழைக்கப்படுகிறது. தானியங்கள் மற்றும் கோதுமையை மாவாக அரைக்கப் பயன்படும் எந்திரத்தை 'அட்டா சக்கி' (Atta Chakki) என்று குறிப்பிடுவர். நவீன மின்சார மாவரைக்கும் எந்திரங்களை 'மாவு மில்' (Flour Mill) என்றும் அழைக்கலாம். கையினால் திருகப்படும் <strong className="font-semibold text-[#1A0A0A]">பாரம்பரியக் கல்லை</strong> 'திருவை' அல்லது 'திருகல்' என்று அழைப்பார்கள்.
      </>
    ),
    englishDescription: 'Known as Chakki in Hindi, it is called Thirugal, Araikum Kal, Thirigai, or Thiruvai in Tamil. The machine used to grind grains and wheat into flour is called Atta Chakki. Modern electric flour grinding machines are called Flour Mills. The traditional hand-cranked stone is called Thiruvai or Thirugal.',
    image: '/images/benefits/chakki.png',
    accentColor: '#D4A017',
    bgGradient: 'from-[#F5EED0] to-[#FFFDF8]',
  },
];

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */
export default function MasalaCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalItems = TOOLS.length;

  /* scroll progress mapped to [0 … 1] across the entire tall section */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  /* Map progress → active index (0, 1, 2) */
  const activeIndexFloat = useTransform(scrollYProgress, [0, 1], [0, totalItems - 0.01]);

  /* We need a stateful active index for discrete, clean transitions */
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isEnglish, setIsEnglish] = useState(false);

  React.useEffect(() => {
    const unsubscribe = activeIndexFloat.on('change', (v) => {
      const idx = Math.min(Math.floor(v), totalItems - 1);
      setActiveIndex(idx);
    });
    return unsubscribe;
  }, [activeIndexFloat, totalItems]);

  const activeTool = TOOLS[activeIndex];

  // Rotate the dial discretely so it stays perfectly synced with the image/text change!
  const dialRotation = -(activeIndex * 120);

  return (
    <section
      ref={containerRef}
      className="relative bg-[#FFFDF8] h-auto lg:h-[300vh]"
    >
      {/* =========================================
          MOBILE VIEW: Stacked Editorial List
          ========================================= */}
      <div className="flex lg:hidden flex-col w-full py-16 gap-20">
        {TOOLS.map((tool) => (
          <div key={tool.id} className="flex flex-col items-center justify-center px-6 gap-8 relative">
            {/* Text Content */}
            <div className="flex flex-col items-center text-center max-w-sm">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase mb-4 px-3 py-1 rounded-full border" style={{ color: tool.accentColor, borderColor: tool.accentColor + '33', backgroundColor: tool.accentColor + '0D' }}>
                {tool.tag}
              </span>
              
              <h2 className="text-4xl sm:text-5xl text-[#1A0A0A] leading-tight mb-2 flex items-center justify-center gap-3" style={{ fontFamily: 'var(--font-arima), display', fontWeight: 700 }}>
                {isEnglish ? tool.englishName : tool.tamilName}
                <TranslateToggle isEnglish={isEnglish} onToggle={() => setIsEnglish(!isEnglish)} size="sm" />
              </h2>
              
              <p className="text-sm font-mono tracking-widest uppercase mb-4" style={{ color: tool.accentColor }}>{tool.name}</p>
              
              <p className="text-sm sm:text-base text-[#1A0A0A]/70 font-light leading-relaxed">
                {isEnglish ? tool.englishDescription : tool.description}
              </p>
            </div>

            {/* Image Bubble */}
            <div className="w-full max-w-[280px] sm:max-w-[340px] aspect-square rounded-full flex items-center justify-center bg-[#F5F1EB] shadow-[0_20px_40px_rgba(0,0,0,0.12)] relative z-10 border" style={{ borderColor: tool.accentColor + '20' }}>
              <div className="absolute inset-0 rounded-full border border-dashed pointer-events-none scale-105" style={{ borderColor: '#8B1E1E25' }} />
              <Image
                src={tool.image}
                alt={tool.name}
                fill
                className={`object-contain mix-blend-multiply ${
                  tool.id === 'ammikall' || tool.id === 'aatukal' ? 'p-6' : 'p-12'
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* =========================================
          DESKTOP VIEW: 300vh Scrubbing Carousel
          ========================================= */}
      <div className="hidden lg:flex sticky top-0 h-screen w-full overflow-hidden flex-col">
        {/* ─── Top Section: Title + Details ─── */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-16 px-4 sm:px-12 lg:px-24 pt-6 pb-2 sm:pt-8 sm:pb-4 relative z-20">
          
          {/* Left Column — Dynamic Text */}
          <div className="w-full lg:w-1/2 flex flex-col items-start justify-center max-w-xl overflow-y-auto overflow-x-hidden no-scrollbar pb-4 lg:pb-0">
            {/* Tag / Label */}
            <AnimatePresence mode="wait">
              <motion.span
                key={activeTool.id + '-tag'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.1 } }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="text-[10px] font-mono tracking-[0.4em] uppercase mb-4 px-3 py-1 rounded-full border"
                style={{
                  color: activeTool.accentColor,
                  borderColor: activeTool.accentColor + '33',
                  backgroundColor: activeTool.accentColor + '0D',
                }}
              >
                {activeTool.tag}
              </motion.span>
            </AnimatePresence>

            {/* Tamil Name (Big Hero) */}
            <AnimatePresence mode="wait">
              <motion.h2
                key={activeTool.id + '-tamil'}
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(4px)', transition: { duration: 0.1 } }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-5xl lg:text-[5rem] text-[#1A0A0A] tracking-normal leading-[1.2] mb-1 sm:mb-2 flex items-center gap-3"
                style={{ fontFamily: 'var(--font-arima), display', fontWeight: 700 }}
              >
                {isEnglish ? activeTool.englishName : activeTool.tamilName}
                <TranslateToggle isEnglish={isEnglish} onToggle={() => setIsEnglish(!isEnglish)} size="md" />
              </motion.h2>
            </AnimatePresence>

            {/* English Name */}
            <AnimatePresence mode="wait">
              <motion.p
                key={activeTool.id + '-eng'}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10, transition: { duration: 0.1 } }}
                transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm sm:text-lg font-mono tracking-widest uppercase mb-4 sm:mb-6"
                style={{ color: activeTool.accentColor }}
              >
                {activeTool.name}
              </motion.p>
            </AnimatePresence>

            {/* Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={activeTool.id + '-desc'}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15, transition: { duration: 0.1 } }}
                transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs sm:text-base text-[#1A0A0A]/70 font-light leading-relaxed mb-4 sm:mb-8 max-w-md pl-4 border-l-2"
                style={{ borderColor: activeTool.accentColor + '40' }}
              >
                {isEnglish ? activeTool.englishDescription : activeTool.description}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Right Column — Large Bowl Image with Rotation */}
          <div className="w-full lg:w-1/2 flex items-center justify-center relative">
            <div className="relative w-full max-w-[220px] sm:max-w-[400px] lg:max-w-[480px] aspect-square">
              
              {/* Rotating Background Circle / Dial */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ rotate: dialRotation }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: `conic-gradient(
                    ${TOOLS[0].accentColor}15 0deg 120deg,
                    ${TOOLS[1].accentColor}15 120deg 240deg,
                    ${TOOLS[2].accentColor}15 240deg 360deg
                  )`,
                  border: '2px solid rgba(139,30,30,0.06)',
                }}
              />

              {/* Decorative Ring */}
              <div
                className="absolute inset-0 rounded-full border-2 border-dashed pointer-events-none"
                style={{ borderColor: '#8B1E1E25' }}
              />

              {/* Active Bowl Image (Crossfade) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTool.id + '-img'}
                  initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.95, rotate: 5, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-4 sm:inset-6 rounded-full overflow-hidden bg-[#F5F1EB] shadow-[0_25px_60px_rgba(0,0,0,0.15)] flex items-center justify-center"
                >
                  <Image
                    src={activeTool.image}
                    alt={activeTool.name}
                    fill
                    className={`object-contain mix-blend-multiply ${
                      activeTool.id === 'ammikall' || activeTool.id === 'aatukal'
                        ? 'p-2 sm:p-6'
                        : 'p-6 sm:p-12'
                    }`}
                    priority
                  />
                </motion.div>
              </AnimatePresence>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
