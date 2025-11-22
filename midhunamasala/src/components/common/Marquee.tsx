'use client';

export default function Marquee() {
  return (
    <div className="bg-[#8B1E1E] text-[#F6C84C] py-2 overflow-hidden whitespace-nowrap relative z-50">
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
      <div className="animate-marquee inline-block">
        <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ PURE AUTHENTIC CHETTINAD FLAVORS ★</span>
        <span className="mx-4 text-xs font-bold tracking-widest uppercase">TRADITIONAL STONE GROUND MASALAS</span>
        <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ FROM OUR VILLAGE TO YOUR KITCHEN ★</span>
        <span className="mx-4 text-xs font-bold tracking-widest uppercase">100% NATURAL & SUN DRIED</span>
        <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ PURE AUTHENTIC CHETTINAD FLAVORS ★</span>
        <span className="mx-4 text-xs font-bold tracking-widest uppercase">TRADITIONAL STONE GROUND MASALAS</span>
        <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ FROM OUR VILLAGE TO YOUR KITCHEN ★</span>
        <span className="mx-4 text-xs font-bold tracking-widest uppercase">100% NATURAL & SUN DRIED</span>
      </div>
      <div className="animate-marquee inline-block absolute top-2 left-0">
        <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ PURE AUTHENTIC CHETTINAD FLAVORS ★</span>
        <span className="mx-4 text-xs font-bold tracking-widest uppercase">TRADITIONAL STONE GROUND MASALAS</span>
        <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ FROM OUR VILLAGE TO YOUR KITCHEN ★</span>
        <span className="mx-4 text-xs font-bold tracking-widest uppercase">100% NATURAL & SUN DRIED</span>
        <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ PURE AUTHENTIC CHETTINAD FLAVORS ★</span>
        <span className="mx-4 text-xs font-bold tracking-widest uppercase">TRADITIONAL STONE GROUND MASALAS</span>
        <span className="mx-4 text-xs font-bold tracking-widest uppercase">★ FROM OUR VILLAGE TO YOUR KITCHEN ★</span>
        <span className="mx-4 text-xs font-bold tracking-widest uppercase">100% NATURAL & SUN DRIED</span>
      </div>
    </div>
  );
}
