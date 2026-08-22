import React, { useState } from 'react';
import { Check, Sparkles, Zap, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface PricingPackagesProps {
  onSelectPackage: (packageName: string) => void;
}

export const PricingPackages: React.FC<PricingPackagesProps> = ({ onSelectPackage }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>('monthly');

  const packages = [
    {
      id: 'starter',
      name: 'Launchpad Starter',
      subtitle: 'Best for local brands & new marketplace sellers.',
      priceMonthly: '₹14,999',
      priceQuarterly: '₹39,999',
      period: '/ month',
      badge: 'Fast Launch',
      features: [
        'Single Marketplace Setup (Amazon OR Flipkart)',
        'Basic Social Media Management (12 Posts/Mo)',
        'Keyword & Competitor Discovery',
        'Standard 2D Catalog Setup (Up to 15 SKUs)',
        'Monthly ROI Performance Review',
        'Direct WhatsApp Chat Support'
      ],
      popular: false,
      accent: 'border-neutral-800'
    },
    {
      id: 'growth',
      name: 'Growth Accelerator',
      subtitle: 'Engineered for scaling D2C brands & retail businesses.',
      priceMonthly: '₹29,999',
      priceQuarterly: '₹79,999',
      period: '/ month',
      badge: 'Most Popular',
      features: [
        'Multi-Marketplace (Amazon + Flipkart + Myntra)',
        'Full Social Media Management (20 Posts + 6 Reels)',
        'Google & Meta Ads PPC Campaign Management',
        'Enhanced Brand Content (A+ Listing & Storefront)',
        '2D & 3D High-Res Product Imagery',
        'Weekly Ad Optimization & Negative Keyword Pruning',
        'Dedicated Senior Account Strategist (Somnath Banerjee)'
      ],
      popular: true,
      accent: 'border-[#B4FF39]'
    },
    {
      id: 'highpower',
      name: 'High Power Domination',
      subtitle: 'Full spectrum omnichannel enterprise domination.',
      priceMonthly: '₹54,999',
      priceQuarterly: '₹1,44,999',
      period: '/ month',
      badge: 'Omnichannel',
      features: [
        'Complete Omnichannel Suite (All Marketplaces + Web)',
        'Daily Social Media Content & Viral Video Engine',
        'High-Scale PPC Management (Zero Wasted Spend Protocol)',
        'Complete 3D Lookbook & Catalog Designing (50+ SKUs)',
        'Dynamic Retargeting & Email Automation Funnels',
        'Daily Real-Time Campaign Monitoring (Always On)',
        'Priority 24/7 Phone & In-Person Strategic Reviews'
      ],
      popular: false,
      accent: 'border-neutral-800'
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-[#0D0D0D] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-[#B4FF39]">
            <Zap className="w-3.5 h-3.5" />
            <span>Transparent Investment Plans</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Predictable Pricing.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B4FF39] to-emerald-400">
              Unstoppable Growth.
            </span>
          </h2>

          <p className="text-base text-neutral-300">
            Choose the growth blueprint that matches your business stage. No hidden setup fees, cancel or upgrade anytime.
          </p>

          {/* Billing Switch */}
          <div className="inline-flex items-center p-1 rounded-full bg-neutral-900 border border-neutral-800 mt-4">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Monthly Retainer
            </button>
            <button
              onClick={() => setBillingCycle('quarterly')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'quarterly'
                  ? 'bg-[#B4FF39] text-neutral-950 shadow-[0_0_15px_rgba(180,255,57,0.3)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Quarterly (90-Day Blueprint)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-950/20 font-extrabold">Save 15%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => {
            const currentPrice = billingCycle === 'monthly' ? pkg.priceMonthly : pkg.priceQuarterly;
            const currentPeriod = billingCycle === 'monthly' ? '/ month' : '/ quarter';

            return (
              <div
                key={pkg.id}
                className={`rounded-3xl bg-neutral-900/90 border ${
                  pkg.popular ? 'border-[#B4FF39] shadow-[0_0_30px_rgba(180,255,57,0.15)] ring-1 ring-[#B4FF39]' : 'border-neutral-800'
                } p-8 flex flex-col justify-between relative transition-all duration-300 hover:border-neutral-700 hover:shadow-2xl`}
              >
                {/* Popular Pill */}
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#B4FF39] text-neutral-950 font-extrabold text-[11px] uppercase tracking-wider shadow">
                    {pkg.badge}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Package Title */}
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-extrabold text-white">{pkg.name}</h3>
                      {!pkg.popular && (
                        <span className="px-2.5 py-0.5 rounded-md bg-neutral-950 text-neutral-400 text-[10px] font-mono border border-neutral-800">
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">{pkg.subtitle}</p>
                  </div>

                  {/* Price Display */}
                  <div className="pb-6 border-b border-neutral-800">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-black text-white font-mono">{currentPrice}</span>
                      <span className="text-xs text-neutral-400">{currentPeriod}</span>
                    </div>
                    <p className="text-[11px] text-[#B4FF39] mt-1 font-medium">Includes dedicated reporting & monitoring</p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">What's Included:</div>
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                        <div className="w-4 h-4 rounded-full bg-[#B4FF39]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-[#B4FF39]" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="mt-8 pt-6 border-t border-neutral-800">
                  <button
                    onClick={() => onSelectPackage(`${pkg.name} (${billingCycle})`)}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      pkg.popular
                        ? 'bg-[#B4FF39] text-neutral-950 hover:bg-[#c4ff5e] shadow-lg'
                        : 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700'
                    }`}
                  >
                    <span>Get Started with {pkg.name.split(' ')[0]}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Quote Notice */}
        <div className="mt-12 p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#B4FF39] flex-shrink-0" />
            <div>
              <div className="text-sm font-bold text-white">Need a custom tailored package for your exact business requirements?</div>
              <div className="text-xs text-neutral-400">We create bespoke arrangements for high-SKU cataloging, enterprise ad accounts, and seasonal launches.</div>
            </div>
          </div>
          <button
            onClick={() => onSelectPackage('Custom Tailored Enterprise Plan')}
            className="px-6 py-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold whitespace-nowrap transition-all border border-neutral-700 cursor-pointer"
          >
            Request Custom Scope
          </button>
        </div>

      </div>
    </section>
  );
};
