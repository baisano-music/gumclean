"use client";

import { STATS } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 gradient-mesh" />

      {/* Floating decorative blobs */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-pink/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-teal/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-4xl">
          <h1 className="font-[family-name:var(--font-fredoka)] text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-[1.1] mb-6 animate-bounce-in">
            Altijd een{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink via-yellow to-teal">
              schone buitenkant.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed font-[family-name:var(--font-dm-sans)]">
            GumClean reinigt winkelpuien, zonnepanelen en openbare ruimtes professioneel en milieuvriendelijk. Actief in gemeente Haarlemmermeer en omgeving.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <a
              href="#offerte"
              className="inline-flex items-center justify-center px-8 py-4 bg-yellow text-dark text-lg font-bold rounded-full hover:bg-yellow-light shadow-lg shadow-yellow/30 transition-all hover:scale-105"
            >
              Vraag een offerte aan →
            </a>
            <a
              href="#diensten"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/40 text-white text-lg font-semibold rounded-full hover:bg-white/10 transition-all hover:scale-105"
            >
              Bekijk onze diensten ↓
            </a>
          </div>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium"
              >
                <span className="font-bold">{stat.value}</span>
                <span className="text-white/70">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-[60px] sm:h-[80px]">
          <path
            d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120 Z"
            fill="#FFF5FB"
          />
        </svg>
      </div>
    </section>
  );
}
