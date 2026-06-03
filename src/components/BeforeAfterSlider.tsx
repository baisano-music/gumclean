"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function BeforeAfterSlider() {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  function updatePosition(clientX: number) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }

  function handlePointerDown(e: React.PointerEvent) {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  }

  function handlePointerUp() {
    isDragging.current = false;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/9] sm:aspect-[2/1] rounded-[2rem] overflow-hidden cursor-ew-resize select-none border-4 border-pink/30"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ touchAction: "none" }}
    >
      {/* After (clean) - full background */}
      <Image
        src="/after.png"
        alt="Na reiniging"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 80vw"
      />

      {/* Before (dirty) - clipped */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src="/before.png"
          alt="Voor reiniging"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 80vw"
        />
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 px-4 py-1.5 bg-dark/70 backdrop-blur-sm text-white text-sm font-bold rounded-full">
        Voor
      </div>
      <div className="absolute top-4 right-4 px-4 py-1.5 bg-teal/80 backdrop-blur-sm text-dark text-sm font-bold rounded-full">
        Na
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-pink"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-pink rounded-full flex items-center justify-center shadow-lg shadow-pink/40">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
          </svg>
        </div>
      </div>
    </div>
  );
}
