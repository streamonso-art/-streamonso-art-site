import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { Sparkles, Eye, ArrowUpRight, X, ArrowRight, Tag, CheckCircle2 } from 'lucide-react';

interface PortfolioGalleryProps {
  gallery: GalleryItem[];
  onEnquireItem: (itemTitle: string) => void;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ gallery, onEnquireItem }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Social Media', 'E-Commerce', 'Catalog Design', 'Graphic Design', 'PPC Ads'];

  const filteredItems = activeCategory === 'All'
    ? gallery
    : gallery.filter(item => item.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 bg-[#0A0A0A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-[#B4FF39]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creative Showcase & Product Gallery</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Our Work That Drives{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B4FF39] to-emerald-400">
              Real Revenue
            </span>
          </h2>

          <p className="text-base text-neutral-300">
            Explore sample ad campaigns, high-resolution product catalogs, brand identities, and e-commerce listings managed by StreamOn.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#B4FF39] text-neutral-950 shadow-[0_0_15px_rgba(180,255,57,0.35)]'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group rounded-3xl bg-neutral-900/80 border border-neutral-800 overflow-hidden hover:border-[#B4FF39]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Image Preview Container */}
              <div className="relative h-60 w-full overflow-hidden bg-neutral-950">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />

                {/* Category Badge on Image */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-neutral-950/80 backdrop-blur-md text-[#B4FF39] border border-[#B4FF39]/30 shadow">
                    {item.category}
                  </span>
                </div>

                {/* Quick View Button */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-9 h-9 rounded-full bg-neutral-900/90 backdrop-blur-md border border-neutral-700 text-white flex items-center justify-center shadow-lg">
                    <ArrowUpRight className="w-4 h-4 text-[#B4FF39]" />
                  </div>
                </div>

                {/* Metrics Highlight Strip if present */}
                {item.metrics && (
                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="px-3 py-1.5 rounded-xl bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 text-xs font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#B4FF39]" />
                      <span>{item.metrics}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#B4FF39] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Tags & Action */}
                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.slice(0, 2).map((tag, tidx) => (
                      <span key={tidx} className="text-[10px] px-2 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-800">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs font-semibold text-[#B4FF39] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    View Details
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Item Details Lightbox / Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-neutral-900 border border-neutral-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950/80">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#B4FF39]/10 text-[#B4FF39] border border-[#B4FF39]/30">
                  {selectedItem.category}
                </span>
                <span className="text-xs text-neutral-400">StreamOn Showcase</span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="overflow-y-auto p-6 space-y-6">
              <div className="rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 max-h-72">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-extrabold text-white">
                  {selectedItem.title}
                </h3>
                
                {selectedItem.metrics && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Key Outcome: {selectedItem.metrics}</span>
                  </div>
                )}

                <p className="text-sm text-neutral-300 leading-relaxed pt-2">
                  {selectedItem.description}
                </p>
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-neutral-800">
                <div className="text-xs text-neutral-400 font-semibold mb-2">Service Keywords & Deliverables:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((t, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-neutral-950 text-xs text-neutral-300 border border-neutral-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="p-5 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between gap-4">
              <div className="text-xs text-neutral-400">
                Want similar results for your business?
              </div>
              <button
                onClick={() => {
                  const title = selectedItem.title;
                  setSelectedItem(null);
                  onEnquireItem(title);
                }}
                className="px-6 py-3 rounded-full bg-[#B4FF39] text-neutral-950 text-xs font-bold hover:bg-[#c4ff5e] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Enquire For This Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
