import React from 'react';
import { Database, ShieldCheck, CheckCircle2, User as UserIcon } from 'lucide-react';
import { User } from 'firebase/auth';

interface FirebaseSyncStatusProps {
  isFirestoreActive: boolean;
  leadsCount: number;
  user: User | null;
}

export const FirebaseSyncStatus: React.FC<FirebaseSyncStatusProps> = ({
  isFirestoreActive,
  leadsCount,
  user,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-neutral-300">Firebase Firestore Active</span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-[#B4FF39]">
          Live Sync
        </span>
      </div>

      <div className="h-4 w-px bg-neutral-800 hidden sm:block" />

      <div className="flex items-center gap-1.5 text-neutral-400">
        <Database className="w-3.5 h-3.5 text-[#B4FF39]" />
        <span>{leadsCount} Records Synced</span>
      </div>

      {user && (
        <>
          <div className="h-4 w-px bg-neutral-800 hidden sm:block" />
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="truncate max-w-[200px]">{user.email}</span>
          </div>
        </>
      )}
    </div>
  );
};
