import Image from "next/image";
import { COMPANY, NAV_ITEMS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative bg-dark text-white/70 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-pink/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-purple/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="mb-5">
              <Image
                src="/logo.png"
                alt={COMPANY.name}
                width={160}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-sm leading-relaxed mb-4">
              {COMPANY.tagline}
            </p>
            <div className="flex gap-2">
              <span className="inline-block px-3 py-1 bg-pink/10 text-pink text-xs font-semibold rounded-full">
                Kauwgumvrij
              </span>
              <span className="inline-block px-3 py-1 bg-teal/10 text-teal text-xs font-semibold rounded-full">
                Milieuvriendelijk
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-fredoka)] text-white font-bold text-lg mb-5">Navigatie</h3>
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm hover:text-pink transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-fredoka)] text-white font-bold text-lg mb-5">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-pink/10 rounded-full">
                  <svg className="w-4 h-4 text-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </span>
                {COMPANY.phone}
              </li>
              <li className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-purple/10 rounded-full">
                  <svg className="w-4 h-4 text-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                {COMPANY.email}
              </li>
              <li className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-teal/10 rounded-full">
                  <svg className="w-4 h-4 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </span>
                {COMPANY.location}, {COMPANY.region}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>&copy; {new Date().getFullYear()} {COMPANY.name} — {COMPANY.website}</p>
          <div className="flex gap-4">
            <a href="#diensten" className="hover:text-pink transition-colors">Diensten</a>
            <a href="#offerte" className="hover:text-pink transition-colors">Contact</a>
            <span>Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
