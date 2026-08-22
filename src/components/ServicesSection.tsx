import React, { useState } from 'react';
import { Share2, ShoppingCart, TrendingUp, Palette, Rocket, Video, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services, onSelectService }) => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const iconMap: Record<string, React.ElementType> = {
    Share2: Share2,
    ShoppingCart: ShoppingCart,
    TrendingUp: TrendingUp,
    Palette: Palette,
    Rocket: Rocket,
    Video: Video
  };

  const filteredServices = activeTab === 'all'
    ? services
    : services.filter(s => {
        if (activeTab === 'social') return s.title.toLowerCase().includes('social');
        if (activeTab === 'ecommerce') return s.title.toLowerCase().includes('commerce') || s.title.toLowerCase().includes('market');
        if (activeTab === 'ads') return s.title.toLowerCase().includes('ads') || s.title.toLowerCase().includes('google');
        if (activeTab === 'design') return s.title.toLowerCase().includes('graphic') || s.title.toLowerCase().includes('catalog') || s.title.toLowerCase().includes('video');
        return true;
      });

  return (
    <section id="services" className="py-24 bg-[#0A0A0A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-[#B4FF39]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Power Capabilities</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Our Digital Marketing &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B4FF39] to-emerald-400">
              E-Commerce Services
            </span>
          </h2>

          <p className="text-base text-neutral-300">
            From social media viral velocity to multi-marketplace seller dominance, we deliver full-funnel digital solutions.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'all', label: 'All Services' },
              { id: 'social', label: 'Social Media' },
              { id: 'ecommerce', label: 'E-Commerce & Amazon' },
              { id: 'ads', label: 'Google & Meta PPC' },
              { id: 'design', label: 'Cataloging & Design' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#B4FF39] text-neutral-950 shadow-[0_0_15px_rgba(180,255,57,0.35)]'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => {
            const IconComponent = iconMap[service.iconName] || TrendingUp;
            return (
              <div
                key={service.id}
                className="rounded-3xl bg-neutral-900/80 border border-neutral-800 p-7 hover:border-[#B4FF39]/60 hover:bg-neutral-900 transition-all duration-300 flex flex-col justify-between group shadow-xl hover:shadow-2xl relative overflow-hidden"
              >
                {/* Subtle top neon accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B4FF39] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center group-hover:border-[#B4FF39]/40 group-hover:bg-[#B4FF39]/10 transition-all">
                      <IconComponent className="w-7 h-7 text-[#B4FF39] group-hover:scale-110 transition-transform" />
                    </div>

                    {service.badge && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl font-bold text-white group-hover:text-[#B4FF39] transition-colors leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-xs font-semibold text-neutral-400 mt-1">
                    {service.subtitle}
                  </p>

                  <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <div className="mt-6 pt-5 border-t border-neutral-800/80 space-y-2.5">
                    {service.features.map((feat, fidx) => (
                      <div key={fidx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                        <CheckCircle className="w-3.5 h-3.5 text-[#B4FF39] flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Platforms / Badges */}
                  {service.platforms && service.platforms.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {service.platforms.map((plat, pidx) => (
                        <span
                          key={pidx}
                          className="px-2 py-0.5 rounded-md bg-neutral-950 text-[10px] font-mono text-neutral-400 border border-neutral-800"
                        >
                          {plat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Action Button */}
                <div className="mt-8 pt-4 border-t border-neutral-800">
                  <button
                    onClick={() => onSelectService(service.title)}
                    className="w-full py-3 rounded-xl bg-neutral-950 hover:bg-[#B4FF39] text-neutral-200 hover:text-neutral-950 text-xs font-bold transition-all border border-neutral-800 hover:border-[#B4FF39] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Enquire for {service.title.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
