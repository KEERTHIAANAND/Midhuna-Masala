'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

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
    description: (
      <>
        அம்மிக்கல் என்பது பாரம்பரியமாக சமையலில் மசாலா, சட்னி மற்றும் மூலிகைகளை அரைக்கப் பயன்படும் ஒரு <strong className="font-semibold text-[#1A0A0A]">தட்டையான கருங்கல்</strong> ஆகும். இதன் மீது பொருட்களை வைத்து அரைக்க உருளை வடிவக் குழவிக்கல் பயன்படுகிறது. இயந்திரங்களின் வரவுக்குப் பிறகும் பல வீடுகளில் இது இன்றளவும் பயன்படுத்தப்படுவதற்கு முக்கியக் காரணம், இதில் குறைந்த வெப்பநிலையில் பொருட்கள் அரைக்கப்படுவதால் <strong className="font-semibold text-[#1A0A0A]">அவற்றின் ஊட்டச்சத்துக்கள் அழியாமல் பாதுகாக்கப்படுவதோடு</strong>, மசாலாப் பொருட்களின் <strong className="font-semibold text-[#1A0A0A]">இயற்கை சுவை மற்றும் நிறம் சற்றும் மாறாமல் முழுமையான ஆரோக்கியத்துடன்</strong> கிடைப்பதுதான்.
      </>
    ),
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
    description: (
      <>
        ஆட்டுக்கல் என்பது சமையலில் மசாலாப் பொருட்கள் மற்றும் மாவுகளை பாரம்பரிய முறையில் அரைக்கப் பயன்படும் <strong className="font-semibold text-[#1A0A0A]">கருங்கல்லால் செய்யப்பட்ட</strong> ஒரு சமையலறை சாதனமாகும். தேங்காய், மிளகாய், மசாலா மற்றும் இட்லி, தோசைக்கான மாவு அரைக்கப் பயன்படுகிறது. நடுவில் குழி உள்ள உரல் போன்ற பகுதி (ஆட்டுக்கல்) மற்றும் கையால் பிடித்து அரைக்க உருண்டையான கல் (குழவி) ஆகிய இரு பகுதிகளைக் கொண்டது. <strong className="font-semibold text-[#1A0A0A]">மின்சாரம் தேவையில்லை</strong>. இதில் அரைக்கும் போது பொருட்களின் <strong className="font-semibold text-[#1A0A0A]">சுவை மற்றும் மணம் மாறாமல்</strong> இருக்கும்.
      </>
    ),
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
    description: (
      <>
        இந்தியில் 'சக்கி' (Chakki) என்று அழைக்கப்படுவது தமிழில் <strong className="font-semibold text-[#1A0A0A]">'திருகல்'</strong>, <strong className="font-semibold text-[#1A0A0A]">'அரைக்கும் கல்'</strong>, <strong className="font-semibold text-[#1A0A0A]">'திரிகை'</strong> அல்லது <strong className="font-semibold text-[#1A0A0A]">'திருவை'</strong> என்று அழைக்கப்படுகிறது. தானியங்கள் மற்றும் கோதுமையை மாவாக அரைக்கப் பயன்படும் எந்திரத்தை 'அட்டா சக்கி' (Atta Chakki) என்று குறிப்பிடுவர். நவீன மின்சார மாவரைக்கும் எந்திரங்களை 'மாவு மில்' (Flour Mill) என்றும் அழைக்கலாம். கையினால் திருகப்படும் <strong className="font-semibold text-[#1A0A0A]">பாரம்பரியக் கல்லை</strong> 'திருவை' அல்லது 'திருகல்' என்று அழைப்பார்கள்.
      </>
    ),
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

  /* Rotation of the circular dial (degrees) */
  const dialRotation = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(totalItems - 1) * 120] // 120° per item for 3 items
  );

  /* We need a stateful active index for text transitions */
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const unsubscribe = activeIndexFloat.on('change', (v) => {
      const idx = Math.min(Math.floor(v), totalItems - 1);
      setActiveIndex(idx);
    });
    return unsubscribe;
  }, [activeIndexFloat, totalItems]);

  const activeTool = TOOLS[activeIndex];

  return (
    <section
      ref={containerRef}
      className="relative bg-[#FFFDF8]"
      /* height = (number of items + 1) × 100vh so each masala gets a full viewport of scroll */
      style={{ height: `${(totalItems + 1) * 100}vh` }}
    >
      {/* ── Sticky viewport ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
        {/* ─── Top Section: Title + Details ─── */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-16 px-6 sm:px-12 lg:px-24 pt-8 pb-4 relative z-20">
          {/* Left Column — Dynamic Text */}
          <div className="w-full lg:w-1/2 flex flex-col items-start justify-center max-w-xl">
            {/* Tag / Label */}
            <AnimatePresence mode="wait">
              <motion.span
                key={activeTool.id + '-tag'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -30, filter: 'blur(8px)' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl lg:text-[5rem] text-[#1A0A0A] tracking-normal leading-[1.2] mb-2"
                style={{ fontFamily: 'var(--font-arima), display', fontWeight: 700 }}
              >
                {activeTool.tamilName}
              </motion.h2>
            </AnimatePresence>

            {/* English Name */}
            <AnimatePresence mode="wait">
              <motion.p
                key={activeTool.id + '-eng'}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-base sm:text-lg font-mono tracking-widest uppercase mb-6"
                style={{ color: activeTool.accentColor }}
              >
                {activeTool.name}
              </motion.p>
            </AnimatePresence>

            {/* Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={activeTool.id + '-desc'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm sm:text-base text-[#1A0A0A]/65 font-light leading-relaxed mb-8 max-w-md pl-4 border-l-2"
                style={{ borderColor: activeTool.accentColor + '40' }}
              >
                {activeTool.description}
              </motion.p>
            </AnimatePresence>


          </div>

          {/* Right Column — Large Bowl Image with Rotation */}
          <div className="w-full lg:w-1/2 flex items-center justify-center relative">
            <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[480px] lg:h-[480px]">
              {/* Rotating Background Circle / Dial */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  rotate: dialRotation,
                  background: `conic-gradient(
                    ${TOOLS[0].accentColor}15 0deg 120deg,
                    ${TOOLS[1].accentColor}15 120deg 240deg,
                    ${TOOLS[2].accentColor}15 240deg 360deg
                  )`,
                  border: '2px solid rgba(139,30,30,0.06)',
                }}
              />

              {/* Active Bowl Image (Crossfade) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTool.id + '-img'}
                  initial={{ opacity: 0, scale: 0.85, rotate: -15 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.85, rotate: 15 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-4 sm:inset-6 rounded-full overflow-hidden bg-[#F5F1EB] shadow-[0_25px_60px_rgba(0,0,0,0.15)] flex items-center justify-center"
                >
                  <Image
                    src={activeTool.image}
                    alt={activeTool.name}
                    fill
                    className={`object-contain mix-blend-multiply ${
                      activeTool.id === 'ammikall' || activeTool.id === 'aatukal'
                        ? 'p-2 sm:p-6'
                        : 'p-8 sm:p-12'
                    }`}
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Decorative Ring */}
              <div
                className="absolute inset-0 rounded-full border-2 border-dashed pointer-events-none"
                style={{ borderColor: activeTool.accentColor + '25' }}
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
