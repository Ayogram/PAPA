"use client";

import { useState, useEffect, useRef } from "react";

const slides = [
  { src: "/4.jpeg", position: "center 15%" }, // seated, blue suit
  { src: "/2.jpeg", position: "center 12%" }, // seated, checked suit
  { src: "/1.jpeg", position: "center 8%"  }, // seated, floral jacket (swapped with 3)
  { src: "/3.jpeg", position: "center 10%" }, // standing full-body (swapped with 1)
];

export default function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isHoveredRef = useRef(false);

  // Auto-advance: runs on mount, never paused by state re-renders
  useEffect(() => {
    const id = setInterval(() => {
      if (!isHoveredRef.current) {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }
    }, 8500); // slightly slower for a cinematic feel
    return () => clearInterval(id);
  }, []); // ← empty dep array: interval starts once and never re-creates

  return (
    <>
      <style>{`
        @keyframes kenburns {
          from { transform: scale(1);    }
          to   { transform: scale(1.12); }
        }
      `}</style>

      <div
        className="absolute inset-0 w-full h-full overflow-hidden bg-black"
        onMouseEnter={() => { isHoveredRef.current = true;  }}
        onMouseLeave={() => { isHoveredRef.current = false; }}
      >
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.src}
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url('${slide.src}')`,
                backgroundSize: "cover",
                backgroundPosition: slide.position,
                opacity: isActive ? 0.85 : 0,
                transition: "opacity 1200ms ease-in-out",
                zIndex: isActive ? 2 : 1,
                animation: isActive ? "kenburns 10000ms linear forwards" : "none",
              }}
            />
          );
        })}

        {/* Gradient overlay — keeps text legible */}
        <div
          style={{ zIndex: 3 }}
          className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-transparent pointer-events-none"
        />

        {/* Dot indicators */}
        <div
          style={{ zIndex: 4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3"
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white w-6 h-2.5 scale-110"
                  : "bg-white/40 hover:bg-white/70 w-2.5 h-2.5"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
