import React from 'react';
import { Play, Sparkles, CheckCircle2 } from 'lucide-react';

export const MarqueeTicker: React.FC = () => {
  const items = [
    'Social Media Marketing',
    'Amazon Seller Onboarding',
    'Google Ads PPC (Top-of-Search)',
    'Meta Ads (Facebook & Instagram)',
    'Flipkart Assured Setup',
    '3D & 2D Product Cataloging',
    'A+ Enhanced Brand Content',
    'Myntra & Meesho Expansion',
    'Viral Video Reels & Motion Design',
    'Brand Identity & Custom Logos',
    'SEO & SEM Intent Capture',
    '24/7 Always-On Growth Engine'
  ];

  return (
    <div id="marquee-section" className="py-4 bg-neutral-950 border-y border-neutral-800 overflow-hidden relative">
      {/* Soft gradient masks for seamless fade out at edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee space-x-6 items-center">
        {/* First copy */}
        {items.map((item, idx) => (
          <div
            key={`ticker-1-${idx}`}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-neutral-900/80 border border-neutral-800 text-xs sm:text-sm font-semibold text-neutral-300 whitespace-nowrap shadow-sm hover:border-[#B4FF39]/40 transition-colors"
          >
            <div className="w-4 h-4 rounded-full bg-[#B4FF39]/20 flex items-center justify-center">
              <Play className="w-2 h-2 fill-[#B4FF39] text-[#B4FF39]" />
            </div>
            <span>{item}</span>
          </div>
        ))}

        {/* Second duplicate copy for seamless loop */}
        {items.map((item, idx) => (
          <div
            key={`ticker-2-${idx}`}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-neutral-900/80 border border-neutral-800 text-xs sm:text-sm font-semibold text-neutral-300 whitespace-nowrap shadow-sm hover:border-[#B4FF39]/40 transition-colors"
          >
            <div className="w-4 h-4 rounded-full bg-[#B4FF39]/20 flex items-center justify-center">
              <Play className="w-2 h-2 fill-[#B4FF39] text-[#B4FF39]" />
            </div>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
