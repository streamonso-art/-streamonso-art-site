import React from 'react';
import { Sparkles, ArrowRight, Play, TrendingUp, ShoppingBag, ShieldCheck, Zap, MessageSquare } from 'lucide-react';
import { ContactInfo } from '../types';

interface HeroSectionProps {
  contactInfo: ContactInfo;
  onBookCall: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ contactInfo, onBookCall }) => {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#0A0A0A] overflow-hidden">
      {/* Background Neon Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#B4FF39]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/90 border border-[#B4FF39]/30 text-xs font-semibold text-neutral-200 shadow-[0_0_15px_rgba(180,255,57,0.15)]">
              <span className="w-2 h-2 rounded-full bg-[#B4FF39] animate-ping" />
              <Zap className="w-3.5 h-3.5 text-[#B4FF39]" />
              <span>Digital Solutions for the Modern Era</span>
              <span className="text-neutral-500">|</span>
              <span className="text-[#B4FF39]">Always On</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Switch Your Business To{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B4FF39] via-emerald-400 to-[#B4FF39] drop-shadow-[0_0_25px_rgba(180,255,57,0.3)]">
                High Power
              </span>
            </h1>

            {/* Subheadline & Slogan */}
            <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              <span className="text-white font-semibold">We don't just manage your brand. We power it.</span>{' '}
              In a digital world that never sleeps, we keep your business visible, engaging, and generating maximum ROI on Meta, Google, Amazon & Myntra — 24/7.
            </p>

            {/* Key Value Checklist */}
            <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto lg:mx-0 pt-2 text-left">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-300">
                <div className="w-5 h-5 rounded-full bg-[#B4FF39]/20 flex items-center justify-center flex-shrink-0">
                  <Play className="w-2.5 h-2.5 fill-[#B4FF39] text-[#B4FF39]" />
                </div>
                <span>Top-of-Search Google Ads</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-300">
                <div className="w-5 h-5 rounded-full bg-[#B4FF39]/20 flex items-center justify-center flex-shrink-0">
                  <Play className="w-2.5 h-2.5 fill-[#B4FF39] text-[#B4FF39]" />
                </div>
                <span>E-Commerce Launch in 7 Days</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-300">
                <div className="w-5 h-5 rounded-full bg-[#B4FF39]/20 flex items-center justify-center flex-shrink-0">
                  <Play className="w-2.5 h-2.5 fill-[#B4FF39] text-[#B4FF39]" />
                </div>
                <span>High-Converting Meta Ads</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-300">
                <div className="w-5 h-5 rounded-full bg-[#B4FF39]/20 flex items-center justify-center flex-shrink-0">
                  <Play className="w-2.5 h-2.5 fill-[#B4FF39] text-[#B4FF39]" />
                </div>
                <span>2D/3D Product Cataloging</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                id="hero-book-call-btn"
                onClick={onBookCall}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#B4FF39] text-neutral-950 font-bold text-base hover:bg-[#c6ff63] hover:shadow-[0_0_30px_rgba(180,255,57,0.45)] transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span>Book Free Strategy Call</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                id="hero-whatsapp-btn"
                href={`https://wa.me/91${contactInfo.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20StreamOn,%20I%20want%20to%20grow%20my%20business%20online`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 hover:border-emerald-500/50 font-semibold text-sm flex items-center justify-center gap-2.5 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: {contactInfo.whatsapp}</span>
              </a>
            </div>

            {/* Trust Indicator */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-6 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#B4FF39]" />
                <span>Zero Wasted Ad Spend</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#B4FF39]" />
                <span>Dedicated Account Strategist</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Impact Visual Card & Floating Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Interactive Showcase Card */}
              <div className="relative rounded-3xl bg-neutral-900/90 border border-neutral-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl overflow-hidden group hover:border-[#B4FF39]/50 transition-all duration-300">
                {/* Glow border line on top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B4FF39] to-transparent" />

                {/* Big Visual Header */}
                <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center shadow-inner">
                      <div className="w-4 h-4 rounded-full bg-[#B4FF39] animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight">StreamOn Growth Hub</h3>
                      <p className="text-xs text-neutral-400">Real-Time Performance Engine</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Live Active
                  </span>
                </div>

                {/* Simulated Campaign Metric Visualizer */}
                <div className="py-6 space-y-4">
                  <div className="bg-neutral-950/80 rounded-2xl p-4 border border-neutral-800/80">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-neutral-400 font-medium">Campaign ROAS Performance</span>
                      <span className="text-xs font-bold text-[#B4FF39]">+380% vs Industry Avg</span>
                    </div>
                    <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-[#B4FF39] rounded-full w-[88%]" />
                    </div>
                  </div>

                  {/* Multi-Channel Distribution */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-neutral-950/80 rounded-2xl p-3.5 border border-neutral-800">
                      <div className="text-[11px] text-neutral-400">Meta & Google PPC</div>
                      <div className="text-lg font-extrabold text-white mt-1">High Intent</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">Top of Search Clicks</div>
                    </div>
                    <div className="bg-neutral-950/80 rounded-2xl p-3.5 border border-neutral-800">
                      <div className="text-[11px] text-neutral-400">Marketplace Launch</div>
                      <div className="text-lg font-extrabold text-white mt-1">7 Days</div>
                      <div className="text-[10px] text-[#B4FF39] mt-0.5">Amazon & Flipkart Ready</div>
                    </div>
                  </div>

                  {/* Dynamic Quote Box */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 text-left">
                    <p className="text-xs text-neutral-300 italic">
                      "Let us help you get the 'WOW FACTOR' in your brand. Stop scrolling, start selling."
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-white font-semibold">{contactInfo.founderName}</span>
                      <span className="text-neutral-500">Birati, Kolkata</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <button
                  onClick={onBookCall}
                  className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-[#B4FF39] text-white hover:text-neutral-950 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Claim 20% OFF Your First Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Floating Floating Badge 1: Top Right */}
              <div className="absolute -top-6 -right-4 sm:-right-6 bg-neutral-900/95 border border-[#B4FF39]/40 rounded-2xl px-4 py-2.5 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-bounce duration-1000">
                <div className="w-8 h-8 rounded-xl bg-[#B4FF39]/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-[#B4FF39]" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Brand Growth</div>
                  <div className="text-xs font-extrabold text-white">90-Day Domination</div>
                </div>
              </div>

              {/* Floating Badge 2: Bottom Left */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-neutral-900/95 border border-emerald-500/40 rounded-2xl px-4 py-2.5 shadow-2xl backdrop-blur-md flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">E-Commerce</div>
                  <div className="text-xs font-extrabold text-white">Amazon • Flipkart • Myntra</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Stats Strip */}
        <div className="mt-20 pt-10 border-t border-neutral-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/60">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">500+</div>
            <div className="text-xs sm:text-sm text-neutral-400 mt-1">SKUs & Accounts Managed</div>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/60">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#B4FF39] font-mono">3.8x</div>
            <div className="text-xs sm:text-sm text-neutral-400 mt-1">Average ROAS Increase</div>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/60">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">90 Days</div>
            <div className="text-xs sm:text-sm text-neutral-400 mt-1">Brand Velocity Blueprint</div>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/60">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#B4FF39] font-mono">24/7</div>
            <div className="text-xs sm:text-sm text-neutral-400 mt-1">Always-On Live Monitoring</div>
          </div>
        </div>

      </div>
    </section>
  );
};
