import React, { useState, useEffect } from 'react';
import {
  Lead,
  ContactInfo,
  BlogPost,
  FAQItem,
  GalleryItem,
  ServiceItem
} from '../types';
import {
  ShieldCheck,
  Users,
  MessageSquare,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Settings,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  Phone,
  Mail,
  Edit3,
  Plus,
  X,
  ExternalLink,
  Search,
  Filter,
  Save,
  RefreshCw,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileSpreadsheet,
  HardDrive,
  LogOut,
  Upload,
  Camera
} from 'lucide-react';
import { StreamOnLogo } from './StreamOnLogo';
import { GoogleSheetsHub } from './admin/GoogleSheetsHub';
import { GoogleDriveHub } from './admin/GoogleDriveHub';
import { FirebaseSyncStatus } from './admin/FirebaseSyncStatus';
import { initAuth, googleSignIn, logoutUser, db, getAccessToken } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

interface AdminDashboardProps {
  onClose: () => void;
  contactInfo: ContactInfo;
  onUpdateContactInfo: (info: ContactInfo) => void;
  blogPosts: BlogPost[];
  onUpdateBlogPosts: (posts: BlogPost[]) => void;
  faqs: FAQItem[];
  onUpdateFaqs: (faqs: FAQItem[]) => void;
  gallery: GalleryItem[];
  onUpdateGallery: (gallery: GalleryItem[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  contactInfo,
  onUpdateContactInfo,
  blogPosts,
  onUpdateBlogPosts,
  faqs,
  onUpdateFaqs,
  gallery,
  onUpdateGallery
}) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'sheets' | 'drive' | 'contact' | 'blog' | 'faq' | 'gallery'>('leads');
  
  // Auth & Workspace OAuth State
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadFilterStatus, setLeadFilterStatus] = useState<string>('all');
  const [leadSearchQuery, setLeadSearchQuery] = useState('');

  // AI Reply Draft State
  const [aiDraftPrompt, setAiDraftPrompt] = useState('');
  const [aiTone, setAiTone] = useState<'professional' | 'consultative' | 'persuasive'>('consultative');
  const [aiDraftResult, setAiDraftResult] = useState('');
  const [aiDrafting, setAiDrafting] = useState(false);

  // Status Notification Toast
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Editable Contact Info Form State
  const [editContact, setEditContact] = useState<ContactInfo>({ ...contactInfo });
  const [savingContact, setSavingContact] = useState(false);

  // Blog Editor State
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // FAQ Editor State
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [isCreatingFaq, setIsCreatingFaq] = useState(false);

  // Gallery Editor State
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [isCreatingGallery, setIsCreatingGallery] = useState(false);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Auth Initialization
  useEffect(() => {
    const unsubscribe = initAuth((currentUser, token) => {
      setUser(currentUser);
      if (token) setAccessToken(token);
    }, () => {
      setUser(null);
      setAccessToken(null);
    });

    return () => unsubscribe();
  }, []);

  const handleSignInGoogle = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        showToast(`Connected as ${res.user.displayName || res.user.email}!`, 'success');
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      showToast(err.message || 'Failed to sign in with Google Workspace', 'error');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setAccessToken(null);
    showToast('Signed out of Google Workspace');
  };

  // Real-time Firestore Sync & Fallback API fetch
  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error('Error fetching leads from API:', err);
    } finally {
      setLoadingLeads(false);
    }
  };

  useEffect(() => {
    fetchLeads();

    // Setup Firestore live collection snapshot listener
    try {
      const leadsCol = collection(db, 'leads');
      const unsubscribeFirestore = onSnapshot(leadsCol, (snapshot) => {
        if (!snapshot.empty) {
          const firestoreLeads: Lead[] = [];
          snapshot.forEach((docSnap) => {
            firestoreLeads.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          // Sort by creation date desc
          firestoreLeads.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setLeads(firestoreLeads);
        }
      }, (err) => {
        console.warn('Firestore snapshot listener note:', err.message);
      });

      return () => unsubscribeFirestore();
    } catch (err) {
      console.warn('Firestore subscription fallback to REST:', err);
    }
  }, []);

  // Update lead status or notes
  const handleUpdateLeadStatus = async (leadId: string, newStatus: Lead['status'], notes?: string) => {
    try {
      const target = leads.find(l => l.id === leadId);
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          internalNotes: notes !== undefined ? notes : target?.internalNotes
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setLeads(prev => prev.map(l => l.id === leadId ? updated : l));
        if (selectedLead?.id === leadId) {
          setSelectedLead(updated);
        }
        showToast(`Lead status marked as "${newStatus}"`);
      }
    } catch (err) {
      showToast('Failed to update lead', 'error');
    }
  };

  // Delete Lead
  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const res = await fetch(`/api/leads/${leadId}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads(prev => prev.filter(l => l.id !== leadId));
        if (selectedLead?.id === leadId) setSelectedLead(null);
        showToast('Lead deleted successfully');
      }
    } catch (err) {
      showToast('Failed to delete lead', 'error');
    }
  };

  // Generate AI Lead Reply
  const handleGenerateAiReply = async (lead: Lead) => {
    setAiDrafting(true);
    setAiDraftResult('');
    try {
      const res = await fetch('/api/ai/draft-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadName: lead.name,
          serviceInterested: lead.serviceInterested,
          message: lead.message,
          budgetRange: lead.budgetRange,
          company: lead.company,
          tone: aiTone
        })
      });

      const data = await res.json();
      if (data.draft) {
        setAiDraftResult(data.draft);
      }
    } catch (err) {
      showToast('Failed to draft AI response. Using template instead.', 'error');
    } finally {
      setAiDrafting(false);
    }
  };

  // Save Contact Info
  const handleSaveContactInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingContact(true);
    try {
      // Sync to Firestore
      try {
        await setDoc(doc(db, 'site_settings', 'contact'), editContact, { merge: true });
      } catch (firestoreErr) {
        console.warn('Firestore settings write note:', firestoreErr);
      }

      const res = await fetch('/api/contact-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editContact)
      });

      if (res.ok) {
        const data = await res.json();
        onUpdateContactInfo(data.contactInfo || editContact);
        showToast('Agency Contact Details & Photo Updated Successfully!');
      } else {
        onUpdateContactInfo(editContact);
        showToast('Agency Contact Details & Photo Updated!');
      }
    } catch (err) {
      showToast('Error updating contact information', 'error');
    } finally {
      setSavingContact(false);
    }
  };

  // Blog Management handlers
  const handleSaveBlog = async (post: Partial<BlogPost>) => {
    try {
      const isNew = !post.id;
      const url = isNew ? '/api/blogs' : `/api/blogs/${post.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });

      if (res.ok) {
        const saved = await res.json();
        if (isNew) {
          onUpdateBlogPosts([saved, ...blogPosts]);
        } else {
          onUpdateBlogPosts(blogPosts.map(p => p.id === saved.id ? saved : p));
        }
        setEditingPost(null);
        setIsCreatingPost(false);
        showToast(`Blog post ${isNew ? 'published' : 'updated'} successfully`);
      }
    } catch (err) {
      showToast('Failed to save blog post', 'error');
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onUpdateBlogPosts(blogPosts.filter(p => p.id !== id));
        showToast('Blog post deleted');
      }
    } catch (err) {
      showToast('Failed to delete post', 'error');
    }
  };

  // FAQ Management handlers
  const handleSaveFaq = async (faq: Partial<FAQItem>) => {
    try {
      const isNew = !faq.id;
      const url = isNew ? '/api/faqs' : `/api/faqs/${faq.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faq)
      });

      if (res.ok) {
        const saved = await res.json();
        if (isNew) {
          onUpdateFaqs([...faqs, saved]);
        } else {
          onUpdateFaqs(faqs.map(f => f.id === saved.id ? saved : f));
        }
        setEditingFaq(null);
        setIsCreatingFaq(false);
        showToast(`FAQ item ${isNew ? 'added' : 'updated'} successfully`);
      }
    } catch (err) {
      showToast('Failed to save FAQ', 'error');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onUpdateFaqs(faqs.filter(f => f.id !== id));
        showToast('FAQ deleted');
      }
    } catch (err) {
      showToast('Failed to delete FAQ', 'error');
    }
  };

  // Gallery Management handlers
  const handleSaveGalleryItem = async (item: Partial<GalleryItem>) => {
    try {
      const isNew = !item.id;
      const url = isNew ? '/api/gallery' : `/api/gallery/${item.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });

      if (res.ok) {
        const saved = await res.json();
        if (isNew) {
          onUpdateGallery([saved, ...gallery]);
        } else {
          onUpdateGallery(gallery.map(g => g.id === saved.id ? saved : g));
        }
        setEditingGallery(null);
        setIsCreatingGallery(false);
        showToast(`Gallery item ${isNew ? 'added' : 'updated'} successfully`);
      }
    } catch (err) {
      showToast('Failed to save gallery item', 'error');
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onUpdateGallery(gallery.filter(g => g.id !== id));
        showToast('Gallery item deleted');
      }
    } catch (err) {
      showToast('Failed to delete item', 'error');
    }
  };

  // Filtered Leads
  const filteredLeads = leads.filter(l => {
    const matchesStatus = leadFilterStatus === 'all' || l.status === leadFilterStatus;
    const matchesSearch = l.name.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
                          l.email.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
                          l.phone.includes(leadSearchQuery) ||
                          l.serviceInterested.toLowerCase().includes(leadSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const newLeadsCount = leads.filter(l => l.status === 'new').length;

  return (
    <div className="fixed inset-0 z-50 bg-[#070707] text-white flex flex-col overflow-hidden">
      
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-neutral-800 bg-neutral-950 px-4 sm:px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <StreamOnLogo variant="dark" size="sm" showTagline={false} />
          <div className="h-5 w-px bg-neutral-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-extrabold text-[#B4FF39] bg-[#B4FF39]/10 px-2.5 py-1 rounded-full border border-[#B4FF39]/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Agency Control Panel</span>
            </span>
          </div>
        </div>

        {/* Action Controls & Workspace Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-full">
              {user.photoURL && (
                <img src={user.photoURL} alt={user.displayName || 'Google'} className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
              )}
              <span className="text-[11px] font-semibold text-neutral-300 hidden md:inline max-w-[130px] truncate">{user.displayName || user.email}</span>
              <button
                onClick={handleLogout}
                className="text-neutral-500 hover:text-neutral-300 text-xs p-1"
                title="Sign out of Google Workspace"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignInGoogle}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-3.5 h-3.5">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span className="hidden sm:inline">Google Workspace</span>
            </button>
          )}

          <button
            onClick={fetchLeads}
            disabled={loadingLeads}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh Inquiries"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingLeads ? 'animate-spin text-[#B4FF39]' : ''}`} />
            <span className="hidden sm:inline">Sync Data</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-[#B4FF39] text-neutral-950 font-bold text-xs hover:bg-[#c4ff5e] transition-all flex items-center gap-1.5 shadow cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Return to Website</span>
          </button>
        </div>
      </header>

      {/* Main Panel Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-64 border-r border-neutral-800 bg-neutral-950/60 p-4 flex flex-col justify-between hidden md:flex flex-shrink-0 overflow-y-auto">
          <nav className="space-y-1.5">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 px-3 py-2">
              Core CRM & Workspace
            </div>

            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'leads'
                  ? 'bg-[#B4FF39] text-neutral-950 shadow-md'
                  : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Customer Inquiries</span>
              </div>
              {newLeadsCount > 0 && (
                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                  activeTab === 'leads' ? 'bg-neutral-950 text-[#B4FF39]' : 'bg-[#B4FF39] text-neutral-950'
                }`}>
                  {newLeadsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('sheets')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'sheets'
                  ? 'bg-[#B4FF39] text-neutral-950 shadow-md'
                  : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Google Sheets CRM</span>
            </button>

            <button
              onClick={() => setActiveTab('drive')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'drive'
                  ? 'bg-[#B4FF39] text-neutral-950 shadow-md'
                  : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <HardDrive className="w-4 h-4 text-blue-400" />
              <span>Google Drive Vault</span>
            </button>

            <div className="pt-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 px-3">
              Content & Settings CMS
            </div>

            <button
              onClick={() => setActiveTab('contact')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-[#B4FF39] text-neutral-950 shadow-md'
                  : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Contact & Agency Setup</span>
            </button>

            <button
              onClick={() => setActiveTab('blog')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'blog'
                  ? 'bg-[#B4FF39] text-neutral-950 shadow-md'
                  : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>In-Page Blog CMS</span>
            </button>

            <button
              onClick={() => setActiveTab('faq')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'faq'
                  ? 'bg-[#B4FF39] text-neutral-950 shadow-md'
                  : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Digital Marketing FAQs</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-[#B4FF39] text-neutral-950 shadow-md'
                  : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Product & Work Gallery</span>
            </button>
          </nav>

          {/* Agency Founder Quick Badge */}
          <div className="pt-4 space-y-2">
            <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-xs">
              <div className="text-[10px] text-[#B4FF39] font-bold uppercase">Logged in as</div>
              <div className="font-bold text-white mt-0.5">{contactInfo.founderName}</div>
              <div className="text-[11px] text-neutral-400 font-mono mt-1">{contactInfo.phonePrimary}</div>
            </div>
          </div>
        </aside>

        {/* Mobile Horizontal Tabs */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950 border-t border-neutral-800 px-2 py-2 flex items-center justify-around overflow-x-auto">
          {[
            { id: 'leads', label: 'Leads', icon: Users },
            { id: 'sheets', label: 'Sheets', icon: FileSpreadsheet },
            { id: 'drive', label: 'Drive', icon: HardDrive },
            { id: 'contact', label: 'Contact', icon: Settings },
            { id: 'blog', label: 'Blog', icon: FileText },
            { id: 'faq', label: 'FAQ', icon: HelpCircle },
            { id: 'gallery', label: 'Gallery', icon: ImageIcon }
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`p-2 rounded-xl flex flex-col items-center gap-1 text-[10px] font-bold whitespace-nowrap min-w-[50px] ${
                  activeTab === t.id ? 'text-[#B4FF39] bg-neutral-900' : 'text-neutral-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Work Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#070707] pb-24 md:pb-8">
          
          {/* Top Firebase & Workspace live sync banner */}
          <div className="mb-6">
            <FirebaseSyncStatus
              isFirestoreActive={true}
              leadsCount={leads.length}
              user={user}
            />
          </div>

          {/* Toast message popup */}
          {toastMsg && (
            <div className={`mb-6 p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
              toastMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{toastMsg.text}</span>
              </div>
              <button onClick={() => setToastMsg(null)} className="p-1 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 1: LEADS & INQUIRIES CRM */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              {/* Header + Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Customer Inquiries & Leads CRM</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage service requests, reply via WhatsApp/Email, or generate AI client proposals.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="/api/leads/export/csv"
                    download="streamon_leads.csv"
                    className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#B4FF39]" />
                    <span>Export CSV</span>
                  </a>
                </div>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                  <div className="text-xs text-neutral-400">Total Inquiries</div>
                  <div className="text-2xl font-black text-white mt-1 font-mono">{leads.length}</div>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                  <div className="text-xs text-[#B4FF39]">New / Unopened</div>
                  <div className="text-2xl font-black text-[#B4FF39] mt-1 font-mono">{newLeadsCount}</div>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                  <div className="text-xs text-emerald-400">Contacted / Active</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
                    {leads.filter(l => l.status === 'contacted' || l.status === 'in_progress').length}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                  <div className="text-xs text-cyan-400">Closed / Won</div>
                  <div className="text-2xl font-black text-cyan-400 mt-1 font-mono">
                    {leads.filter(l => l.status === 'closed').length}
                  </div>
                </div>
              </div>

              {/* Search & Status Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={leadSearchQuery}
                    onChange={(e) => setLeadSearchQuery(e.target.value)}
                    placeholder="Search by customer name, phone, email, or service..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#B4FF39]"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {['all', 'new', 'contacted', 'in_progress', 'closed'].map(st => (
                    <button
                      key={st}
                      onClick={() => setLeadFilterStatus(st)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap cursor-pointer transition-colors ${
                        leadFilterStatus === st
                          ? 'bg-[#B4FF39] text-neutral-950'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Leads Table / List */}
              <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 overflow-hidden shadow-xl">
                {filteredLeads.length === 0 ? (
                  <div className="p-12 text-center text-neutral-400 text-sm">
                    No inquiries found matching your filters.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-wider font-mono border-b border-neutral-800">
                        <tr>
                          <th className="p-4">Customer / Brand</th>
                          <th className="p-4">Service Interested</th>
                          <th className="p-4">Budget Range</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800 text-neutral-300">
                        {filteredLeads.map((lead) => (
                          <tr
                            key={lead.id}
                            onClick={() => setSelectedLead(lead)}
                            className="hover:bg-neutral-800/60 transition-colors cursor-pointer"
                          >
                            <td className="p-4">
                              <div className="font-bold text-white text-sm">{lead.name}</div>
                              <div className="text-neutral-400 text-[11px] flex items-center gap-2 mt-0.5">
                                <span className="font-mono">{lead.phone}</span>
                                <span>•</span>
                                <span>{lead.email}</span>
                              </div>
                              {lead.company && (
                                <div className="text-[10px] text-[#B4FF39] mt-0.5">🏢 {lead.company}</div>
                              )}
                            </td>

                            <td className="p-4">
                              <span className="font-medium text-neutral-200">{lead.serviceInterested}</span>
                              {lead.message && (
                                <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1 italic">
                                  "{lead.message}"
                                </p>
                              )}
                            </td>

                            <td className="p-4 font-mono text-neutral-300">
                              {lead.budgetRange}
                            </td>

                            <td className="p-4 text-neutral-400 font-mono text-[11px] whitespace-nowrap">
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </td>

                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                lead.status === 'new'
                                  ? 'bg-[#B4FF39]/20 text-[#B4FF39] border border-[#B4FF39]/40 animate-pulse'
                                  : lead.status === 'contacted'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                                  : lead.status === 'in_progress'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              }`}>
                                {lead.status.replace('_', ' ')}
                              </span>
                            </td>

                            <td className="p-4 text-right whitespace-nowrap space-x-2" onClick={(e) => e.stopPropagation()}>
                              <a
                                href={`https://wa.me/91${lead.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(lead.name)},%20this%20is%20Somnath%20from%20StreamOn%20Digital%20Marketing%20Agency%20regarding%20your%20inquiry%20for%20${encodeURIComponent(lead.serviceInterested)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 inline-block rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                                title="Reply on WhatsApp"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </a>

                              <a
                                href={`mailto:${lead.email}?subject=StreamOn%20Proposal%20for%20${encodeURIComponent(lead.serviceInterested)}`}
                                className="p-1.5 inline-block rounded-lg bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700"
                                title="Send Email"
                              >
                                <Mail className="w-4 h-4" />
                              </a>

                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-1.5 inline-block rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 cursor-pointer"
                                title="Delete Lead"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: GOOGLE SHEETS SYNC & CRM HUB */}
          {activeTab === 'sheets' && (
            <GoogleSheetsHub
              user={user}
              accessToken={accessToken}
              onSignIn={handleSignInGoogle}
              leads={leads}
              onShowToast={showToast}
            />
          )}

          {/* TAB: GOOGLE DRIVE DELIVERABLES VAULT */}
          {activeTab === 'drive' && (
            <GoogleDriveHub
              user={user}
              accessToken={accessToken}
              onSignIn={handleSignInGoogle}
              onShowToast={showToast}
            />
          )}

          {/* TAB 2: AGENCY CONTACT INFO & SETTINGS */}
          {activeTab === 'contact' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Agency & Contact Customization</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Customize the agency address, phone numbers, WhatsApp, emails, and brand slogans rendered across the website.
                </p>
              </div>

              <form onSubmit={handleSaveContactInfo} className="rounded-3xl bg-neutral-900 border border-neutral-800 p-6 sm:p-8 space-y-6 shadow-xl">
                
                {/* Agency Name & Tagline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Agency Brand Name</label>
                    <input
                      type="text"
                      value={editContact.agencyName}
                      onChange={(e) => setEditContact({ ...editContact, agencyName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-[#B4FF39] text-xs sm:text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Brand Tagline</label>
                    <input
                      type="text"
                      value={editContact.tagline}
                      onChange={(e) => setEditContact({ ...editContact, tagline: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-[#B4FF39] text-xs sm:text-sm text-white outline-none"
                    />
                  </div>
                </div>

                {/* Slogan */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Hero Slogan</label>
                  <textarea
                    rows={2}
                    value={editContact.slogan}
                    onChange={(e) => setEditContact({ ...editContact, slogan: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-[#B4FF39] text-xs sm:text-sm text-white outline-none"
                  />
                </div>

                {/* Physical Address */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Office Address</label>
                  <input
                    type="text"
                    value={editContact.address}
                    onChange={(e) => setEditContact({ ...editContact, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-[#B4FF39] text-xs sm:text-sm text-white outline-none"
                  />
                </div>

                {/* Phones & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Primary Phone</label>
                    <input
                      type="text"
                      value={editContact.phonePrimary}
                      onChange={(e) => setEditContact({ ...editContact, phonePrimary: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-[#B4FF39] text-xs sm:text-sm text-white font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Secondary Phone</label>
                    <input
                      type="text"
                      value={editContact.phoneSecondary}
                      onChange={(e) => setEditContact({ ...editContact, phoneSecondary: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-[#B4FF39] text-xs sm:text-sm text-white font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">WhatsApp Number</label>
                    <input
                      type="text"
                      value={editContact.whatsapp}
                      onChange={(e) => setEditContact({ ...editContact, whatsapp: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-[#B4FF39] text-xs sm:text-sm text-white font-mono outline-none"
                    />
                  </div>
                </div>

                {/* Emails */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Primary Email</label>
                    <input
                      type="email"
                      value={editContact.emailPrimary}
                      onChange={(e) => setEditContact({ ...editContact, emailPrimary: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-[#B4FF39] text-xs sm:text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Secondary Email</label>
                    <input
                      type="email"
                      value={editContact.emailSecondary}
                      onChange={(e) => setEditContact({ ...editContact, emailSecondary: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-[#B4FF39] text-xs sm:text-sm text-white outline-none"
                    />
                  </div>
                </div>

                {/* Founder Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Founder / Lead Name</label>
                    <input
                      type="text"
                      value={editContact.founderName}
                      onChange={(e) => setEditContact({ ...editContact, founderName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-[#B4FF39] text-xs sm:text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Founder Role</label>
                    <input
                      type="text"
                      value={editContact.founderRole}
                      onChange={(e) => setEditContact({ ...editContact, founderRole: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-[#B4FF39] text-xs sm:text-sm text-white outline-none"
                    />
                  </div>
                </div>

                {/* Founder Photo Management */}
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-white">Founder Profile Image</label>
                    <span className="text-[10px] text-neutral-400">Shown in About section & Client Deck</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Thumbnail Preview */}
                    <div className="w-16 h-16 rounded-xl bg-neutral-900 border-2 border-[#B4FF39]/50 overflow-hidden flex-shrink-0 relative">
                      <img
                        src={editContact.founderPhoto || '/founder.jpg'}
                        alt={editContact.founderName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/founder.jpg';
                        }}
                      />
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="url"
                        placeholder="Image URL (e.g. https://... or leave empty for default)"
                        value={editContact.founderPhoto || ''}
                        onChange={(e) => setEditContact({ ...editContact, founderPhoto: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-[#B4FF39] text-xs text-white outline-none"
                      />

                      <div className="flex items-center gap-2">
                        <label className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-[#B4FF39]" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  if (ev.target?.result) {
                                    setEditContact({ ...editContact, founderPhoto: ev.target.result as string });
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>

                        {editContact.founderPhoto && (
                          <button
                            type="button"
                            onClick={() => setEditContact({ ...editContact, founderPhoto: '' })}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800"
                          >
                            Reset Default
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-neutral-800 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingContact}
                    className="px-6 py-3 rounded-xl bg-[#B4FF39] text-neutral-950 font-bold text-xs hover:bg-[#c4ff5e] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingContact ? 'Saving Changes...' : 'Save Agency Settings'}</span>
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* TAB 3: IN-PAGE BLOG CMS */}
          {activeTab === 'blog' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">In-Page Blog Articles CMS</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage client education articles, guides, and strategy case studies.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingPost({
                      id: '',
                      title: '',
                      excerpt: '',
                      content: '',
                      category: 'E-Commerce',
                      tags: ['Marketing', 'Scaling'],
                      publishedAt: new Date().toISOString().split('T')[0],
                      readTime: '4 min read',
                      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
                      author: contactInfo.founderName
                    });
                    setIsCreatingPost(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#B4FF39] text-neutral-950 font-bold text-xs hover:bg-[#c4ff5e] flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Blog Post</span>
                </button>
              </div>

              {/* Blog Post List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogPosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-2xl bg-neutral-900 border border-neutral-800 p-5 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex gap-4">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-24 h-24 rounded-xl object-cover bg-neutral-950 flex-shrink-0"
                      />
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-950 text-[#B4FF39] border border-neutral-800">
                          {post.category}
                        </span>
                        <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                          {post.title}
                        </h4>
                        <p className="text-xs text-neutral-400 line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                      <span className="text-neutral-500 font-mono">{post.publishedAt} • {post.readTime}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingPost(post);
                            setIsCreatingPost(false);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(post.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit/Create Modal for Blog */}
              {editingPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                  <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-700 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                      <h3 className="text-lg font-bold text-white">
                        {isCreatingPost ? 'Create New Article' : 'Edit Article'}
                      </h3>
                      <button onClick={() => setEditingPost(null)} className="text-neutral-400 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1">Article Title</label>
                        <input
                          type="text"
                          value={editingPost.title}
                          onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white outline-none focus:border-[#B4FF39]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1">Category</label>
                          <select
                            value={editingPost.category}
                            onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white outline-none"
                          >
                            <option value="E-Commerce">E-Commerce</option>
                            <option value="Google & Meta Ads">Google & Meta Ads</option>
                            <option value="Catalog & Design">Catalog & Design</option>
                            <option value="Social Media">Social Media</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1">Read Time</label>
                          <input
                            type="text"
                            value={editingPost.readTime}
                            onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1">Cover Image URL</label>
                        <input
                          type="text"
                          value={editingPost.coverImage}
                          onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1">Short Excerpt</label>
                        <textarea
                          rows={2}
                          value={editingPost.excerpt}
                          onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1">Full Article Content (Markdown format)</label>
                        <textarea
                          rows={8}
                          value={editingPost.content}
                          onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-800 flex justify-end gap-3">
                      <button
                        onClick={() => setEditingPost(null)}
                        className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveBlog(editingPost)}
                        className="px-5 py-2 rounded-xl bg-[#B4FF39] text-neutral-950 text-xs font-bold hover:bg-[#c4ff5e]"
                      >
                        Save Article
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DIGITAL MARKETING FAQS */}
          {activeTab === 'faq' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">Digital Marketing FAQ Manager</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Add or update questions to guide potential clients and address objection handling.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingFaq({
                      id: '',
                      question: '',
                      answer: '',
                      category: 'E-Commerce',
                      order: faqs.length + 1
                    });
                    setIsCreatingFaq(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#B4FF39] text-neutral-950 font-bold text-xs hover:bg-[#c4ff5e] flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New FAQ</span>
                </button>
              </div>

              {/* FAQ List */}
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-950 text-[#B4FF39] border border-neutral-800">
                          {faq.category}
                        </span>
                        <h4 className="text-sm font-bold text-white">{faq.question}</h4>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed pt-1">{faq.answer}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          setEditingFaq(faq);
                          setIsCreatingFaq(false);
                        }}
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ Editor Modal */}
              {editingFaq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                  <div className="w-full max-w-xl bg-neutral-900 border border-neutral-700 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                      <h3 className="text-lg font-bold text-white">
                        {isCreatingFaq ? 'Add New FAQ Question' : 'Edit FAQ'}
                      </h3>
                      <button onClick={() => setEditingFaq(null)} className="text-neutral-400 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1">Question</label>
                        <input
                          type="text"
                          value={editingFaq.question}
                          onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white outline-none focus:border-[#B4FF39]"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1">Category</label>
                        <select
                          value={editingFaq.category}
                          onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white outline-none"
                        >
                          <option value="E-Commerce">E-Commerce</option>
                          <option value="PPC & Ads">PPC & Ads</option>
                          <option value="Social Media">Social Media</option>
                          <option value="Catalog & Design">Catalog & Design</option>
                          <option value="General">General</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1">Answer</label>
                        <textarea
                          rows={4}
                          value={editingFaq.answer}
                          onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-800 flex justify-end gap-3">
                      <button
                        onClick={() => setEditingFaq(null)}
                        className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveFaq(editingFaq)}
                        className="px-5 py-2 rounded-xl bg-[#B4FF39] text-neutral-950 text-xs font-bold hover:bg-[#c4ff5e]"
                      >
                        Save FAQ
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PRODUCT & WORK GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">Product Gallery & Creative Showcase</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage sample catalog renders, campaign screenshots, and client case study assets.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingGallery({
                      id: '',
                      title: '',
                      category: 'Catalog Design',
                      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
                      description: '',
                      metrics: '3.5x Sales Lift',
                      tags: ['Catalog', '3D Render', 'Amazon A+']
                    });
                    setIsCreatingGallery(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#B4FF39] text-neutral-950 font-bold text-xs hover:bg-[#c4ff5e] flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Showcase Item</span>
                </button>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative h-44 bg-neutral-950">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-950/80 text-[#B4FF39] border border-neutral-800">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm">{item.title}</h4>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{item.description}</p>
                        {item.metrics && (
                          <div className="text-[11px] text-emerald-400 font-bold mt-2">
                            ⚡ {item.metrics}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                        <div className="flex gap-1">
                          {item.tags.slice(0, 2).map((t, idx) => (
                            <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-400">
                              #{t}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingGallery(item);
                              setIsCreatingGallery(false);
                            }}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteGalleryItem(item.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gallery Item Editor Modal */}
              {editingGallery && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                  <div className="w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                      <h3 className="text-lg font-bold text-white">
                        {isCreatingGallery ? 'Add Gallery Showcase' : 'Edit Showcase Item'}
                      </h3>
                      <button onClick={() => setEditingGallery(null)} className="text-neutral-400 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1">Title</label>
                        <input
                          type="text"
                          value={editingGallery.title}
                          onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white outline-none focus:border-[#B4FF39]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1">Category</label>
                          <select
                            value={editingGallery.category}
                            onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white outline-none"
                          >
                            <option value="Social Media">Social Media</option>
                            <option value="E-Commerce">E-Commerce</option>
                            <option value="Catalog Design">Catalog Design</option>
                            <option value="Graphic Design">Graphic Design</option>
                            <option value="PPC Ads">PPC Ads</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1">Key Metric / Result</label>
                          <input
                            type="text"
                            value={editingGallery.metrics || ''}
                            onChange={(e) => setEditingGallery({ ...editingGallery, metrics: e.target.value })}
                            placeholder="e.g. +340% ROAS, 10k orders"
                            className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1">Image URL</label>
                        <input
                          type="text"
                          value={editingGallery.imageUrl}
                          onChange={(e) => setEditingGallery({ ...editingGallery, imageUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1">Description</label>
                        <textarea
                          rows={3}
                          value={editingGallery.description}
                          onChange={(e) => setEditingGallery({ ...editingGallery, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-800 flex justify-end gap-3">
                      <button
                        onClick={() => setEditingGallery(null)}
                        className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveGalleryItem(editingGallery)}
                        className="px-5 py-2 rounded-xl bg-[#B4FF39] text-neutral-950 text-xs font-bold hover:bg-[#c4ff5e]"
                      >
                        Save Showcase
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* LEAD DETAIL & AI REPLY MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-3xl rounded-3xl bg-neutral-900 border border-neutral-700 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#B4FF39]/20 text-[#B4FF39] flex items-center justify-center font-bold text-sm">
                  {selectedLead.name[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedLead.name}</h3>
                  <div className="text-xs text-neutral-400 flex items-center gap-2">
                    <span className="font-mono">{selectedLead.phone}</span>
                    <span>•</span>
                    <span>{selectedLead.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleUpdateLeadStatus(selectedLead.id, e.target.value as any)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-xs font-semibold text-white outline-none cursor-pointer"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="closed">Closed / Won</option>
                  <option value="junk">Junk</option>
                </select>

                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="overflow-y-auto p-6 space-y-6 text-xs sm:text-sm">
              {/* Inquiry Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div>
                  <div className="text-[11px] text-neutral-500 uppercase font-mono">Service Requested</div>
                  <div className="font-bold text-white mt-0.5">{selectedLead.serviceInterested}</div>
                </div>
                <div>
                  <div className="text-[11px] text-neutral-500 uppercase font-mono">Target Budget</div>
                  <div className="font-bold text-[#B4FF39] mt-0.5">{selectedLead.budgetRange}</div>
                </div>
                <div>
                  <div className="text-[11px] text-neutral-500 uppercase font-mono">Business Name</div>
                  <div className="font-bold text-white mt-0.5">{selectedLead.company || 'Not Specified'}</div>
                </div>
              </div>

              {/* Inquiry Message */}
              <div>
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Customer Message:</div>
                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 text-neutral-200 leading-relaxed italic">
                  "{selectedLead.message || 'No additional notes provided in form.'}"
                </div>
              </div>

              {/* AI Reply Generator Section */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-950 to-neutral-900 border border-[#B4FF39]/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#B4FF39]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Gemini AI Proposal & Response Generator
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={aiTone}
                      onChange={(e) => setAiTone(e.target.value as any)}
                      className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-[11px] text-neutral-300 outline-none"
                    >
                      <option value="consultative">Consultative & Helpful</option>
                      <option value="persuasive">Persuasive Growth Pitch</option>
                      <option value="professional">Formal Executive</option>
                    </select>

                    <button
                      onClick={() => handleGenerateAiReply(selectedLead)}
                      disabled={aiDrafting}
                      className="px-3.5 py-1.5 rounded-lg bg-[#B4FF39] text-neutral-950 text-xs font-bold hover:bg-[#c4ff5e] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${aiDrafting ? 'animate-spin' : ''}`} />
                      <span>{aiDrafting ? 'Drafting...' : 'Generate Reply'}</span>
                    </button>
                  </div>
                </div>

                {/* AI Draft Result Textarea */}
                {aiDraftResult && (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <textarea
                      rows={7}
                      value={aiDraftResult}
                      onChange={(e) => setAiDraftResult(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 leading-relaxed font-sans outline-none focus:border-[#B4FF39]"
                    />

                    <div className="flex flex-wrap gap-2 justify-end">
                      <a
                        href={`https://wa.me/91${selectedLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(aiDraftResult)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-neutral-950 text-xs font-bold hover:bg-emerald-400 flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Send to Customer via WhatsApp</span>
                      </a>

                      <a
                        href={`mailto:${selectedLead.email}?subject=StreamOn%20Proposal%20for%20${encodeURIComponent(selectedLead.serviceInterested)}&body=${encodeURIComponent(aiDraftResult)}`}
                        className="px-4 py-2 rounded-xl bg-neutral-800 text-white text-xs font-bold hover:bg-neutral-700 flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Send via Email Client</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Internal Notes */}
              <div>
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Internal Agency Notes:</div>
                <textarea
                  rows={2}
                  defaultValue={selectedLead.internalNotes || ''}
                  onBlur={(e) => handleUpdateLeadStatus(selectedLead.id, selectedLead.status, e.target.value)}
                  placeholder="Add private team notes here (e.g. Called client on 16 Aug, requested 3D sample files)..."
                  className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 outline-none focus:border-[#B4FF39]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex justify-between items-center">
              <button
                onClick={() => handleDeleteLead(selectedLead.id)}
                className="px-3.5 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 text-xs font-bold flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead</span>
              </button>

              <button
                onClick={() => setSelectedLead(null)}
                className="px-5 py-2 rounded-xl bg-neutral-800 text-white text-xs font-bold hover:bg-neutral-700"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
