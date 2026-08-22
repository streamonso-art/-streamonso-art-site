import React, { useState } from 'react';
import { FAQItem } from '../types';
import { HelpCircle, ChevronDown, Search, MessageSquare, Sparkles } from 'lucide-react';

interface FaqSectionProps {
  faqs: FAQItem[];
  whatsappNumber: string;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs, whatsappNumber }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-2': false
  });

  const categories = ['All', 'E-Commerce', 'Social Media', 'PPC & Ads', 'Catalog & Design', 'General'];

  const toggleFaq = (id: string) => {
    setOpenIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFaqs = faqs.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faq" className="py-24 bg-[#0A0A0A] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-[#B4FF39]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Digital Marketing & E-Commerce{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B4FF39] to-emerald-400">
              FAQs
            </span>
          </h2>

          <p className="text-base text-neutral-300">
            Got questions about onboarding, PPC ad returns, 3D cataloging, or monthly deliverables? We've got clear answers.
          </p>

          {/* Live Search & Filter Box */}
          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. Amazon, ROAS, 3D catalog)..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-neutral-900 border border-neutral-800 focus:border-[#B4FF39] text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#B4FF39] text-neutral-950 shadow-[0_0_10px_rgba(180,255,57,0.3)]'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 rounded-3xl bg-neutral-900/40 border border-neutral-800 text-neutral-400 text-sm">
              No matching questions found for "{searchQuery}". Connect with us directly on WhatsApp!
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = !!openIds[faq.id];
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-neutral-900 border-[#B4FF39]/40 shadow-lg'
                      : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-950 text-neutral-400 border border-neutral-800">
                        {faq.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {faq.question}
                      </h3>
                    </div>

                    <div className={`w-8 h-8 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#B4FF39] border-[#B4FF39]/40' : 'text-neutral-400'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-neutral-800/80 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* WhatsApp Quick Help CTA */}
        <div className="mt-12 p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Have a specific question not covered here?</h4>
            <p className="text-xs text-neutral-400">Speak directly with founder Somnath Banerjee on WhatsApp for immediate guidance.</p>
          </div>
          <a
            href={`https://wa.me/91${whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi%20Somnath,%20I%20have%20a%20question%20about%20StreamOn%20services`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask on WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
