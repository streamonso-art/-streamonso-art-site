import React, { useState, useEffect } from 'react';
import {
  listDriveFiles,
  createDriveFolder,
  uploadDriveTextFile,
  deleteDriveFile,
  DriveFileItem
} from '../../lib/googleWorkspace';
import { GoogleSignInButton } from '../GoogleSignInButton';
import {
  HardDrive,
  Folder,
  FileText,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  File,
  Image as ImageIcon,
  Clock,
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';
import { User } from 'firebase/auth';

interface GoogleDriveHubProps {
  user: User | null;
  accessToken: string | null;
  onSignIn: () => Promise<void>;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const GoogleDriveHub: React.FC<GoogleDriveHubProps> = ({
  user,
  accessToken,
  onSignIn,
  onShowToast,
}) => {
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Folder creation
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folderSubmitting, setFolderSubmitting] = useState(false);

  // File upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadContent, setUploadContent] = useState('');
  const [uploadSubmitting, setUploadSubmitting] = useState(false);

  // Deletion confirmation modal
  const [deletingFile, setDeletingFile] = useState<DriveFileItem | null>(null);
  const [deletingProgress, setDeletingProgress] = useState(false);

  const fetchFiles = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const items = await listDriveFiles(accessToken, undefined, searchQuery.trim() || undefined);
      setFiles(items);
    } catch (err: any) {
      console.error('Fetch Drive files error:', err);
      onShowToast(err.message || 'Failed to list Google Drive files', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchFiles();
    }
  }, [accessToken]);

  // Create Client Folder
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !newFolderName.trim()) return;
    setFolderSubmitting(true);
    try {
      await createDriveFolder(accessToken, newFolderName.trim());
      setNewFolderName('');
      setIsCreatingFolder(false);
      onShowToast(`Client folder "${newFolderName}" created in Google Drive!`, 'success');
      fetchFiles();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to create folder', 'error');
    } finally {
      setFolderSubmitting(false);
    }
  };

  // Upload Document / Proposal
  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !uploadTitle.trim() || !uploadContent.trim()) return;
    setUploadSubmitting(true);
    try {
      const fileName = uploadTitle.endsWith('.txt') || uploadTitle.endsWith('.md')
        ? uploadTitle
        : `${uploadTitle}.md`;
      await uploadDriveTextFile(accessToken, fileName, uploadContent, 'text/markdown');
      setUploadTitle('');
      setUploadContent('');
      setIsUploading(false);
      onShowToast(`Marketing proposal "${fileName}" uploaded to Google Drive!`, 'success');
      fetchFiles();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to upload document', 'error');
    } finally {
      setUploadSubmitting(false);
    }
  };

  // Delete file handler
  const confirmDelete = async () => {
    if (!accessToken || !deletingFile) return;
    setDeletingProgress(true);
    try {
      await deleteDriveFile(accessToken, deletingFile.id);
      onShowToast(`File "${deletingFile.name}" removed from Google Drive.`, 'success');
      setDeletingFile(null);
      fetchFiles();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to delete file', 'error');
    } finally {
      setDeletingProgress(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Google Drive Asset Vault</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Agency Deliverables & Client Drive</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Store, view, and organize client marketing proposals, 3D catalogs, and deliverables directly in Google Drive.
          </p>
        </div>

        {/* Auth / Action */}
        {!user || !accessToken ? (
          <GoogleSignInButton onClick={onSignIn} text="Connect Google Drive" />
        ) : (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCreatingFolder(!isCreatingFolder)}
              className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Folder className="w-3.5 h-3.5 text-[#B4FF39]" />
              <span>+ New Folder</span>
            </button>
            <button
              onClick={() => setIsUploading(!isUploading)}
              className="px-3.5 py-2 rounded-xl bg-[#B4FF39] hover:bg-[#c4ff5e] text-neutral-950 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>
        )}
      </div>

      {!user || !accessToken ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900/60 border border-neutral-800 text-center max-w-xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
            <HardDrive className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Authorize Google Drive Access</h3>
            <p className="text-xs text-neutral-400">
              Sign in with your Google Workspace account to browse client folders, upload strategy proposals, and manage digital marketing assets securely.
            </p>
          </div>
          <GoogleSignInButton onClick={onSignIn} text="Sign in with Google Workspace" className="w-full sm:w-auto" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Action Modals / Inline Drawers */}
          {isCreatingFolder && (
            <form onSubmit={handleCreateFolder} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 animate-in slide-in-from-top-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Folder className="w-4 h-4 text-[#B4FF39]" />
                <span>Create New Client Drive Folder</span>
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. StreamOn - Client_Nike_Reels_2026"
                  className="flex-1 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white outline-none focus:border-[#B4FF39]"
                />
                <button
                  type="submit"
                  disabled={folderSubmitting}
                  className="px-4 py-2 rounded-xl bg-[#B4FF39] text-neutral-950 font-bold text-xs hover:bg-[#c4ff5e] disabled:opacity-50 cursor-pointer"
                >
                  {folderSubmitting ? 'Creating...' : 'Create Folder'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingFolder(false)}
                  className="px-3 py-2 rounded-xl bg-neutral-800 text-neutral-400 text-xs hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {isUploading && (
            <form onSubmit={handleUploadDocument} className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#B4FF39]" />
                  <span>Upload Proposal or Audit Report to Google Drive</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="text-neutral-500 hover:text-neutral-300 text-xs"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. 90-Day Digital Growth Action Plan - Client X"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white outline-none focus:border-[#B4FF39]"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Content / Strategy Details (Markdown / Text)</label>
                <textarea
                  rows={6}
                  required
                  value={uploadContent}
                  onChange={(e) => setUploadContent(e.target.value)}
                  placeholder="# StreamOn Growth Strategy&#10;&#10;## Phase 1: High ROAS Ads Kickoff&#10;- Meta Lookalike Campaigns&#10;- Amazon A+ Content Overhaul"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white outline-none focus:border-[#B4FF39] font-mono resize-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#B4FF39] text-neutral-950 font-bold text-xs hover:bg-[#c4ff5e] disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadSubmitting ? 'Uploading to Drive...' : 'Save to Google Drive'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Search & Refresh Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchFiles()}
                placeholder="Search files and folders in Google Drive..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#B4FF39]"
              />
            </div>
            <button
              onClick={fetchFiles}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#B4FF39]' : ''}`} />
              <span>Refresh Drive</span>
            </button>
          </div>

          {/* Files List */}
          {loading ? (
            <div className="p-12 text-center text-neutral-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#B4FF39]" />
              <span>Accessing Google Drive deliverables...</span>
            </div>
          ) : files.length === 0 ? (
            <div className="p-12 rounded-3xl bg-neutral-900/40 border border-neutral-800 text-center space-y-3">
              <Folder className="w-10 h-10 text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-400">No matching files or folders found in Google Drive.</p>
              <button
                onClick={() => setIsUploading(true)}
                className="px-4 py-2 rounded-xl bg-[#B4FF39] text-neutral-950 font-bold text-xs"
              >
                Upload First Marketing File
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file) => {
                const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
                const isSheet = file.mimeType.includes('spreadsheet') || file.mimeType.includes('sheet');
                const isDoc = file.mimeType.includes('document') || file.mimeType.includes('text');
                const isImage = file.mimeType.includes('image');

                return (
                  <div
                    key={file.id}
                    className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between group space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isFolder
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : isSheet
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : isImage
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        }`}>
                          {isFolder ? (
                            <Folder className="w-5 h-5" />
                          ) : isSheet ? (
                            <FileText className="w-5 h-5" />
                          ) : isImage ? (
                            <ImageIcon className="w-5 h-5" />
                          ) : (
                            <File className="w-5 h-5" />
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-xs font-bold text-white truncate group-hover:text-[#B4FF39] transition-colors" title={file.name}>
                            {file.name}
                          </div>
                          <div className="text-[10px] text-neutral-500 mt-0.5 truncate">
                            {isFolder ? 'Drive Folder' : file.mimeType.split('.').pop() || 'File'}
                          </div>
                        </div>
                      </div>

                      {/* Delete button (with confirmation) */}
                      <button
                        type="button"
                        onClick={() => setDeletingFile(file)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete from Google Drive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        <span>{file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : 'Recent'}</span>
                      </div>

                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 font-bold text-[#B4FF39] hover:underline"
                        >
                          <span>Open in Drive</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deletingFile && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-md p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 animate-in zoom-in-95">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-base font-bold text-white">Delete from Google Drive?</h3>
                  <p className="text-xs text-neutral-400">
                    Are you sure you want to permanently delete <strong className="text-white">"{deletingFile.name}"</strong>? This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeletingFile(null)}
                    disabled={deletingProgress}
                    className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 font-bold text-xs hover:bg-neutral-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    disabled={deletingProgress}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-500 transition-colors disabled:opacity-50"
                  >
                    {deletingProgress ? 'Deleting...' : 'Yes, Delete File'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
