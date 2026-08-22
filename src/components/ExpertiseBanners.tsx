import React from 'react';
import { Play, Zap, ArrowRight, CheckCircle2, TrendingUp, Sparkles, ShoppingBag, Eye, Layers, Shield } from 'lucide-react';

interface ExpertiseBannersProps {
  onSelectAction: (topic: string) => void;
}

export const ExpertiseBanners: React.FC<ExpertiseBannersProps> = ({ onSelectAction }) => {
  return (
    <section id="expertise" className="py-24 bg-[#080808] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-[#B4FF39]">
            <Zap className="w-3.5 h-3.5" />
            <span>Proven Growth Blueprints</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Stop Scrolling.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B4FF39] to-emerald-400">
              Start Selling.
            </span>
          </h2>

          <p className="text-base text-neutral-300">
            Your customers are searching on Google and scrolling on Meta. We make sure they find <strong className="text-[#B4FF39]">YOU</strong>.
          </p>
        </div>

        {/* Banner 1: Stop Scrolling. Start Selling (Split Ad Mastery) */}
        <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#B4FF39]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Google Ads Card */}
            <div className="rounded-2xl bg-neutral-950/90 border border-neutral-800 p-6 sm:p-8 space-y-4 hover:border-neutral-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-inner p-2 flex-shrink-0">
                  {/* Google Ads Official Vector Logo */}
                  <svg className="w-7 h-7" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285F4" d="M42.4 133.2L91.6 48a24.8 24.8 0 0 1 33.9-9.1l.2.1a24.8 24.8 0 0 1 9.1 33.9l-49.2 85.2a24.8 24.8 0 0 1-33.9 9.1l-.2-.1a24.8 24.8 0 0 1-9.1-33.9z"/>
                    <path fill="#FBBC04" d="M153.6 133.2L104.4 48a24.8 24.8 0 0 0-33.9-9.1l-.2.1a24.8 24.8 0 0 0-9.1 33.9l49.2 85.2a24.8 24.8 0 0 0 33.9 9.1l.2-.1a24.8 24.8 0 0 0 9.1-33.9z"/>
                    <circle fill="#34A853" cx="54" cy="146" r="24.8"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">GOOGLE ADS</h3>
                  <p className="text-xs text-[#B4FF39] font-semibold">Capture High-Intent Search</p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-neutral-300 pt-2">
                <div className="flex items-start gap-2.5">
                  <Play className="w-3.5 h-3.5 fill-[#B4FF39] text-[#B4FF39] mt-1 flex-shrink-0" />
                  <span><strong>Top-of-Search visibility instantly:</strong> Appear above competitors for high-volume keywords.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Play className="w-3.5 h-3.5 fill-[#B4FF39] text-[#B4FF39] mt-1 flex-shrink-0" />
                  <span><strong>High-intent keyword targeting:</strong> Connect with ready-to-buy consumers.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Play className="w-3.5 h-3.5 fill-[#B4FF39] text-[#B4FF39] mt-1 flex-shrink-0" />
                  <span><strong>Pay only for real clicks (PPC):</strong> Zero wasted budget on low-quality traffic.</span>
                </div>
              </div>
            </div>

            {/* Meta Ads Card */}
            <div className="rounded-2xl bg-neutral-950/90 border border-neutral-800 p-6 sm:p-8 space-y-4 hover:border-neutral-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-inner p-2 flex-shrink-0">
                  {/* Meta Official Vector Logo */}
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.96 4C14.77 4 12.87 5.17 12 6.88C11.13 5.17 9.23 4 7.04 4C3.71 4 1 6.8 1 10.25C1 15.11 6.35 19.34 11.38 19.93C11.79 19.98 12.21 19.98 12.62 19.93C17.65 19.34 23 15.11 23 10.25C23 6.8 20.29 4 16.96 4ZM12 17.5C8.03 17.02 3.6 13.68 3.6 10.25C3.6 8.24 5.14 6.6 7.04 6.6C8.84 6.6 10.42 7.77 11.02 9.52C11.18 10 11.66 10.33 12.18 10.33C12.7 10.33 13.18 10 13.34 9.52C13.94 7.77 15.52 6.6 17.32 6.6C19.22 6.6 20.76 8.24 20.76 10.25C20.76 13.68 16.33 17.02 12 17.5Z" fill="#0081FB"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">META ADS</h3>
                  <p className="text-xs text-emerald-400 font-semibold">Generate Social Demand</p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-neutral-300 pt-2">
                <div className="flex items-start gap-2.5">
                  <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400 mt-1 flex-shrink-0" />
                  <span><strong>Laser-focused audience demographics:</strong> Hyper-targeted interest & behavioral mapping.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400 mt-1 flex-shrink-0" />
                  <span><strong>Retargeting that brings buyers back:</strong> Convert cart abandoners and profile visitors.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400 mt-1 flex-shrink-0" />
                  <span><strong>Viral-ready creatives:</strong> Scroll-stopping hooks for Facebook & Instagram feeds.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Data-Driven Domination Bar */}
          <div className="mt-8 pt-6 border-t border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950/50 border border-neutral-800">
              <Play className="w-4 h-4 fill-[#B4FF39] text-[#B4FF39] flex-shrink-0" />
              <span className="text-xs font-semibold text-neutral-200">Real-Time ROI Tracking: No guessing, just data.</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950/50 border border-neutral-800">
              <Play className="w-4 h-4 fill-[#B4FF39] text-[#B4FF39] flex-shrink-0" />
              <span className="text-xs font-semibold text-neutral-200">A/B Testing: We find the winning formula fast.</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950/50 border border-neutral-800">
              <Play className="w-4 h-4 fill-[#B4FF39] text-[#B4FF39] flex-shrink-0" />
              <span className="text-xs font-semibold text-neutral-200">Zero Wasted Spend: Every cent works for your brand.</span>
            </div>
          </div>
        </div>

        {/* 3-Column Interactive Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Build Your Brand in 90 Days */}
          <div className="rounded-3xl bg-gradient-to-b from-amber-500/10 via-neutral-900 to-neutral-950 border border-amber-500/30 p-8 flex flex-col justify-between hover:border-amber-400 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                Acceleration Blueprint
              </div>
              <h3 className="text-2xl font-black text-white leading-tight">
                BUILD YOUR BRAND IN 90 DAYS
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Let us help you get the <strong>'WOW FACTOR'</strong> in your brand with comprehensive visual redesign, high-conversion funnels, and multichannel reach.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-800">
              <button
                onClick={() => onSelectAction('90-Day Brand Acceleration')}
                className="w-full py-3 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold hover:bg-amber-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Get 90-Day Blueprint</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Marketplace Onboarding: Zero to Live, Fast */}
          <div className="rounded-3xl bg-gradient-to-b from-emerald-500/10 via-neutral-900 to-neutral-950 border border-emerald-500/30 p-8 flex flex-col justify-between hover:border-emerald-400 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                E-Commerce Scaling
              </div>
              <h3 className="text-2xl font-black text-white leading-tight">
                MARKETPLACE ONBOARDING
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                From Zero to Live in 7 Days across <strong>Amazon, Flipkart, Myntra, and Meesho</strong>. Complete seller setup, GST verification, brand registry & A+ content.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-800">
              <button
                onClick={() => onSelectAction('Marketplace Onboarding')}
                className="w-full py-3 rounded-xl bg-emerald-500 text-neutral-950 text-xs font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Storefront Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Design Your Vision with Expert Graphics (20% OFF) */}
          <div className="rounded-3xl bg-gradient-to-b from-[#B4FF39]/10 via-neutral-900 to-neutral-950 border border-[#B4FF39]/30 p-8 flex flex-col justify-between hover:border-[#B4FF39] transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#B4FF39]/20 text-[#B4FF39] flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-1 rounded-md bg-[#B4FF39]/20 text-[#B4FF39] text-[10px] font-bold uppercase tracking-wider">
                Special Offer: 20% OFF
              </div>
              <h3 className="text-2xl font-black text-white leading-tight">
                EXPERT GRAPHICS & CATALOGS
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Logos, Brand Identity, 3D & 2D High-Resolution Product Imagery, and Digital Catalogs. <strong>100% Trusted • Fast Turnaround • Custom Designs.</strong>
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-800">
              <button
                onClick={() => onSelectAction('Design & Cataloging Special Offer')}
                className="w-full py-3 rounded-xl bg-[#B4FF39] text-neutral-950 text-xs font-bold hover:bg-[#c4ff5e] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Claim 20% OFF Design</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
