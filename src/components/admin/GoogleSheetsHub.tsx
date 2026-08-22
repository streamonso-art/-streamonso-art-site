import React, { useState } from 'react';
import { Lead } from '../../types';
import { syncLeadsToGoogleSheet, createCampaignTrackerSheet, SheetsSyncResult } from '../../lib/googleWorkspace';
import { GoogleSignInButton } from '../GoogleSignInButton';
import {
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
  Plus,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Table,
  Layers,
  Lock
} from 'lucide-react';
import { User } from 'firebase/auth';

interface GoogleSheetsHubProps {
  user: User | null;
  accessToken: string | null;
  onSignIn: () => Promise<void>;
  leads: Lead[];
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const GoogleSheetsHub: React.FC<GoogleSheetsHubProps> = ({
  user,
  accessToken,
  onSignIn,
  leads,
  onShowToast,
}) => {
  const [syncing, setSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<SheetsSyncResult | null>(null);
  const [spreadsheetIdInput, setSpreadsheetIdInput] = useState('');
  
  // Custom Campaign Tracker Sheet State
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [campaignClientName, setCampaignClientName] = useState('');
  const [campaignService, setCampaignService] = useState('Google & Meta Ads PPC');
  const [campaignBudget, setCampaignBudget] = useState('₹50,000 / month');
  const [creatingTracker, setCreatingTracker] = useState(false);
  const [createdCampaignUrl, setCreatedCampaignUrl] = useState('');

  // Handle Export / Synchronize Leads to Google Sheet
  const handleSyncLeads = async () => {
    if (!accessToken) {
      onShowToast('Please sign in with Google Workspace first', 'error');
      return;
    }

    setSyncing(true);
    try {
      const result = await syncLeadsToGoogleSheet(
        accessToken,
        leads,
        spreadsheetIdInput.trim() || undefined
      );
      setLastSyncResult(result);
      onShowToast(`Successfully exported ${result.updatedRows} leads to Google Sheets!`, 'success');
    } catch (err: any) {
      console.error('Sheets sync error:', err);
      onShowToast(err.message || 'Failed to sync with Google Sheets', 'error');
    } finally {
      setSyncing(false);
    }
  };

  // Handle Create New Campaign Tracking Sheet
  const handleCreateCampaignTracker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      onShowToast('Please sign in with Google Workspace first', 'error');
      return;
    }
    if (!campaignClientName.trim()) {
      onShowToast('Please enter a client/brand name', 'error');
      return;
    }

    setCreatingTracker(true);
    try {
      const result = await createCampaignTrackerSheet(
        accessToken,
        campaignClientName.trim(),
        campaignService,
        campaignBudget
      );
      setCreatedCampaignUrl(result.spreadsheetUrl);
      setIsCreatingCampaign(false);
      onShowToast(`Campaign tracker spreadsheet created for ${campaignClientName}!`, 'success');
    } catch (err: any) {
      console.error('Create campaign tracker error:', err);
      onShowToast(err.message || 'Failed to create campaign spreadsheet', 'error');
    } finally {
      setCreatingTracker(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Google Workspace Integration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Google Sheets Lead Sync & Hub</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Real-time synchronization between StreamOn inquiry capture and your Google Sheets CRM.
          </p>
        </div>

        {/* Auth status or Connect button */}
        {!user || !accessToken ? (
          <GoogleSignInButton onClick={onSignIn} text="Connect Google Sheets" />
        ) : (
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-neutral-900 border border-neutral-800">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'Google User'} className="w-8 h-8 rounded-full border border-neutral-700" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#B4FF39] text-neutral-950 font-bold flex items-center justify-center text-xs">
                {user.displayName?.charAt(0) || 'G'}
              </div>
            )}
            <div className="text-left pr-2">
              <div className="text-xs font-bold text-white leading-tight">{user.displayName || 'Workspace Admin'}</div>
              <div className="text-[10px] text-emerald-400 font-mono">Drive & Sheets Connected</div>
            </div>
          </div>
        )}
      </div>

      {!user || !accessToken ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900/60 border border-neutral-800 text-center max-w-xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Authorize Google Sheets Access</h3>
            <p className="text-xs text-neutral-400">
              Sign in with your Google account to automatically sync customer inquiries, manage client campaign spreadsheets, and export live analytics.
            </p>
          </div>
          <GoogleSignInButton onClick={onSignIn} text="Sign in with Google Workspace" className="w-full sm:w-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Sync Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Table className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Export & Sync Leads to Google Sheets</h3>
                    <p className="text-xs text-neutral-400">Creates or updates a styled spreadsheet with all {leads.length} inquiries.</p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300">
                  {leads.length} Available
                </span>
              </div>

              {/* Optional Existing Sheet ID */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Update Existing Spreadsheet ID <span className="text-neutral-500 font-normal">(Optional, leave blank to create a new one)</span>
                </label>
                <input
                  type="text"
                  value={spreadsheetIdInput}
                  onChange={(e) => setSpreadsheetIdInput(e.target.value)}
                  placeholder="e.g., 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-600 outline-none focus:border-[#B4FF39]"
                />
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleSyncLeads}
                disabled={syncing}
                className="w-full py-3.5 rounded-xl bg-[#B4FF39] text-neutral-950 font-extrabold text-sm hover:bg-[#c4ff5e] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Exporting to Google Sheets...' : '1-Click Sync All Leads to Google Sheets'}</span>
              </button>

              {/* Last Sync Result Link */}
              {lastSyncResult && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-2.5 text-xs text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>{lastSyncResult.updatedRows} leads</strong> synchronized to "{lastSyncResult.sheetTitle}"</span>
                  </div>
                  <a
                    href={lastSyncResult.spreadsheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 text-neutral-950 text-xs font-bold hover:bg-emerald-400 transition-colors"
                  >
                    <span>Open in Google Sheets</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Campaign Tracker Creator */}
            <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#B4FF39]/10 border border-[#B4FF39]/30 flex items-center justify-center text-[#B4FF39]">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Create Client Campaign KPI Tracker</h3>
                    <p className="text-xs text-neutral-400">Generate a Google Sheet formatted with ROAS, Ad Spend & Conversion metrics.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreatingCampaign(!isCreatingCampaign)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 transition-colors cursor-pointer"
                >
                  {isCreatingCampaign ? 'Cancel' : '+ New Tracker'}
                </button>
              </div>

              {isCreatingCampaign && (
                <form onSubmit={handleCreateCampaignTracker} className="pt-4 border-t border-neutral-800 space-y-3 animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-neutral-400 mb-1">Client / Brand Name</label>
                      <input
                        type="text"
                        required
                        value={campaignClientName}
                        onChange={(e) => setCampaignClientName(e.target.value)}
                        placeholder="e.g. Royal Organics"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white outline-none focus:border-[#B4FF39]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-400 mb-1">Service Type</label>
                      <select
                        value={campaignService}
                        onChange={(e) => setCampaignService(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white outline-none focus:border-[#B4FF39]"
                      >
                        <option value="Google & Meta Ads PPC">Google & Meta Ads PPC</option>
                        <option value="Amazon Seller Central Management">Amazon Seller Central</option>
                        <option value="Flipkart & Marketplace Scaling">Flipkart Marketplace</option>
                        <option value="Social Media & Viral Reels">Social Media & Viral Reels</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-400 mb-1">Monthly Budget Tier</label>
                      <input
                        type="text"
                        value={campaignBudget}
                        onChange={(e) => setCampaignBudget(e.target.value)}
                        placeholder="e.g. ₹50,000 / month"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white outline-none focus:border-[#B4FF39]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={creatingTracker}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-xs hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{creatingTracker ? 'Generating Spreadsheet...' : 'Create Campaign Spreadsheet in Google Drive'}</span>
                  </button>
                </form>
              )}

              {createdCampaignUrl && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <span className="text-emerald-300">Campaign KPI Sheet is live!</span>
                  <a
                    href={createdCampaignUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-400 font-bold hover:underline"
                  >
                    Open Tracker Sheet <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick Info & Schema Card */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#B4FF39]">
                Google Sheets Column Schema
              </h4>
              <p className="text-xs text-neutral-400">
                Synced spreadsheets are formatted automatically with StreamOn signature high-contrast headers:
              </p>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Customer Name & Brand</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Email & Direct Phone</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Service Category & Budget</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Inquiry Scope & CRM Status</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Lead Submission Timestamp</li>
              </ul>
            </div>

            <div className="p-5 rounded-3xl bg-neutral-900/40 border border-neutral-800 text-xs text-neutral-400 space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B4FF39]" />
                <span>Live Collaborative Sharing</span>
              </div>
              <p>
                Once synced, share the generated Google Sheet link with your agency team members, sales reps, or clients in real-time.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
