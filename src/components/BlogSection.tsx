import React, { useState } from 'react';
import { BlogPost } from '../types';
import { BookOpen, Clock, Calendar, ArrowRight, User, X, Sparkles, Share2 } from 'lucide-react';

interface BlogSectionProps {
  blogPosts: BlogPost[];
  onConsultAfterReading: (topic: string) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ blogPosts, onConsultAfterReading }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <section id="blog" className="py-24 bg-[#0D0D0D] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-[#B4FF39]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Digital Growth Insights</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Strategies, Case Studies &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B4FF39] to-emerald-400">
              Agency Blueprints
            </span>
          </h2>

          <p className="text-base text-neutral-300">
            Actionable playbooks on scaling Amazon storefronts, lowering PPC cost-per-click, and creating high-converting catalog assets.
          </p>
        </div>

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group rounded-3xl bg-neutral-900/80 border border-neutral-800 overflow-hidden hover:border-[#B4FF39]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Cover Image */}
              <div className="relative h-52 w-full overflow-hidden bg-neutral-950">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                
                {/* Category Pill */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-neutral-950/80 backdrop-blur-md text-[#B4FF39] border border-[#B4FF39]/30 shadow">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#B4FF39] transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                {/* Author & Read More */}
                <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] text-neutral-300 font-bold">
                      {post.author[0]}
                    </div>
                    <span className="text-xs text-neutral-300 font-medium">{post.author}</span>
                  </div>

                  <span className="text-xs font-semibold text-[#B4FF39] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Full Article Reader Lightbox Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-3xl bg-neutral-900 border border-neutral-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950/90">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#B4FF39]/10 text-[#B4FF39] border border-[#B4FF39]/30">
                  {selectedPost.category}
                </span>
                <span className="text-xs text-neutral-400">{selectedPost.readTime}</span>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Article Content */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {selectedPost.title}
              </h2>

              <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#B4FF39]" />
                  <span className="text-white font-semibold">{selectedPost.author}</span>
                  <span>•</span>
                  <span>Published on {selectedPost.publishedAt}</span>
                </div>
              </div>

              {/* Cover Image Banner */}
              <div className="rounded-2xl overflow-hidden max-h-72 border border-neutral-800">
                <img
                  src={selectedPost.coverImage}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Markdown / Formatted Text Content */}
              <div className="prose prose-invert max-w-none text-neutral-300 text-sm leading-relaxed space-y-4">
                {selectedPost.content.split('\n\n').map((paragraph, pidx) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h4 key={pidx} className="text-lg font-bold text-white text-[#B4FF39] pt-2">
                        {paragraph.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (paragraph.startsWith('- ')) {
                    return (
                      <ul key={pidx} className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-neutral-300">
                        {paragraph.split('\n').map((li, lidx) => (
                          <li key={lidx}>{li.replace('- ', '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (paragraph.match(/^\d+\./)) {
                    return (
                      <ol key={pidx} className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-neutral-300">
                        {paragraph.split('\n').map((li, lidx) => (
                          <li key={lidx}>{li.replace(/^\d+\.\s*/, '')}</li>
                        ))}
                      </ol>
                    );
                  }
                  return (
                    <p key={pidx} className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-neutral-800 flex flex-wrap gap-2">
                {selectedPost.tags.map((t, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-neutral-950 text-xs text-neutral-400 border border-neutral-800">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="p-5 border-t border-neutral-800 bg-neutral-950/90 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-neutral-400 text-center sm:text-left">
                Need help implementing these strategies for your business?
              </div>
              <button
                onClick={() => {
                  const title = selectedPost.title;
                  setSelectedPost(null);
                  onConsultAfterReading(title);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#B4FF39] text-neutral-950 text-xs font-bold hover:bg-[#c4ff5e] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Book Strategy Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
