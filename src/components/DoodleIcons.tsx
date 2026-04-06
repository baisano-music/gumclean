// Hand-drawn doodle-style SVG icons inspired by bubblegum aesthetics
// Sketchy, playful line art - not polished/AI-looking

export function DoodleBubble({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3" />
      <circle cx="40" cy="40" r="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="32" cy="32" rx="8" ry="5" stroke="currentColor" strokeWidth="1.5" transform="rotate(-20 32 32)" opacity="0.5" />
      <path d="M40 68 C42 76 38 78 36 74" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* sparkle */}
      <path d="M64 16 L66 12 L68 16 L72 18 L68 20 L66 24 L64 20 L60 18Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

export function DoodleBroom({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* handle */}
      <path d="M28 16 L50 52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* bristles - sketchy */}
      <path d="M44 48 C42 58 36 66 30 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M48 50 C48 60 44 66 40 72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M52 52 C54 62 52 68 50 72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M56 54 C60 62 58 68 58 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* sparkles */}
      <circle cx="18" cy="28" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="62" cy="40" r="1.5" fill="currentColor" opacity="0.3" />
      <path d="M14 44 L16 40 L18 44 L22 46 L18 48 L16 52 L14 48 L10 46Z" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.25" />
    </svg>
  );
}

export function DoodleCalendar({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* page */}
      <rect x="14" y="20" width="52" height="46" rx="6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* top bar */}
      <path d="M14 34 L66 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 3" />
      {/* rings */}
      <path d="M28 14 L28 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M52 14 L52 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* check mark */}
      <path d="M30 48 L38 56 L54 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* little dots */}
      <circle cx="22" cy="44" r="1.5" fill="currentColor" opacity="0.3" />
      <circle cx="22" cy="56" r="1.5" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export function DoodleBuilding({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* building outline */}
      <path d="M18 68 L18 22 C18 20 20 18 22 18 L58 18 C60 18 62 20 62 22 L62 68" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* ground */}
      <path d="M10 68 L70 68" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 3" />
      {/* windows - sketchy */}
      <rect x="26" y="26" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="46" y="26" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="26" y="40" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="46" y="40" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      {/* door */}
      <path d="M35 68 L35 56 C35 54 37 54 40 54 C43 54 45 54 45 56 L45 68" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* sparkle */}
      <path d="M68 14 L70 10 L72 14 L76 16 L72 18 L70 22 L68 18 L64 16Z" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export function DoodlePin({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 70 C40 70 18 44 18 32 C18 20 28 12 40 12 C52 12 62 20 62 32 C62 44 40 70 40 70Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="40" cy="32" r="8" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
      <circle cx="40" cy="32" r="3" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export function DoodlePlane({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 52 L36 40 L28 36 L64 20 L48 44 L44 36 L32 60Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* trail */}
      <path d="M60 24 C66 22 70 26 72 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" opacity="0.4" />
      <path d="M56 28 C62 30 64 36 62 40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" opacity="0.3" />
    </svg>
  );
}

export function DoodleLeaf({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 64 C20 64 16 36 40 16 C64 36 60 64 60 64" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* stem */}
      <path d="M40 16 C38 32 32 48 20 64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* veins */}
      <path d="M36 30 C30 36 26 42 24 50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M44 30 C50 36 54 42 56 50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      {/* drops */}
      <circle cx="14" cy="56" r="2" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <circle cx="66" cy="48" r="1.5" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

export function DoodleBolt({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M44 8 L22 42 L38 42 L34 72 L60 34 L42 34 Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* sparkles around */}
      <circle cx="16" cy="24" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="68" cy="52" r="2" fill="currentColor" opacity="0.3" />
      <path d="M64 16 L66 12 L68 16 L72 18 L68 20 L66 24 L64 20 L60 18Z" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.25" />
      <path d="M10 48 L12 44 L14 48 L18 50 L14 52 L12 56 L10 52 L6 50Z" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

// Decorative squiggles / splashes for section backgrounds
export function DoodleSplash({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 20 C80 10 100 30 90 50 C110 60 100 90 80 80 C70 100 40 100 40 80 C20 90 10 60 30 50 C20 30 40 10 60 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.15" />
      {/* drops */}
      <circle cx="60" cy="8" r="3" fill="currentColor" opacity="0.1" />
      <circle cx="108" cy="50" r="2" fill="currentColor" opacity="0.1" />
      <circle cx="60" cy="112" r="3" fill="currentColor" opacity="0.1" />
      <circle cx="12" cy="50" r="2" fill="currentColor" opacity="0.1" />
    </svg>
  );
}
