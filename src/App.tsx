import React, { useState, useEffect } from 'react';
import {
  ContactInfo,
  BlogPost,
  FAQItem,
  GalleryItem,
  ServiceItem,
  Lead
} from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MarqueeTicker } from './components/MarqueeTicker';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ExpertiseBanners } from './components/ExpertiseBanners';
import { PortfolioGallery } from './components/PortfolioGallery';
import { PricingPackages } from './components/PricingPackages';
import { FaqSection } from './components/FaqSection';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { MessageSquare, Phone, ShieldCheck, ArrowUp } from 'lucide-react';

// Fallback initial data ensuring zero visual delay
const defaultContactInfo: ContactInfo = {
  agencyName: 'StreamOn - Digital Marketing Agency',
  tagline: 'Your Brand, Always On',
  slogan: 'Switch your business to HIGH POWER. Your growth partner for social media & e-commerce brands.',
  address: '1/87, Mahajati Nagar, Block-1, North Dumdum, Birati, Kolkata - 700051',
  phonePrimary: '+91 9674961613',
  phoneSecondary: '+91 9382361426',
  whatsapp: '7278901223',
  emailPrimary: 'streamon.dm@gmail.com',
  emailSecondary: 'streamon.so@gmail.com',
  founderName: 'Somnath Banerjee',
  founderRole: 'Founder & Digital Growth Strategist',
  businessHours: 'Mon - Sat: 9:30 AM - 8:30 PM (24/7 Digital Monitoring)'
};

const defaultServices: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Social Media Management',
    subtitle: 'Brand Strategy, Viral Reels & Audience Engagement',
    description: 'We craft high-impact social media narratives across Instagram, Facebook, and LinkedIn with continuous trend tracking.',
    iconName: 'Share2',
    badge: 'Popular',
    features: [
      'Custom Content Calendars & Daily Postings',
      'Viral Short-Form Reels & Story Campaigns',
      'Audience Engagement & Community Management',
      'Influencer Collaboration Strategy'
    ],
    platforms: ['Instagram', 'Facebook', 'LinkedIn', 'YouTube']
  },
  {
    id: 'srv-2',
    title: 'E-Commerce Account Management',
    subtitle: 'Amazon, Flipkart, Myntra & Meesho Store Scaling',
    description: 'Comprehensive seller central operations including A+ content, buy-box protection, sponsored ads, and inventory health.',
    iconName: 'ShoppingCart',
    badge: 'Core Expertise',
    features: [
      'Seller Account Setup & Brand Registry',
      'A+ Enhanced Brand Content & Storefront Design',
      'Sponsored Product & Brand Video Ads (PPC)',
      'Product Listing & SKU Optimization (50+ SKUs)'
    ],
    platforms: ['Amazon', 'Flipkart', 'Myntra', 'Meesho']
  },
  {
    id: 'srv-3',
    title: 'Google & Meta Ads PPC Domination',
    subtitle: 'High ROAS Paid Campaigns with Zero Wasted Spend',
    description: 'Laser-focused intent capture on Google Search and viral demand generation on Meta with precision retargeting.',
    iconName: 'TrendingUp',
    badge: 'High ROAS',
    features: [
      'Google Top-of-Search Keyword Targeting',
      'Laser-Focused Meta Demographics & Lookalikes',
      'Dynamic Cart Abandonment Retargeting',
      'Real-Time Conversion Tracking & A/B Split Testing'
    ],
    platforms: ['Google Ads', 'Meta Ads', 'YouTube Ads']
  },
  {
    id: 'srv-4',
    title: 'Catalog Designing & 3D Imagery',
    subtitle: '2D & 3D High-Resolution Product Renders',
    description: 'Transform raw products into ultra-crisp 3D photorealistic digital assets and structured digital catalogs that convert.',
    iconName: 'Palette',
    badge: 'Special Offer: 20% OFF',
    features: [
      '3D Photorealistic Product Modeling & Renders',
      'Multi-Angle Studio Quality Catalog Layouts',
      'SEO-Optimized Technical Spec Copywriting',
      'Print-Ready & Digital Lookbook Formats'
    ],
    platforms: ['E-Commerce', 'Print Lookbook', 'PDF Catalogs']
  },
  {
    id: 'srv-5',
    title: 'Marketplace Onboarding: Zero to Live',
    subtitle: 'Fast-Track Seller Launch in 7 Days',
    description: 'We handle GST validation, trademark documentation, category approvals, and initial inventory sync seamlessly.',
    iconName: 'Rocket',
    badge: '7-Day Launch',
    features: [
      'Complete Documentation & Verification Support',
      'Category Ungating & Brand Authorization',
      'Initial 20-50 Product Catalog Upload',
      'Launch PPC Campaign Kickoff'
    ],
    platforms: ['Amazon', 'Flipkart', 'Meesho', 'JioMart']
  },
  {
    id: 'srv-6',
    title: 'AI Video & Dynamic Motion Design',
    subtitle: 'Scroll-Stopping Commercials & Animated Ads',
    description: 'AI-assisted video editing and motion graphics that boost click-through rates (CTR) by over 250% on paid social channels.',
    iconName: 'Video',
    badge: 'New Innovation',
    features: [
      'Short-Form Video Hooks & Dynamic Captions',
      'Product Motion Graphics & UGC Mashups',
      'Multi-Format Deliverables (9:16, 1:1, 16:9)',
      'High-Speed Creative Iterations'
    ],
    platforms: ['Instagram Reels', 'YouTube Shorts', 'Meta Ads']
  }
];

export default function App() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [leadsCount, setLeadsCount] = useState<number>(0);
  
  // UI state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedServicePreset, setSelectedServicePreset] = useState<string>('');

  // Fetch all CMS content from backend
  const loadContent = async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        if (data.contactInfo) setContactInfo(data.contactInfo);
        if (data.services && data.services.length) setServices(data.services);
        if (data.blogPosts && data.blogPosts.length) setBlogPosts(data.blogPosts);
        if (data.faqs && data.faqs.length) setFaqs(data.faqs);
        if (data.gallery && data.gallery.length) setGallery(data.gallery);
      }
    } catch (err) {
      console.error('Error fetching CMS content:', err);
    }
  };

  // Fetch leads count for admin badge
  const loadLeadsCount = async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        const unread = data.filter((l: Lead) => l.status === 'new').length;
        setLeadsCount(unread);
      }
    } catch (err) {
      console.error('Error checking leads count:', err);
    }
  };

  useEffect(() => {
    loadContent();
    loadLeadsCount();
  }, []);

  const scrollToContact = (servicePreset?: string) => {
    if (servicePreset) {
      setSelectedServicePreset(servicePreset);
    }
    const element = document.getElementById('contact');
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
    <div className="min-h-screen bg-[#070707] text-white flex flex-col selection:bg-[#B4FF39] selection:text-neutral-950">
      
      {/* Top Main Navbar */}
      <Navbar
        contactInfo={contactInfo}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeLeadsCount={leadsCount}
      />

      {/* Main Public Website Sections */}
      <main className="flex-1">
        
        {/* Hero Section with Live Stats */}
        <HeroSection
          contactInfo={contactInfo}
          onBookCall={() => scrollToContact('General Strategy Call')}
        />

        {/* Endless Marquee Ticker */}
        <MarqueeTicker />

        {/* About Section: Founder Somnath Banerjee & 4 Growth Pillars */}
        <AboutSection
          contactInfo={contactInfo}
          onContactClick={() => scrollToContact('Consultation with Somnath Banerjee')}
        />

        {/* Full Spectrum Services */}
        <ServicesSection
          services={services}
          onSelectService={(serviceName) => scrollToContact(serviceName)}
        />

        {/* Expertise Banners (Stop Scrolling. Start Selling / 90 Days / 20% OFF) */}
        <ExpertiseBanners
          onSelectAction={(topic) => scrollToContact(topic)}
        />

        {/* Product Gallery & Work Showcase */}
        <PortfolioGallery
          gallery={gallery}
          onEnquireItem={(itemTitle) => scrollToContact(`Work Showcase: ${itemTitle}`)}
        />

        {/* Growth Pricing Packages */}
        <PricingPackages
          onSelectPackage={(pkgName) => scrollToContact(`Package: ${pkgName}`)}
        />

        {/* Digital Marketing FAQs */}
        <FaqSection
          faqs={faqs}
          whatsappNumber={contactInfo.whatsapp}
        />

        {/* In-Page Blog Articles & Guides */}
        <BlogSection
          blogPosts={blogPosts}
          onConsultAfterReading={(topic) => scrollToContact(`Blog Insight: ${topic}`)}
        />

        {/* Contact Form & Office Information */}
        <ContactSection
          contactInfo={contactInfo}
          selectedServicePreset={selectedServicePreset}
          onLeadSubmitted={() => {
            loadLeadsCount();
          }}
        />

      </main>

      {/* Footer with Full Address and Direct Links */}
      <Footer
        contactInfo={contactInfo}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating WhatsApp Action Button */}
      <aside
        id="floating-whatsapp-widget"
        aria-label="Direct WhatsApp Contact"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2"
      >
        <a
          href={`https://wa.me/91${contactInfo.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20StreamOn,%20I%20would%20like%20to%20discuss%20a%20project`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-2xl hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all cursor-pointer"
          title="Chat with Somnath on WhatsApp"
        >
          <MessageSquare className="w-4 h-4 fill-neutral-950" />
          <span className="hidden sm:inline">WhatsApp Us (24/7)</span>
        </a>
      </aside>

      {/* Admin Dashboard Overlay Modal */}
      {isAdminOpen && (
        <AdminDashboard
          onClose={() => {
            setIsAdminOpen(false);
            loadContent();
            loadLeadsCount();
          }}
          contactInfo={contactInfo}
          onUpdateContactInfo={(updated) => setContactInfo(updated)}
          blogPosts={blogPosts}
          onUpdateBlogPosts={(updated) => setBlogPosts(updated)}
          faqs={faqs}
          onUpdateFaqs={(updated) => setFaqs(updated)}
          gallery={gallery}
          onUpdateGallery={(updated) => setGallery(updated)}
        />
      )}

    </div>
  );
}
