import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CAROUSEL_SLIDES } from '../types';

export function Carousel() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? CAROUSEL_SLIDES.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [index, isPaused]);

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-cocoa-900 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence>
        <motion.img
          key={index}
          src={CAROUSEL_SLIDES[index].src}
          alt={CAROUSEL_SLIDES[index].alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full object-cover"
          decoding="async"
          fetchPriority={index === 0 ? 'high' : 'auto'}
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-cocoa-900/90 via-cocoa-900/35 to-transparent pointer-events-none" />

      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full border border-green-200 shadow-md">
        <div className="w-4 h-4 border-2 border-green-600 flex items-center justify-center rounded-sm bg-white p-0.5">
          <div className="w-2 h-2 bg-green-600 rounded-full" />
        </div>
        <span className="text-[10px] font-extrabold text-green-700 tracking-wider uppercase font-sans">
          100% Eggless &amp; Pure Veg
        </span>
      </div>

      <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col pointer-events-none">
        <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#ffffff] tracking-tight leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] select-none">
          {CAROUSEL_SLIDES[index].alt}
        </p>
        <p className="text-caramel-400 text-xs sm:text-sm font-semibold mt-1.5 tracking-wide select-none">
          {CAROUSEL_SLIDES[index].caption}
        </p>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-cocoa-950/70 hover:bg-caramel-500 hover:text-[#ffffff] text-caramel-400 p-2 rounded-full backdrop-blur-xs border border-[#ffffff]/20 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:scale-105"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-cocoa-950/70 hover:bg-caramel-500 hover:text-[#ffffff] text-caramel-400 p-2 rounded-full backdrop-blur-xs border border-[#ffffff]/20 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:scale-105"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-3 right-6 z-20 flex gap-1.5 items-center pointer-events-auto">
        {CAROUSEL_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === index ? 'w-6 bg-caramel-500' : 'w-2 bg-[#ffffff]/45 hover:bg-[#ffffff]/80'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
