import React from 'react';
import { Activity, BarChart3, Layers, Sliders, MapPin, Phone, Mail, MessageSquare, Award } from 'lucide-react';
import { ContactInfo } from '../types';
import defaultFounderPhoto from '../assets/images/somnath_banerjee_portrait_1786897591897.jpg';

interface AboutSectionProps {
  contactInfo: ContactInfo;
  onContactClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ contactInfo, onContactClick }) => {
  const activePhoto = contactInfo.founderPhoto || defaultFounderPhoto;

  const pillars = [
    {
      title: 'Always On',
      subtitle: 'We monitor trends 24/7',
      desc: 'Digital algorithms and customer conversations never rest. We monitor live ad performance, engagement spikes, and marketplace inquiries continuously.',
      icon: Activity,
      color: 'from-lime-500/20 to-emerald-500/20',
      border: 'border-lime-500/30',
      accent: 'text-[#B4FF39]'
    },
    {
      title: 'Data-First',
      subtitle: 'Every decision backed by analytics',
      desc: 'No guesswork, no vanity metrics. Every ad rupee and content piece is measured against real revenue, CAC, and return on ad spend (ROAS).',
      icon: BarChart3,
      color: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/30',
      accent: 'text-emerald-400'
    },
    {
      title: 'Full Spectrum',
      subtitle: 'Design, marketing & management under one roof',
      desc: 'From custom 3D cataloging and brand identity to Amazon Seller Central and Google PPC campaigns, we handle the entire growth pipeline.',
      icon: Layers,
      color: 'from-teal-500/20 to-cyan-500/20',
      border: 'border-teal-500/30',
      accent: 'text-teal-400'
    },
    {
      title: 'Custom Fit',
      subtitle: 'Strategies tailored to your specific niche',
      desc: 'Whether you are an apparel label, electronics distributor, or local service business in Kolkata, we craft custom growth blueprints.',
      icon: Sliders,
      color: 'from-cyan-500/20 to-lime-500/20',
      border: 'border-cyan-500/30',
      accent: 'text-cyan-400'
    }
  ];

  return (
    <section id="about" className="py-24 bg-[#0D0D0D] relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#B4FF39]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-[#B4FF39]">
            <Award className="w-3.5 h-3.5" />
            <span>About StreamOn Digital Agency</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            We Don’t Just Manage Your Brand.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B4FF39] to-emerald-400">
              We Power It.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
            In a digital world that never sleeps, your brand must stay visible, engaging, and efficient—24/7. At StreamOn, we blend bold creativity with data-driven strategy so your business is not just participating in the market, but leading it.
          </p>
        </div>

        {/* 2-Column Grid: Founder Profile / Agency Card & 4 Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Founder Leadership Card & Contact Credentials */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800 p-6 sm:p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden group hover:border-neutral-700 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B4FF39]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {/* Profile Avatar Frame with Lime Glow */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-neutral-950 border-2 border-[#B4FF39]/50 overflow-hidden shadow-[0_0_20px_rgba(180,255,57,0.25)] flex items-center justify-center relative">
                    <img
                      src={activePhoto}
                      alt={contactInfo.founderName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultFounderPhoto;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent flex items-end justify-center pb-1 pointer-events-none">
                      <span className="text-[10px] text-[#B4FF39] font-bold tracking-wide">StreamOn</span>
                    </div>
                  </div>

                  <div className="absolute -bottom-2 -right-2 bg-neutral-950 border border-[#B4FF39] text-[#B4FF39] text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-lg">
                    Founder
                  </div>
                </div>

                {/* Founder Info */}
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold text-white">{contactInfo.founderName}</h3>
                  <p className="text-xs font-semibold text-[#B4FF39] mt-0.5">{contactInfo.founderRole}</p>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                    Senior digital growth consultant with proven expertise in e-commerce brand scaling, Google & Meta PPC dominance, and 3D catalog architectures.
                  </p>
                </div>
              </div>

              {/* Visiting Card Highlights & Location */}
              <div className="mt-6 pt-6 border-t border-neutral-800 space-y-3.5 text-xs text-neutral-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#B4FF39] flex-shrink-0 mt-0.5" />
                  <span>{contactInfo.address}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#B4FF39] flex-shrink-0" />
                  <div className="flex gap-2">
                    <a href={`tel:${contactInfo.phonePrimary}`} className="hover:text-[#B4FF39] underline decoration-neutral-700">
                      {contactInfo.phonePrimary}
                    </a>
                    <span>•</span>
                    <a href={`tel:${contactInfo.phoneSecondary}`} className="hover:text-[#B4FF39] underline decoration-neutral-700">
                      {contactInfo.phoneSecondary}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#B4FF39] flex-shrink-0" />
                  <a href={`mailto:${contactInfo.emailPrimary}`} className="hover:text-[#B4FF39] underline decoration-neutral-700">
                    {contactInfo.emailPrimary}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>WhatsApp: <strong>{contactInfo.whatsapp}</strong></span>
                </div>
              </div>

              {/* Direct Strategy Chat Button */}
              <div className="mt-6">
                <button
                  onClick={onContactClick}
                  className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-[#B4FF39] text-white hover:text-neutral-950 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Connect With Somnath Banerjee</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Key Pillars of "Why Choose StreamOn" */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className={`rounded-3xl bg-neutral-900/60 border ${pillar.border} p-6 hover:bg-neutral-900 transition-all duration-300 space-y-3 group hover:shadow-xl`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${pillar.color} border border-white/10 flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${pillar.accent}`} />
                    </div>
                    <span className="text-xs font-mono font-bold text-neutral-500">0{idx + 1}</span>
                  </div>

                  <h4 className="text-lg font-bold text-white group-hover:text-[#B4FF39] transition-colors">
                    {pillar.title}
                  </h4>

                  <p className="text-xs font-semibold text-neutral-400">
                    {pillar.subtitle}
                  </p>

                  <p className="text-xs text-neutral-400 leading-relaxed pt-1">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
