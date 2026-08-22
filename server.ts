import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Path to data file
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default database structure with authentic StreamOn brand information
const initialData = {
  leads: [
    {
      id: 'lead-1',
      name: 'Vikram Sharma',
      email: 'vikram.apparels@gmail.com',
      phone: '+91 9831098765',
      company: 'Aura Lifestyle & Garments',
      serviceInterested: 'E-Commerce Account Management',
      budgetRange: '₹30,000 - ₹50,000 / month',
      message: 'We are launching our fashion brand on Amazon & Myntra and need complete account setup, A+ catalog design, and PPC sponsored ads management.',
      status: 'In Progress',
      sourcePage: 'Home - Hero Form',
      internalNotes: 'Initial discovery call completed on Aug 15. Shared quotation for Amazon + Myntra setup. Follow-up scheduled for Tuesday.',
      createdAt: '2026-08-14T10:30:00.000Z',
      updatedAt: '2026-08-15T14:20:00.000Z'
    },
    {
      id: 'lead-2',
      name: 'Pooja Sen',
      email: 'pooja@senskincare.in',
      phone: '+91 9748234190',
      company: 'Sen Herbals & Beauty',
      serviceInterested: 'Social Media Management',
      budgetRange: '₹20,000 - ₹35,000 / month',
      message: 'Looking for continuous social media content calendar, Instagram Reels strategy, and Meta ads to drive direct shopify purchases.',
      status: 'New',
      sourcePage: 'Services - Social Media',
      internalNotes: 'New enquiry received. High intent skincare brand.',
      createdAt: '2026-08-16T04:15:00.000Z',
      updatedAt: '2026-08-16T04:15:00.000Z'
    },
    {
      id: 'lead-3',
      name: 'Debjit Mukherjee',
      email: 'debjit@mukherjeeelectronics.com',
      phone: '+91 9830112233',
      company: 'Mukherjee Electronics',
      serviceInterested: 'Catalog Designing & 3D Imagery',
      budgetRange: '₹15,000 - ₹25,000',
      message: 'Need 50+ high resolution catalog designs and 3D product imagery for our new electronic appliances range.',
      status: 'Converted',
      sourcePage: 'Portfolio',
      internalNotes: 'Advance payment received. Design team working on initial 10 catalog spreads.',
      createdAt: '2026-08-11T09:00:00.000Z',
      updatedAt: '2026-08-13T11:45:00.000Z'
    }
  ],
  contactInfo: {
    agencyName: 'StreamOn - Digital Marketing Agency',
    tagline: 'Your Brand, Always On',
    slogan: 'We don’t just manage your brand. We power it.',
    address: '1/87, Mahajati Nagar, Block-1, North Dumdum, Birati, Kolkata - 700051',
    phonePrimary: '+91 9674961613',
    phoneSecondary: '+91 9382361426',
    whatsapp: '7278901223',
    emailPrimary: 'streamon.dm@gmail.com',
    emailSecondary: 'streamon.so@gmail.com',
    businessHours: 'Monday - Saturday: 9:30 AM - 7:30 PM (24/7 Digital Monitoring)',
    founderName: 'Somnath Banerjee',
    founderRole: 'Founder & Digital Growth Strategist',
    googleMapUrl: 'https://maps.google.com/?q=Birati,+North+Dumdum,+Kolkata+700051'
  },
  faqs: [
    {
      id: 'faq-1',
      question: 'How quickly can StreamOn launch my brand on Amazon, Flipkart, and Myntra?',
      answer: 'With our streamlined "Zero to Live, Fast" onboarding protocol, we can complete seller registration, GST verification, brand approval, category authorization, and initial product cataloging in as little as 7 to 10 business days.',
      category: 'E-Commerce',
      order: 1
    },
    {
      id: 'faq-2',
      question: 'What is included in StreamOn’s Social Media Management package?',
      answer: 'Our full-spectrum social media package includes comprehensive content strategy, high-converting visual posts & video reels, caption copywriting with trending hashtags, monthly content calendars, daily audience engagement, community management, and weekly analytics performance reports.',
      category: 'Social Media',
      order: 2
    },
    {
      id: 'faq-3',
      question: 'How does StreamOn guarantee high ROI on Google Ads & Meta PPC Campaigns?',
      answer: 'We operate on a data-first framework: Top-of-Search Google intent capture + laser-focused Meta audience demographic targeting + high-converting viral-ready creatives + aggressive A/B split testing. We eliminate wasted ad spend so every single rupee drives qualified leads or direct sales.',
      category: 'PPC & Ads',
      order: 3
    },
    {
      id: 'faq-4',
      question: 'What makes your Catalog Designing & 3D Product Imagery different?',
      answer: 'We create visually arresting, conversion-optimized 2D & 3D product renders, Enhanced Brand Content (A+ Content), and interactive digital lookbooks tailored specifically for Amazon, Flipkart, Shopify, and B2B corporate presentations.',
      category: 'Catalog & Design',
      order: 4
    },
    {
      id: 'faq-5',
      question: 'Can I customize my marketing package according to my budget?',
      answer: 'Yes! While we offer popular starter, growth, and enterprise packages, we also build custom tailored service bundles to match your precise niche, stage of growth, and target ROI.',
      category: 'General',
      order: 5
    }
  ],
  blogPosts: [
    {
      id: 'blog-1',
      title: 'Build Your Brand in 90 Days: The Growth Blueprint for 2026',
      slug: 'build-brand-in-90-days-blueprint',
      excerpt: 'Discover the exact 3-phase strategic framework StreamOn uses to take emerging businesses from zero online visibility to profitable e-commerce and social dominance.',
      content: `In today’s hyper-fast digital landscape, waiting 12 months to see marketing traction is outdated. Modern brands need the 'Wow Factor' combined with agile execution.

### Phase 1: High-Power Foundations (Days 1–30)
- Brand identity, crisp logo positioning, and clear visual hierarchy.
- Complete marketplace onboarding across Amazon, Flipkart, and Shopify.
- Conversion-optimized 2D/3D product cataloging and A+ brand storefronts.

### Phase 2: Intent Capture & Traffic Surge (Days 31–60)
- Deploy high-intent Google Search PPC for immediate buyers.
- Run laser-targeted Meta Ads (Facebook & Instagram) with video creatives that stop the scroll.
- Build organic authority with weekly strategic content calendars.

### Phase 3: Scaling & Retargeting Mastery (Days 61–90)
- Implement dynamic retargeting to win back abandoned carts.
- Optimize seller account health and lower Customer Acquisition Cost (CAC).
- Double down on winning creatives with scaled budget allocation.`,
      category: 'Brand Strategy',
      readTime: '4 min read',
      publishedAt: '2026-08-10',
      author: 'Somnath Banerjee',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      tags: ['Brand Growth', 'E-Commerce', 'PPC Ads', 'Strategy'],
      isFeatured: true
    },
    {
      id: 'blog-2',
      title: 'Stop Scrolling. Start Selling: Mastering Google & Meta Ads in 2026',
      slug: 'stop-scrolling-start-selling-google-meta-ads',
      excerpt: 'Why your current ads might be burning budget and how data-driven audience segmentation turns casual scrollers into paying customers.',
      content: `Your potential customers are actively searching on Google and endlessly scrolling on Meta. If your brand isn't intercepting them with high-relevance messaging, your competitors are capturing that revenue.

### 1. Google Ads: Capturing Active Purchase Intent
When someone searches "buy custom apparel online" or "digital marketing agency in Kolkata", they are ready to buy. We position your brand directly at the top of Google search results with optimized bids.

### 2. Meta Ads: Generating Emotional Demand
Social feeds are crowded. To break through, creatives must feature scroll-stopping hooks within the first 2 seconds, clear value propositions, and low-friction call-to-actions.

### 3. Zero Wasted Spend Framework
By applying daily negative keyword pruning and real-time ROI tracking, every single advertising cent works directly for your bottom line.`,
      category: 'Paid Advertising',
      readTime: '5 min read',
      publishedAt: '2026-08-12',
      author: 'StreamOn Strategy Team',
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      tags: ['Google Ads', 'Meta Ads', 'PPC', 'Conversion Rate'],
      isFeatured: true
    },
    {
      id: 'blog-3',
      title: 'E-Commerce Cataloging & A+ Content: The Secret to 40% Higher Conversions',
      slug: 'ecommerce-cataloging-a-plus-content-conversions',
      excerpt: 'Learn how 3D product imagery, structured attribute tagging, and rich A+ brand story modules radically decrease bounce rates on Amazon & Flipkart.',
      content: `Online shoppers cannot physically touch your product. Your digital catalog is your storefront, salesperson, and brand ambassador all in one.

### The Anatomy of a High-Converting Listing
1. **High-Resolution 3D & 2D Imagery**: Multi-angle lifestyle renders that highlight dimensions and premium textures.
2. **SEO-Optimized Keyword Placement**: Naturally woven search terms in title, bullet points, and backend search terms.
3. **Enhanced Brand Content (A+)**: Comparison charts, founder stories, and infographic banners that build instant buyer trust.`,
      category: 'E-Commerce',
      readTime: '3 min read',
      publishedAt: '2026-08-14',
      author: 'Somnath Banerjee',
      coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
      tags: ['Amazon', 'Flipkart', 'A+ Content', 'Catalog Design'],
      isFeatured: false
    }
  ],
  gallery: [
    {
      id: 'gal-1',
      title: 'Stop Scrolling. Start Selling - Meta & Google Ads Campaign',
      category: 'PPC Ads',
      description: 'High-converting ad campaign creatives designed for Google search PPC & Meta social feeds featuring real-time ROI tracking.',
      imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1000&q=80',
      clientName: 'StreamOn Performance Suite',
      metrics: '3.8x ROAS • +240% Click-through Rate',
      tags: ['Google Ads', 'Meta Ads', 'PPC', 'ROI Tracking'],
      featured: true
    },
    {
      id: 'gal-2',
      title: 'E-Commerce Multi-Marketplace Onboarding & Account Management',
      category: 'E-Commerce',
      description: 'End-to-end seller onboarding, category approvals, and sponsored ads management across Amazon, Flipkart, Myntra & Meesho.',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1000&q=80',
      clientName: 'Premier Retail Brands',
      metrics: '50+ Accounts Scaled • 99.4% Account Health',
      tags: ['Amazon Seller', 'Flipkart Assured', 'Myntra', 'Meesho'],
      featured: true
    },
    {
      id: 'gal-3',
      title: 'Catalog Designing & 3D Product Imagery Suite',
      category: 'Catalog Design',
      description: 'High resolution 2D/3D product renders, structured data tagging, and rapid collection lookbook deployment.',
      imageUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1000&q=80',
      clientName: 'Apparel & Lifestyle Clients',
      metrics: '500+ SKUs Digitized • 35% Conversion Lift',
      tags: ['3D Modeling', 'A+ Content', 'Catalog Lookbook'],
      featured: true
    },
    {
      id: 'gal-4',
      title: 'Switch Your Business to High Power - Brand Identity',
      category: 'Graphic Design',
      description: 'Futuristic neon-accented brand visual identity, typography pairing, logo systems, and marketing collateral.',
      imageUrl: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=1000&q=80',
      clientName: 'StreamOn Visual Identity',
      metrics: '100% Custom Vector Design',
      tags: ['Brand Identity', 'Logos', 'UI/UX Elements'],
      featured: true
    },
    {
      id: 'gal-5',
      title: 'Social Media Management & Viral Content Engine',
      category: 'Social Media',
      description: 'Content calendar execution, Reels editing, community building, and influencer outreach programs.',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
      clientName: 'D2C Consumer Brands',
      metrics: '450k+ Impressions • 4.2x Engagement',
      tags: ['Instagram Growth', 'Reels', 'Community Building'],
      featured: true
    },
    {
      id: 'gal-6',
      title: 'Online Marketplace Onboarding: From Zero to Live, Fast',
      category: 'E-Commerce',
      description: 'Accelerated step-by-step launch system: documentation, GST setup, brand registry, product feed mapping.',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
      clientName: 'New Market Entrants',
      metrics: 'Live in 7 Days • Zero Rejection Rate',
      tags: ['Brand Registry', 'Seller Central', 'Fast Launch'],
      featured: true
    }
  ],
  services: [
    {
      id: 'srv-1',
      title: 'Social Media Management',
      subtitle: 'We turn casual followers into loyal brand advocates.',
      description: 'Strategic social media curation engineered to stop the scroll. We craft viral-ready visuals, high-engagement Reels, data-backed posting schedules, and proactive community management.',
      iconName: 'Share2',
      features: [
        'Content Strategy & Creative Production',
        'Viral Reels & Short-Form Video Editing',
        'Daily Engagement & Community Moderation',
        'Hashtag & Audience Demographic Research',
        'Weekly & Monthly ROI Analytics Reporting'
      ],
      platforms: ['Instagram', 'Facebook', 'LinkedIn', 'YouTube Shorts'],
      badge: 'Most Popular'
    },
    {
      id: 'srv-2',
      title: 'E-Commerce Account Management',
      subtitle: 'Streamlining sales, amplifying revenue across all marketplaces.',
      description: 'Complete seller account management for Amazon, Flipkart, Myntra, and Meesho. From account health management and category ungating to A+ listing optimization and sponsored ads.',
      iconName: 'ShoppingCart',
      features: [
        'Seller Account Setup & Brand Registry',
        'Account Health & Performance Monitoring',
        'Category & Brand Approvals Handling',
        'A+ Content Listing & Enhanced Brand Pages',
        'PPC Sponsored Ads & Bid Optimization'
      ],
      platforms: ['Amazon', 'Flipkart', 'Myntra', 'Meesho', 'Shopify'],
      badge: 'High Revenue'
    },
    {
      id: 'srv-3',
      title: 'Google & Meta Ads (PPC)',
      subtitle: 'Capture active intent and generate explosive demand.',
      description: 'Targeted reach for maximum return on ad spend (ROAS). We combine top-of-search Google keyword domination with laser-focused Meta demographics and retargeting.',
      iconName: 'TrendingUp',
      features: [
        'High-Intent Keyword Research & Bidding',
        'Meta Laser-Focused Audience Segments',
        'A/B Creative & Copy Testing',
        'Dynamic Retargeting for Abandoned Carts',
        'Zero Wasted Spend & Daily Budget Pruning'
      ],
      platforms: ['Google Search & Display', 'Meta (FB & IG)', 'YouTube Ads'],
      badge: 'Fast ROI'
    },
    {
      id: 'srv-4',
      title: 'Creative Graphic Design & Cataloging',
      subtitle: 'Visuals that stop the scroll and drive instant checkouts.',
      description: 'Custom brand identity, high-resolution 2D & 3D product imagery, digital product catalogs, marketing collateral, and packaging designs that convey undeniable authority.',
      iconName: 'Palette',
      features: [
        'Brand Identity, Vector Logos & Guidelines',
        '3D & 2D High-Resolution Product Imagery',
        'Custom Lookbooks & Digital Catalogs',
        'Marketing Collateral & Promotional Banners',
        '100% Custom Vector & UI/UX Elements'
      ],
      platforms: ['Print & Digital', 'E-Commerce Storefronts', 'Social Media'],
      badge: '20% OFF First Project'
    },
    {
      id: 'srv-5',
      title: 'Marketplace Onboarding: Zero to Live',
      subtitle: 'Launch your online storefront with lightning speed.',
      description: 'Comprehensive setup for manufacturers, distributors, and direct-to-consumer founders ready to launch online without technical roadblocks.',
      iconName: 'Rocket',
      features: [
        'GST & Business Documentation Verification',
        'Product Feed Mapping & Bulk Uploads',
        'Brand Trademark Authorization',
        'Logistics & Courier Integration Guidance',
        'First 30 Days Launch Support'
      ],
      platforms: ['Amazon', 'Flipkart', 'Myntra', 'Meesho', 'JioMart'],
      badge: 'Turnkey Launch'
    },
    {
      id: 'srv-6',
      title: 'AI Video & Dynamic Motion Design',
      subtitle: 'High-production visual storytelling powered by modern tech.',
      description: 'Cinematic promotional videos, AI-assisted video editing, motion graphics, and product showcase animations crafted for Instagram Ads and YouTube.',
      iconName: 'Video',
      features: [
        'AI Product Showcase Video Generation',
        'Voiceover & Audio Design',
        'Short-form Vertical Ad Creative Variations',
        'Motion Graphic Explainer Clips',
        'High-Resolution 4K Master Exports'
      ],
      platforms: ['Instagram Reels', 'TikTok', 'YouTube Ads', 'Website Hero'],
      badge: 'Next-Gen'
    }
  ]
};

// Database helper functions
function loadData() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading db.json, using defaults:', err);
  }
  // If db file doesn't exist, write defaults
  saveData(initialData);
  return initialData;
}

function saveData(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving db.json:', err);
  }
}

// Lazy Gemini API client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    try {
      genAIClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn('Gemini client initialization skipped or failed:', e);
    }
  }
  return genAIClient;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', agency: 'StreamOn - Digital Marketing Agency', timestamp: new Date().toISOString() });
});

// 2. Public Site Content (Contact Info, FAQs, Blog Posts, Gallery, Services)
app.get('/api/content', (req, res) => {
  const db = loadData();
  res.json({
    contactInfo: db.contactInfo || initialData.contactInfo,
    faqs: db.faqs || initialData.faqs,
    blogPosts: db.blogPosts || initialData.blogPosts,
    gallery: db.gallery || initialData.gallery,
    services: db.services || initialData.services
  });
});

// 3. Leads API - Capture enquiry form submission
app.post('/api/leads', (req, res) => {
  try {
    const { name, email, phone, company, serviceInterested, budgetRange, message, sourcePage } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone number are required.' });
    }

    const db = loadData();
    const newLead = {
      id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: (company || '').trim(),
      serviceInterested: serviceInterested || 'General Digital Marketing',
      budgetRange: budgetRange || 'Flexible',
      message: (message || '').trim(),
      status: 'New',
      sourcePage: sourcePage || 'Website Form',
      internalNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.leads = [newLead, ...(db.leads || [])];
    saveData(db);

    console.log(`[New Lead Captured] ${newLead.name} (${newLead.phone}) for ${newLead.serviceInterested}`);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your enquiry has been received. Our senior marketing consultant will contact you within 2 hours.',
      lead: newLead
    });
  } catch (err: any) {
    console.error('Error saving lead:', err);
    res.status(500).json({ error: 'Failed to submit enquiry. Please try calling directly or WhatsApp.' });
  }
});

// 4. Admin Authentication
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  // Default master credentials with easy testing
  if ((username === 'admin' || username === 'streamon') && (password === 'streamon2026' || password === 'admin123' || password === 'streamon')) {
    const token = 'streamon_jwt_session_' + Date.now();
    return res.json({
      success: true,
      token,
      user: {
        username: 'admin',
        name: 'Somnath Banerjee (Admin)',
        role: 'Super Admin',
        agency: 'StreamOn - Digital Marketing Agency'
      }
    });
  }
  return res.status(401).json({ error: 'Invalid admin credentials. Use admin / streamon2026' });
});

// 5. Admin Leads Management
app.get('/api/leads', (req, res) => {
  const db = loadData();
  const leads = db.leads || [];
  res.json(leads);
});

app.put('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  const { status, internalNotes, lastContactedAt } = req.body;
  const db = loadData();
  const index = (db.leads || []).findIndex((l: any) => l.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Lead not found' });
  }

  db.leads[index] = {
    ...db.leads[index],
    ...(status && { status }),
    ...(internalNotes !== undefined && { internalNotes }),
    ...(lastContactedAt && { lastContactedAt }),
    updatedAt: new Date().toISOString()
  };

  saveData(db);
  res.json({ success: true, lead: db.leads[index] });
});

app.delete('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  const db = loadData();
  const initialLength = (db.leads || []).length;
  db.leads = (db.leads || []).filter((l: any) => l.id !== id);

  if (db.leads.length === initialLength) {
    return res.status(404).json({ error: 'Lead not found' });
  }

  saveData(db);
  res.json({ success: true, message: 'Lead deleted successfully' });
});

// Export Leads to CSV
app.get('/api/leads/export/csv', (req, res) => {
  const db = loadData();
  const leads = db.leads || [];

  const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Budget', 'Status', 'Created At', 'Message', 'Notes'];
  const rows = leads.map((l: any) => [
    `"${l.id}"`,
    `"${(l.name || '').replace(/"/g, '""')}"`,
    `"${(l.email || '').replace(/"/g, '""')}"`,
    `"${(l.phone || '').replace(/"/g, '""')}"`,
    `"${(l.company || '').replace(/"/g, '""')}"`,
    `"${(l.serviceInterested || '').replace(/"/g, '""')}"`,
    `"${(l.budgetRange || '').replace(/"/g, '""')}"`,
    `"${(l.status || '').replace(/"/g, '""')}"`,
    `"${l.createdAt || ''}"`,
    `"${(l.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    `"${(l.internalNotes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="streamon_leads_${new Date().toISOString().split('T')[0]}.csv"`);
  res.send(csvContent);
});

// 6. Admin Content Customization Endpoints
// A. Update Contact Information
const updateContactHandler = (req: any, res: any) => {
  const db = loadData();
  db.contactInfo = {
    ...db.contactInfo,
    ...req.body
  };
  saveData(db);
  res.json({ success: true, contactInfo: db.contactInfo });
};

app.put('/api/content/contact', updateContactHandler);
app.post('/api/content/contact', updateContactHandler);
app.put('/api/contact-info', updateContactHandler);
app.post('/api/contact-info', updateContactHandler);

// B. FAQ Management
app.post('/api/content/faqs', (req, res) => {
  const { question, answer, category, order } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ error: 'Question and answer are required.' });
  }

  const db = loadData();
  const newFaq = {
    id: 'faq-' + Date.now(),
    question: question.trim(),
    answer: answer.trim(),
    category: category || 'General',
    order: order || (db.faqs?.length || 0) + 1
  };

  db.faqs = [...(db.faqs || []), newFaq];
  saveData(db);
  res.status(201).json({ success: true, faq: newFaq });
});

app.put('/api/content/faqs/:id', (req, res) => {
  const { id } = req.params;
  const db = loadData();
  const index = (db.faqs || []).findIndex((f: any) => f.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'FAQ not found' });
  }

  db.faqs[index] = {
    ...db.faqs[index],
    ...req.body
  };

  saveData(db);
  res.json({ success: true, faq: db.faqs[index] });
});

app.delete('/api/content/faqs/:id', (req, res) => {
  const { id } = req.params;
  const db = loadData();
  db.faqs = (db.faqs || []).filter((f: any) => f.id !== id);
  saveData(db);
  res.json({ success: true, message: 'FAQ deleted' });
});

// C. Blog Post Management
app.post('/api/content/blogs', (req, res) => {
  const { title, excerpt, content, category, readTime, author, coverImage, tags, isFeatured } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const db = loadData();
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newBlog = {
    id: 'blog-' + Date.now(),
    title: title.trim(),
    slug,
    excerpt: excerpt || title,
    content: content.trim(),
    category: category || 'Digital Marketing',
    readTime: readTime || '4 min read',
    publishedAt: new Date().toISOString().split('T')[0],
    author: author || 'Somnath Banerjee',
    coverImage: coverImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    tags: Array.isArray(tags) ? tags : (tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
    isFeatured: !!isFeatured
  };

  db.blogPosts = [newBlog, ...(db.blogPosts || [])];
  saveData(db);
  res.status(201).json({ success: true, blog: newBlog });
});

app.put('/api/content/blogs/:id', (req, res) => {
  const { id } = req.params;
  const db = loadData();
  const index = (db.blogPosts || []).findIndex((b: any) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  db.blogPosts[index] = {
    ...db.blogPosts[index],
    ...req.body
  };

  saveData(db);
  res.json({ success: true, blog: db.blogPosts[index] });
});

app.delete('/api/content/blogs/:id', (req, res) => {
  const { id } = req.params;
  const db = loadData();
  db.blogPosts = (db.blogPosts || []).filter((b: any) => b.id !== id);
  saveData(db);
  res.json({ success: true, message: 'Blog deleted' });
});

// D. Gallery Management
app.post('/api/content/gallery', (req, res) => {
  const { title, category, description, imageUrl, clientName, metrics, tags, featured } = req.body;
  if (!title || !imageUrl) {
    return res.status(400).json({ error: 'Title and imageUrl are required.' });
  }

  const db = loadData();
  const newItem = {
    id: 'gal-' + Date.now(),
    title: title.trim(),
    category: category || 'E-Commerce',
    description: description || '',
    imageUrl: imageUrl.trim(),
    clientName: clientName || 'StreamOn Client',
    metrics: metrics || '',
    tags: Array.isArray(tags) ? tags : (tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
    featured: !!featured
  };

  db.gallery = [newItem, ...(db.gallery || [])];
  saveData(db);
  res.status(201).json({ success: true, item: newItem });
});

app.put('/api/content/gallery/:id', (req, res) => {
  const { id } = req.params;
  const db = loadData();
  const index = (db.gallery || []).findIndex((g: any) => g.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Gallery item not found' });
  }

  db.gallery[index] = {
    ...db.gallery[index],
    ...req.body
  };

  saveData(db);
  res.json({ success: true, item: db.gallery[index] });
});

app.delete('/api/content/gallery/:id', (req, res) => {
  const { id } = req.params;
  const db = loadData();
  db.gallery = (db.gallery || []).filter((g: any) => g.id !== id);
  saveData(db);
  res.json({ success: true, message: 'Gallery item deleted' });
});

// E. AI Smart Lead Reply Assistant (Powered by Gemini)
app.post('/api/ai/draft-reply', async (req, res) => {
  try {
    const { leadName, service, message, budget, tone } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Fallback template if Gemini key not set
      const template = `Hello ${leadName},\n\nThank you for reaching out to StreamOn - Digital Marketing Agency regarding ${service || 'our services'}.\n\nWe have reviewed your project requirements ("${message.substring(0, 80)}...") and would love to schedule a quick 15-minute strategy call to walk you through our proven growth roadmap.\n\nCould you please let us know your convenient time today or tomorrow? You can also connect with Somnath Banerjee directly on WhatsApp at +91 9674961613.\n\nWarm regards,\nSomnath Banerjee\nStreamOn - Digital Marketing Agency\nBirati, Kolkata`;
      return res.json({ reply: template, source: 'template' });
    }

    const prompt = `You are Somnath Banerjee, founder of StreamOn - Digital Marketing Agency (Address: Birati, Kolkata, Contact: +91 9674961613).
Write a professional, warm, and highly persuasive email/WhatsApp reply to a prospective customer who submitted a lead enquiry.
Customer Details:
- Name: ${leadName}
- Interested Service: ${service}
- Budget Range: ${budget || 'Not specified'}
- Customer Message: ${message}
- Tone: ${tone || 'Professional, enthusiastic, growth-oriented'}

Agency Strengths to mention:
- "Always On" 24/7 digital monitoring & data-backed ROI
- Fast onboarding and proven track record across Amazon, Flipkart, Meta, and Google Ads

Write the response in clean text with greeting, clear value proposition, proposed next step (15-min call / WhatsApp chat), and signature.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    res.json({ reply: response.text, source: 'gemini' });
  } catch (err: any) {
    console.error('AI draft reply error:', err);
    res.status(500).json({ error: 'Failed to generate AI reply' });
  }
});

// ----------------------------------------------------
// VITE MIDDLEWARE / PRODUCTION SERVING
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 StreamOn Agency Server running at http://localhost:${PORT}`);
  });
}

startServer();
