'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface NodeData {
  id: number;
  title: string;
  englishTitle: string;
  description: string;
  x: string; // CSS position left/right
  y: string; // CSS position top/bottom
  cardX: number; // For SVG line source connection offsets
  cardY: number;
}

const NODES_DATA: NodeData[] = [
  {
    id: 0,
    title: 'உடற்பயிற்சி',
    englishTitle: 'Physical Work & Health',
    description: 'பாரம்பரிய முறையில் அம்மியிலும் உரலிலும் அரைப்பது உடலுக்கு ஒரு சிறந்த உடற்பயிற்சியாகும். இது கைகள், தோள்பட்டைகள் மற்றும் இடுப்புப் பகுதிகளை இயற்கையாக வலுவாக்க உதவுகிறது.',
    x: '32%',
    y: '30%',
    cardX: 32,
    cardY: 30
  },
  {
    id: 1,
    title: 'இயற்கையான சுவை',
    englishTitle: 'Natural Oils & Flavor',
    description: 'மின்சார மிக்சிகள் போல அரைக்கும் போது அதிக வெப்பத்தை உருவாக்காமல், குளிர் அழுத்த முறையில் அரைப்பதால் மசாலாவின் இயற்கை சுவை மற்றும் நறுமண எண்ணெய்கள் அப்படியே காக்கப்படுகின்றன.',
    x: '68%',
    y: '25%',
    cardX: 68,
    cardY: 25
  },
  {
    id: 2,
    title: 'ஊட்டச்சத்து பாதுகாப்பு',
    englishTitle: 'Nutrient Retention',
    description: 'மெதுவான அழுத்த அரைப்பு முறை வைட்டமின்கள், என்சைம்கள் மற்றும் தாதுக்கள் சிதைவடையாமல் பாதுகாக்கிறது. இது உணவை மேலும் ஆரோக்கியமானதாகவும் சத்தானதாகவும் மாற்றுகிறது.',
    x: '24%',
    y: '65%',
    cardX: 24,
    cardY: 65
  },
  {
    id: 3,
    title: 'உலோகக் கலப்பற்றது',
    englishTitle: 'No Metal Contamination',
    description: 'மின்சார மிக்சியின் எஃகு பிளேடுகள் தேய்ந்து நுண் துகள்களாக உணவில் கலக்கும் அபாயம் இதில் இல்லை. முற்றிலும் தூய்மையான கல் அரைப்பு முறை உடலுக்கு 100% பாதுகாப்பானது.',
    x: '72%',
    y: '70%',
    cardX: 72,
    cardY: 70
  }
];

export default function ThreeDExhibit() {
  const [activeNode, setActiveNode] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax / 3D tilt coordinates
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Limit rotation angle for premium, subtle movement
    setRotateX(-y * 0.02);
    setRotateY(x * 0.02);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const activeNodeData = NODES_DATA[activeNode];

  return (
    <section className="relative py-20 sm:py-28 bg-[#FFFDF8] overflow-hidden">
      {/* Background radial gradient representing a warm spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,30,30,0.02)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#8B1E1E]">
            [ Immersive Exhibit ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#1A0A0A] tracking-tight mt-3 mb-4">
            Interactive <span className="font-light italic text-[#8B1E1E]">Tactile Showcase</span>
          </h2>
          <p className="text-sm sm:text-base text-[#1A0A0A]/60 max-w-xl mx-auto font-light leading-relaxed">
            Click on the hovering spatial nodes to explore the physical and nutritional benefits of stone grinding.
          </p>
        </div>

        {/* 3D Simulation Area */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full h-[55vh] sm:h-[65vh] min-h-[450px] flex items-center justify-center rounded-3xl bg-gradient-to-b from-[#F7F2EB] to-[#FFFDF8] border border-[#8B1E1E]/5 shadow-[0_25px_60px_rgba(139,30,30,0.04)] cursor-grab active:cursor-grabbing overflow-hidden"
          style={{ perspective: 1000 }}
        >
          {/* Subtle Grid backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(139,30,30,0.02)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

          {/* Central 3D Tilted Granite Stone */}
          <motion.div
            style={{
              rotateX: rotateX,
              rotateY: rotateY,
              transformStyle: 'preserve-3d',
            }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
            className="relative w-[280px] sm:w-[400px] aspect-[4/3] flex items-center justify-center z-10"
          >
            {/* Soft ground shadow below the stone */}
            <div className="absolute -bottom-6 w-[80%] h-8 bg-[#8B1E1E]/10 filter blur-xl rounded-full transform -rotate-3 scale-95" />
            
            <Image
              src="/images/benefits/ammikall.png"
              alt="Granite Stone Grinder"
              fill
              className="object-contain filter brightness-[0.95] contrast-[1.05]"
              style={{ transform: 'translateZ(50px)' }}
            />
          </motion.div>

          {/* Interactive Hovering Nodes */}
          {NODES_DATA.map((node) => {
            const isActive = activeNode === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setActiveNode(node.id)}
                className="absolute p-4 focus:outline-none transition-transform duration-300 z-30 group"
                style={{
                  left: node.x,
                  top: node.y,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Outer pulsing ring */}
                <span className={`absolute inset-0 rounded-full border transition-all duration-700 ${
                  isActive 
                    ? 'border-[#8B1E1E] scale-150 opacity-100 animate-ping' 
                    : 'border-[#8B1E1E]/20 scale-100 opacity-0 group-hover:opacity-40 group-hover:scale-125'
                }`} />

                {/* Core Node Circle */}
                <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isActive 
                    ? 'bg-[#8B1E1E] shadow-[0_0_15px_rgba(139,30,30,0.4)] scale-110' 
                    : 'bg-[#FFFDF8] border border-[#8B1E1E]/30 backdrop-blur-sm group-hover:bg-[#8B1E1E]/10 group-hover:scale-105'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#FFFDF8]' : 'bg-[#8B1E1E]'}`} />
                </div>

                {/* Micro Label */}
                <span className={`absolute top-8 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-widest uppercase transition-colors duration-300 ${
                  isActive ? 'text-[#8B1E1E] font-bold' : 'text-[#1A0A0A]/40 group-hover:text-[#1A0A0A]/70'
                }`}>
                  {node.title}
                </span>
              </button>
            );
          })}

          {/* SVG Connection Lines tethering Node to Info Card */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 hidden md:block">
            <AnimatePresence>
              {activeNode !== null && (
                <motion.line
                  key={activeNode}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  x1={activeNodeData.cardX + '%'}
                  y1={activeNodeData.cardY + '%'}
                  x2={activeNodeData.cardX > 50 ? '55%' : '45%'}
                  y2="50%"
                  stroke="#8B1E1E"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              )}
            </AnimatePresence>
          </svg>

          {/* Sleek Glassmorphism Detail Card */}
          <div className="absolute bottom-6 left-6 right-6 md:static md:absolute md:top-1/2 md:-translate-y-1/2 md:right-12 z-40 max-w-sm w-auto mx-auto md:mx-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNode}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/80 backdrop-blur-xl border border-[#8B1E1E]/10 p-6 sm:p-8 rounded-2xl shadow-[0_20px_45px_rgba(139,30,30,0.08)] flex flex-col gap-3 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#8B1E1E]/40 via-[#8B1E1E] to-transparent" />
                
                <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#8B1E1E]">
                  {activeNodeData.englishTitle}
                </span>
                
                {/* Tamil Title */}
                <h4 className="font-serif text-2xl sm:text-3xl text-[#1A0A0A] font-medium">
                  {activeNodeData.title}
                </h4>

                <p className="text-sm sm:text-base text-[#1A0A0A]/75 font-light leading-relaxed pl-4 border-l-2 border-[#8B1E1E]/30">
                  {activeNodeData.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
