import React, { useState } from 'react';
import { ContactInfo } from '../types';
import { Phone, Mail, MapPin, MessageSquare, Clock, Send, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface ContactSectionProps {
  contactInfo: ContactInfo;
  selectedServicePreset?: string;
  onLeadSubmitted?: (lead: any) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  contactInfo,
  selectedServicePreset = '',
  onLeadSubmitted
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceInterested: selectedServicePreset || 'E-Commerce Account Management',
    budgetRange: '₹20,000 - ₹50,000 / month',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Synchronize when selectedServicePreset changes
  React.useEffect(() => {
    if (selectedServicePreset) {
      setFormData(prev => ({
        ...prev,
        serviceInterested: selectedServicePreset,
        message: prev.message || `Hi StreamOn team, I am interested in discussing "${selectedServicePreset}" for our brand.`
      }));
    }
  }, [selectedServicePreset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const nowIso = new Date().toISOString();
      const leadPayload = {
        id: leadId,
        ...formData,
        status: 'new',
        sourcePage: 'Website Contact Page',
        createdAt: nowIso,
        updatedAt: nowIso
      };

      // 1. Write to Firestore directly
      try {
        await setDoc(doc(db, 'leads', leadId), leadPayload);
      } catch (firestoreErr) {
        console.warn('Firestore direct write note:', firestoreErr);
      }

      // 2. Also send to Express backend for email/file persistence
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      });

      const data = await res.json().catch(() => ({}));
      
      setSubmitted(true);
      if (onLeadSubmitted) {
        onLeadSubmitted(data.lead || leadPayload);
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMsg(err.message || 'Something went wrong. Please call or WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  };

  const servicesList = [
    'E-Commerce Account Management (Amazon/Flipkart/Myntra)',
    'Social Media Management & Viral Reels',
    'Google & Meta Ads PPC Domination',
    'Creative Graphic Design & Brand Identity',
    'Catalog Designing & 3D Product Imagery',
    'Marketplace Onboarding: Zero to Live',
    'AI Video & Dynamic Motion Design',
    '90-Day Brand Acceleration Plan',
    'Other / Custom Scope'
  ];

  const budgetRanges = [
    '₹10,000 - ₹20,000 / month',
    '₹20,000 - ₹50,000 / month',
    '₹50,000 - ₹1,00,000 / month',
    '₹1,00,000+ / month (Enterprise)',
    'One-Time Project / Catalog Design',
    'Flexible / Seeking Consultation'
  ];

  return (
    <section id="contact" className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#B4FF39]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-[#B4FF39]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready to Grow Your Brand?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Book Your Free{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B4FF39] to-emerald-400">
              Growth Strategy Call
            </span>
          </h2>

          <p className="text-base text-neutral-300">
            Tell us about your brand goals. Our senior strategists will analyze your niche and share a tailored 90-day action plan within 2 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact Info & Agency Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
              <div>
                <h3 className="text-2xl font-black text-white">{contactInfo.agencyName}</h3>
                <p className="text-xs font-bold text-[#B4FF39] mt-1">{contactInfo.tagline}</p>
                <p className="text-xs text-neutral-400 mt-2 italic">
                  "{contactInfo.slogan}"
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-neutral-800 text-xs sm:text-sm text-neutral-300">
                {/* Physical Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#B4FF39]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Agency Headquarters</div>
                    <div className="text-neutral-200 mt-0.5 font-medium leading-relaxed">{contactInfo.address}</div>
                  </div>
                </div>

                {/* Primary Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-[#B4FF39]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Direct Phone Calls</div>
                    <div className="flex flex-wrap gap-2 mt-0.5 font-mono">
                      <a href={`tel:${contactInfo.phonePrimary}`} className="text-white hover:text-[#B4FF39] underline font-bold">
                        {contactInfo.phonePrimary}
                      </a>
                      <span className="text-neutral-500">|</span>
                      <a href={`tel:${contactInfo.phoneSecondary}`} className="text-white hover:text-[#B4FF39] underline">
                        {contactInfo.phoneSecondary}
                      </a>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Chat */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">WhatsApp Instant Connect</div>
                    <div className="mt-0.5">
                      <a
                        href={`https://wa.me/91${contactInfo.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20StreamOn,%20I%20want%20to%20discuss%20digital%20marketing%20for%20my%20business`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-white hover:text-emerald-400 font-bold font-mono"
                      >
                        <span>{contactInfo.whatsapp}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email Addresses */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-[#B4FF39]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Official Email Contacts</div>
                    <div className="flex flex-col mt-0.5 font-mono text-xs">
                      <a href={`mailto:${contactInfo.emailPrimary}`} className="text-neutral-200 hover:text-[#B4FF39]">
                        {contactInfo.emailPrimary}
                      </a>
                      <a href={`mailto:${contactInfo.emailSecondary}`} className="text-neutral-400 hover:text-[#B4FF39]">
                        {contactInfo.emailSecondary}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-[#B4FF39]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Operations & Support</div>
                    <div className="text-neutral-300 mt-0.5">{contactInfo.businessHours}</div>
                  </div>
                </div>
              </div>

              {/* Founder Signature Note */}
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">{contactInfo.founderName}</div>
                  <div className="text-[11px] text-[#B4FF39]">{contactInfo.founderRole}</div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded bg-[#B4FF39]/10 text-[#B4FF39] border border-[#B4FF39]/30 font-bold">
                  24/7 Monitored
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Lead Capture Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-6 sm:p-10 shadow-2xl relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B4FF39] to-transparent rounded-t-3xl" />

              {submitted ? (
                <div className="py-12 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-extrabold text-white">Enquiry Received Successfully!</h3>
                    <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                      Thank you <strong className="text-white">{formData.name}</strong>. Founder Somnath Banerjee & our digital growth team are reviewing your project details.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 max-w-md mx-auto text-xs text-neutral-400 text-left space-y-1">
                    <div><span className="text-neutral-500">Service:</span> <strong className="text-neutral-200">{formData.serviceInterested}</strong></div>
                    <div><span className="text-neutral-500">Contact Phone:</span> <strong className="text-neutral-200">{formData.phone}</strong></div>
                    <div><span className="text-neutral-500">Target Budget:</span> <strong className="text-neutral-200">{formData.budgetRange}</strong></div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/91${contactInfo.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20Somnath,%20I%20just%20submitted%20a%20lead%20form%20for%20${encodeURIComponent(formData.serviceInterested)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-full bg-emerald-500 text-neutral-950 text-xs font-bold hover:bg-emerald-400 transition-all flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Continue Conversation on WhatsApp</span>
                    </a>

                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          company: '',
                          serviceInterested: 'E-Commerce Account Management',
                          budgetRange: '₹20,000 - ₹50,000 / month',
                          message: ''
                        });
                      }}
                      className="px-5 py-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">Send Us Your Growth Requirements</h3>
                    <p className="text-xs text-neutral-400">Fill in the details below and we will prepare a custom proposal.</p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Your Full Name <span className="text-[#B4FF39]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Somnath Banerjee"
                        className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-[#B4FF39] text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Phone Number (WhatsApp) <span className="text-[#B4FF39]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 9674961613"
                        className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-[#B4FF39] text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>

                  {/* Email & Company Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Email Address <span className="text-[#B4FF39]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="yourname@brand.com"
                        className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-[#B4FF39] text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Brand / Business Name
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Aura Lifestyle Pvt Ltd"
                        className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-[#B4FF39] text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Service Interested In & Budget Range */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Service Interested In
                      </label>
                      <select
                        value={formData.serviceInterested}
                        onChange={(e) => setFormData({ ...formData, serviceInterested: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-[#B4FF39] text-xs sm:text-sm text-white outline-none transition-colors cursor-pointer"
                      >
                        {servicesList.map((srv, idx) => (
                          <option key={idx} value={srv} className="bg-neutral-900 text-white">
                            {srv}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Target Budget Range
                      </label>
                      <select
                        value={formData.budgetRange}
                        onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-[#B4FF39] text-xs sm:text-sm text-white outline-none transition-colors cursor-pointer"
                      >
                        {budgetRanges.map((b, idx) => (
                          <option key={idx} value={b} className="bg-neutral-900 text-white">
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Tell us about your brand & growth goals
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. We want to launch 40 products on Amazon and scale monthly revenue with high ROAS Meta and Google ads..."
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-[#B4FF39] text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl bg-[#B4FF39] text-neutral-950 font-bold text-sm hover:bg-[#c4ff5e] hover:shadow-[0_0_25px_rgba(180,255,57,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Processing Enquiry...</span>
                      ) : (
                        <>
                          <span>Submit Enquiry & Get Free Strategy</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-500 pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#B4FF39]" />
                      100% Privacy Protected
                    </span>
                    <span>•</span>
                    <span>Guaranteed response in &lt; 2 Hours</span>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
