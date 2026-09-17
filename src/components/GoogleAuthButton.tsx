import React, { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import { LogOut, ExternalLink, HardDrive, CheckCircle2, ChevronDown, User as UserIcon, Loader2 } from 'lucide-react';
import { openGoogleDrive, openGoogleSheets } from '../utils/googleWorkspace';

interface GoogleAuthButtonProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  onLogin: () => Promise<any>;
  onLogout: () => Promise<void>;
  spreadsheetId?: string;
  driveFolderId?: string;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  user,
  isAuthenticated,
  isLoggingIn,
  onLogin,
  onLogout,
  spreadsheetId,
  driveFolderId
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <button
        id="btn-google-signin"
        onClick={onLogin}
        disabled={isLoggingIn}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
        title="Fazer login com a Conta Google para salvar tudo no Google Drive e Sheets"
      >
        {isLoggingIn ? (
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
          </svg>
        )}
        <span className="truncate max-w-[130px] sm:max-w-none">
          {isLoggingIn ? 'Conectando...' : 'Entrar com Google'}
        </span>
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        id="btn-google-profile-menu"
        onClick={() => setMenuOpen(!menuOpen)}
        className="inline-flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-slate-800 text-xs font-semibold transition cursor-pointer"
        title={`Conectado como: ${user.displayName || user.email}`}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'Google User'}
            className="w-6 h-6 rounded-full ring-1 ring-emerald-400 object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
            {(user.displayName || user.email || 'G')[0].toUpperCase()}
          </div>
        )}
        <span className="hidden md:inline font-medium max-w-[120px] truncate text-slate-700">
          {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {/* Account Details Dropdown */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 px-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* User Profile Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-10 h-10 rounded-full ring-2 ring-emerald-400 object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                {(user.displayName || user.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="font-bold text-xs text-slate-900 truncate">
                {user.displayName || 'Conta Google'}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {user.email}
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Google Drive & Sheets Ativos
              </span>
            </div>
          </div>

          {/* Quick links to user's Google cloud files */}
          <div className="py-2 space-y-1">
            <button
              onClick={() => {
                setMenuOpen(false);
                openGoogleSheets(spreadsheetId);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition text-left"
            >
              <span>Minha Planilha BNCC no Sheets</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                openGoogleDrive(driveFolderId);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-amber-600 transition text-left"
            >
              <span>Minha Pasta no Google Drive</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Sign out */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setMenuOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair da Conta Google</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
