export type LeadStatus = 'new' | 'contacted' | 'in_progress' | 'closed' | 'junk' | 'New' | 'Contacted' | 'In Progress' | 'Converted' | 'Lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceInterested: string;
  budgetRange: string;
  message: string;
  status: LeadStatus;
  sourcePage?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: string;
  coverImage: string;
  tags: string[];
  isFeatured?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'E-Commerce' | 'Social Media' | 'PPC & Ads' | 'Catalog & Design' | string;
  order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Social Media' | 'E-Commerce' | 'Catalog Design' | 'Graphic Design' | 'PPC Ads' | string;
  description: string;
  imageUrl: string;
  clientName?: string;
  metrics?: string;
  tags: string[];
  featured?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  features: string[];
  platforms?: string[];
  badge?: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  subtitle: string;
  priceMonthly: string;
  priceQuarterly: string;
  period: string;
  badge: string;
  features: string[];
  popular: boolean;
  accent?: string;
}

export interface ContactInfo {
  agencyName: string;
  tagline: string;
  slogan: string;
  address: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsapp: string;
  emailPrimary: string;
  emailSecondary: string;
  businessHours: string;
  founderName: string;
  founderRole: string;
  founderPhoto?: string;
  googleMapUrl?: string;
}

export interface SiteContent {
  contactInfo: ContactInfo;
  faqs: FAQItem[];
  blogPosts: BlogPost[];
  gallery: GalleryItem[];
  services: ServiceItem[];
}
