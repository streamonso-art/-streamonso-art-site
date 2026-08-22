import React, { useState, useEffect } from 'react';
import { StreamOnLogo } from './StreamOnLogo';
import { Phone, MessageCircle, ShieldCheck, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { ContactInfo } from '../types';

interface NavbarProps {
  contactInfo: ContactInfo;
  onOpenAdmin: () => void;
  activeLeadsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  contactInfo,
  onOpenAdmin,
  activeLeadsCount = 0,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Expertise', href: '#expertise' },
    { label: 'Work', href: '#portfolio' },
    { label: 'Packages', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-neutral-950/95 backdrop-blur-md border-b border-white/10 shadow-2xl py-3'
          : 'bg-gradient-to-b from-neutral-950/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="cursor-pointer group">
          <StreamOnLogo variant="dark" size="sm" showTagline={true} />
        </a>

        {/* Desktop Navigation Links */}
        <nav id="desktop-navbar" className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-neutral-300 hover:text-[#B4FF39] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls & Admin Entry */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Quick WhatsApp Callout */}
          <a
            id="nav-whatsapp-btn"
            href={`https://wa.me/91${contactInfo.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20StreamOn,%20I%20would%20like%20a%20free%20consultation%20for%20my%20business`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
            title="Chat directly on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span className="hidden xl:inline">WhatsApp</span>
          </a>

          {/* Admin Panel Button */}
          <button
            id="nav-admin-panel-btn"
            onClick={onOpenAdmin}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 hover:border-neutral-500 transition-all cursor-pointer"
            title="Access StreamOn Admin CRM"
          >
            <ShieldCheck className="w-4 h-4 text-[#B4FF39]" />
            <span>Admin</span>
            {activeLeadsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#B4FF39] text-neutral-950 font-bold text-[10px] flex items-center justify-center">
                {activeLeadsCount}
              </span>
            )}
          </button>

          {/* Primary Call to Action Button */}
          <a
            id="nav-cta-btn"
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#B4FF39] text-neutral-950 hover:bg-[#c4ff5e] hover:shadow-[0_0_20px_rgba(180,255,57,0.5)] transition-all cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Mobile Menu Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-lg bg-neutral-900 text-[#B4FF39] border border-neutral-800"
            title="Admin Login"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-neutral-900 text-neutral-200 border border-neutral-800 hover:text-white"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-neutral-950 border-b border-neutral-800 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-base font-medium text-neutral-200 hover:text-[#B4FF39] py-1 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-4 border-t border-neutral-800 flex flex-col gap-3">
            <a
              href={`https://wa.me/91${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-sm font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp ({contactInfo.whatsapp})
            </a>

            <a
              href={`tel:${contactInfo.phonePrimary}`}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-neutral-900 text-neutral-200 border border-neutral-800 text-sm font-semibold"
            >
              <Phone className="w-4 h-4 text-[#B4FF39]" />
              Call {contactInfo.phonePrimary}
            </a>

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#B4FF39] text-neutral-950 font-bold text-sm shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              Book Free Strategy Call
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
