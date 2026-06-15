"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function CraftScrollAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null); // Start as null to avoid hydration mismatch

  // Syncing state for mobile video
  const [mobileTextIndex, setMobileTextIndex] = useState(-1); // -1 means none

  // First effect: Detect device type once on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDesktop(window.innerWidth >= 768);
    }
  }, []);

  // Second effect: Run GSAP logic only AFTER we know the device type
  useEffect(() => {
    if (isDesktop === null || typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    if (!isDesktop) {
      setIsLoaded(true);
      
      // Control video playback based on scroll visibility to save battery and start cleanly
      if (mobileContainerRef.current) {
        ScrollTrigger.create({
          trigger: mobileContainerRef.current,
          start: "top 60%",
          onEnter: () => mobileVideoRef.current?.play(),
          onLeave: () => mobileVideoRef.current?.pause(),
          onEnterBack: () => mobileVideoRef.current?.play(),
          onLeaveBack: () => mobileVideoRef.current?.pause(),
        });
      }

      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }

    // --- DESKTOP GSAP LOGIC ---
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = 1920;
    canvas.height = 1080;

    const totalFrames = 550;
    
    // TODO: Update these variables with your actual Cloudinary details
    const CLOUDINARY_CLOUD_NAME = "dstspf8bo"; 
    const CLOUDINARY_FOLDER = ""; // e.g., "scroll-frames" (leave empty string if in root)
    
    const currentFrameUrl = (index: number) => {
      const frameNum = (index + 1).toString().padStart(3, "0");
      const folderPath = CLOUDINARY_FOLDER ? `${CLOUDINARY_FOLDER}/` : "";
      
      // f_auto,q_auto ensures WebP/AVIF compression on the fly!
      return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/v1/${folderPath}frame_${frameNum}.jpg`;
    };

    const images: HTMLImageElement[] = [];
    const animationTicker = { frame: 0 };
    let loadedImagesCount = 0;

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = currentFrameUrl(i);
      
      img.onload = () => {
        loadedImagesCount++;
        const progress = Math.round((loadedImagesCount / totalFrames) * 100);
        setLoadingProgress(progress);

        if (loadedImagesCount === totalFrames) {
          setIsLoaded(true);
          initScrollAnimation();
        }
      };
      
      img.onerror = () => {
        loadedImagesCount++;
        if (loadedImagesCount === totalFrames) {
          setIsLoaded(true);
          initScrollAnimation();
        }
      };
      
      images.push(img);
    }

    function renderCanvasFrame(frameIndex: number) {
      if (images[frameIndex] && images[frameIndex].complete) {
        context!.clearRect(0, 0, canvas!.width, canvas!.height);
        context!.drawImage(images[frameIndex], 0, 0, canvas!.width, canvas!.height);
      }
    }

    function initScrollAnimation() {
      renderCanvasFrame(0);

      gsap.to(animationTicker, {
        frame: totalFrames - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          start: "top top",
          end: "+=10000",
          scrub: 1.5,
          onUpdate: () => {
            renderCanvasFrame(animationTicker.frame);
          }
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [isDesktop]);

  // Guarantee 100% perfect text sync with the video playhead
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const vid = e.currentTarget;
    if (!vid.duration) return;
    
    const progress = vid.currentTime / vid.duration;
    
    // Divide the 100% duration into 4 equal segments for the 4 slides
    // To create a nice crossfade effect, we use these boundaries
    let newIndex = 0;
    if (progress >= 0.75) newIndex = 3;
    else if (progress >= 0.50) newIndex = 2;
    else if (progress >= 0.25) newIndex = 1;

    if (newIndex !== mobileTextIndex) {
      setMobileTextIndex(newIndex);
    }
  };

  return (
    <>
      {/* =========================================
          DESKTOP VIEW: High-End Canvas Scrubbing
          ========================================= */}
      {isDesktop && (
        <div ref={containerRef} className="hidden md:flex relative w-full h-screen bg-[#FFFDF8] items-center justify-center overflow-hidden">
          {/* Loading Overlay */}
          {!isLoaded && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#FFFDF8] text-[#1A0A0A]">
              <p className="font-serif text-lg sm:text-xl tracking-widest text-[#8B1E1E] mb-4 uppercase">
                Preparing Craft Visuals
              </p>
              <div className="w-48 sm:w-64 h-1 bg-[#EBE3D5] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#D4AF37] transition-all duration-200" 
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <span className="text-xs font-mono text-[#8B1E1E]/60 mt-4 tracking-widest">
                {loadingProgress}%
              </span>
            </div>
          )}

          {/* Main Canvas */}
          <canvas 
            ref={canvasRef} 
            className="w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: isLoaded ? 1 : 0 }}
          />
        </div>
      )}


      {/* =========================================
          MOBILE VIEW: Perfectly Video-Synced Carousel
          ========================================= */}
      {!isDesktop && (
        <div ref={mobileContainerRef} className="block md:hidden relative w-full h-[100vh] bg-[#0A0404] overflow-hidden">
          
          {/* Background Video (Streamed from Cloudinary for performance) */}
          <video 
            ref={mobileVideoRef}
            src="https://res.cloudinary.com/dstspf8bo/video/upload/f_auto,q_auto/v1/midhuna_master.mp4" 
            loop 
            muted 
            playsInline 
            onTimeUpdate={handleTimeUpdate}
            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
          />
          
          {/* Vignette & Gradient to keep focus perfectly on the center text */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0A0404_100%)] opacity-80" />
          <div className="absolute inset-0 bg-black/40" />

          {/* Absolute Centered Text Wrapper */}
          <div className="absolute inset-0 flex items-center justify-center px-8 pointer-events-none">
            
            {/* Text 1 (0% to 25% of video) */}
            <div className={`absolute w-full px-8 text-center transition-all duration-1000 ${mobileTextIndex === 0 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
              <h2 className="text-[#D4AF37] text-xs tracking-[0.6em] uppercase mb-4 opacity-90">The Craft</h2>
              <p className="text-[#FFFDF8] text-3xl font-serif leading-tight">
                Authentic<br/><span className="italic font-light text-[#D4AF37]">Chettinad</span><br/>Preparation
              </p>
            </div>

            {/* Text 2 (25% to 50% of video) */}
            <div className={`absolute w-full px-8 text-center transition-all duration-1000 ${mobileTextIndex === 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
              <p className="text-[#FFFDF8]/95 text-2xl font-serif leading-relaxed font-light">
                Sun-dried to perfection,<br/>preserving vibrant colors and natural oils.
              </p>
            </div>

            {/* Text 3 (50% to 75% of video) */}
            <div className={`absolute w-full px-8 text-center transition-all duration-1000 ${mobileTextIndex === 2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
              <p className="text-[#FFFDF8]/95 text-2xl font-serif leading-relaxed font-light">
                Cold-ground using traditional stone mills,<br/>never exposed to machine heat.
              </p>
            </div>
            
            {/* Text 4 (75% to 100% of video) */}
            <div className={`absolute w-full px-8 text-center transition-all duration-1000 ${mobileTextIndex === 3 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
              <div className="w-[1px] h-12 bg-[#D4AF37]/50 mb-6 mx-auto" />
              <p className="text-[#D4AF37] text-2xl font-serif italic">
                Experience true heritage in every pinch.
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
