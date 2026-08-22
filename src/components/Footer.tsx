import React from 'react';
import { StreamOnLogo } from './StreamOnLogo';
import { ContactInfo } from '../types';
import { Phone, Mail, MapPin, MessageSquare, ShieldCheck, ArrowUp, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  contactInfo: ContactInfo;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ contactInfo, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#050505] border-t border-neutral-800 text-neutral-400 text-xs relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: Brand & Slogan */}
          <div className="lg:col-span-4 space-y-4">
            <StreamOnLogo variant="dark" size="md" showTagline={true} />
            
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm pt-2">
              {contactInfo.slogan} We empower D2C brands, marketplace sellers, and local businesses with full-funnel digital marketing, PPC ad management, and 3D cataloging.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={`https://wa.me/91${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 flex items-center justify-center text-emerald-400 transition-colors"
                title="WhatsApp Chat"
              >
                <MessageSquare className="w-4 h-4" />
              </a>

              <a
                href={`tel:${contactInfo.phonePrimary}`}
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 hover:border-[#B4FF39]/50 flex items-center justify-center text-[#B4FF39] transition-colors"
                title="Call Direct"
              >
                <Phone className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${contactInfo.emailPrimary}`}
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 hover:border-[#B4FF39]/50 flex items-center justify-center text-neutral-300 transition-colors"
                title="Email Support"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-tight">Navigation</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Services', 'Expertise', 'Portfolio', 'Packages', 'FAQ', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="hover:text-[#B4FF39] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Key Services */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-tight">Growth Services</h4>
            <ul className="space-y-2">
              <li className="hover:text-[#B4FF39] transition-colors">Amazon & Flipkart Management</li>
              <li className="hover:text-[#B4FF39] transition-colors">Google Ads & PPC Campaigns</li>
              <li className="hover:text-[#B4FF39] transition-colors">Meta Ads (Facebook & Instagram)</li>
              <li className="hover:text-[#B4FF39] transition-colors">3D Product Imagery & Catalogs</li>
              <li className="hover:text-[#B4FF39] transition-colors">Social Media & Viral Content</li>
              <li className="hover:text-[#B4FF39] transition-colors">Marketplace Onboarding in 7 Days</li>
            </ul>
          </div>

          {/* Col 4: Agency Address & Leadership */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-tight">Kolkata Office</h4>
            
            <div className="space-y-2.5 text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#B4FF39] flex-shrink-0 mt-0.5" />
                <span className="text-neutral-300">{contactInfo.address}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#B4FF39] flex-shrink-0" />
                <span className="font-mono text-neutral-300">{contactInfo.phonePrimary}</span>
              </div>

              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="font-mono text-emerald-400">{contactInfo.whatsapp}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#B4FF39] flex-shrink-0" />
                <span className="font-mono text-neutral-300">{contactInfo.emailPrimary}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[#B4FF39] border border-neutral-800 text-[11px] font-semibold cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin CRM Login</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="mt-12 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500">
          <div>
            © {new Date().getFullYear()} {contactInfo.agencyName}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-neutral-400">Strategized by <strong className="text-white">{contactInfo.founderName}</strong></span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-[#B4FF39] border border-neutral-800 cursor-pointer"
              title="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
