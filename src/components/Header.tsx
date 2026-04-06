"use client";

import { useState } from "react";
import Image from "next/image";
import { NAV_ITEMS } from "@/lib/constants";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 glass border-b border-pink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#" className="flex items-center shrink-0">
            <Image
              src="/logo.png"
              alt="GumClean"
              width={200}
              height={48}
              className="h-10 sm:h-12 w-auto"
              priority
            />
          </a>

          <nav className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-semibold text-dark rounded-full hover:bg-pink/10 hover:text-pink transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <a
              href="#offerte"
              className="inline-flex items-center px-6 py-3 bg-pink text-white text-sm font-bold rounded-full hover:bg-pink-dark shadow-purple/30 shadow-lg hover:animate-wobble transition-all"
            >
              Offerte aanvragen
            </a>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-dark hover:text-pink transition-colors"
            aria-label="Menu openen"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur border-t border-pink/10">
          <div className="px-4 py-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm font-semibold text-dark rounded-full hover:bg-pink/10 hover:text-pink"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#offerte"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center px-6 py-3 bg-pink text-white text-sm font-bold rounded-full hover:bg-pink-dark transition-colors"
            >
              Offerte aanvragen
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
