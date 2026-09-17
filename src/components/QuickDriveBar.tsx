import React from 'react';
import { 
  FolderOpen, 
  FileSpreadsheet, 
  FileText, 
  Settings, 
  History, 
  Code2, 
  ExternalLink,
  Wifi,
  WifiOff,
  CloudCheck,
  ShieldCheck,
  Contrast,
  FileCheck2
} from 'lucide-react';
import { AppSettings } from '../types';
import { openGoogleDrive, openGoogleSheets, openGoogleDocsNew } from '../utils/googleWorkspace';
import { PWAInstallButton } from './PWAInstallButton';
import { GoogleAuthButton } from './GoogleAuthButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { User } from 'firebase/auth';

interface QuickDriveBarProps {
  settings: AppSettings;
  evaluationsCount: number;
  pendingCount: number;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenScriptModal: () => void;
  onOpenTemplateModal?: () => void;
  onOpenAdmin?: () => void;
  isAdmin?: boolean;
  onToggleTheme?: () => void;
  googleUser: User | null;
  isGoogleAuthenticated: boolean;
  isLoggingInGoogle: boolean;
  onGoogleLogin: () => Promise<any>;
  onGoogleLogout: () => Promise<void>;
}

export const QuickDriveBar: React.FC<QuickDriveBarProps> = ({
  settings,
  evaluationsCount,
  pendingCount,
  onOpenSettings,
  onOpenHistory,
  onOpenScriptModal,
  onOpenTemplateModal,
  onOpenAdmin,
  isAdmin = false,
  onToggleTheme,
  googleUser,
  isGoogleAuthenticated,
  isLoggingInGoogle,
  onGoogleLogin,
  onGoogleLogout,
}) => {
  const isOnline = useOnlineStatus();

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left Brand info */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                Questionário BNCC
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                Workspace PWA
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Avaliação & Acompanhamento do Desenvolvimento Infantil
            </p>
          </div>
        </div>

        {/* Right workspace quick buttons */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          {/* Online/Offline Status chip */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-medium text-slate-600">
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-amber-700 font-semibold">Offline</span>
              </>
            )}
          </div>

          {/* Google Account Authentication & Profile */}
          <GoogleAuthButton
            user={googleUser}
            isAuthenticated={isGoogleAuthenticated}
            isLoggingIn={isLoggingInGoogle}
            onLogin={onGoogleLogin}
            onLogout={onGoogleLogout}
            spreadsheetId={settings.spreadsheetId}
            driveFolderId={settings.driveFolderId}
          />

          {/* Quick Google Drive Button */}
          <button
            id="btn-quick-drive"
            onClick={() => openGoogleDrive(settings.driveFolderId || settings.driveFolderUrl)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            title="Abrir Google Drive / Pasta de Avaliações"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Drive</span>
            <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
          </button>

          {/* Quick Google Sheets Button */}
          <button
            id="btn-quick-sheets"
            onClick={() => openGoogleSheets(settings.spreadsheetId || settings.spreadsheetUrl)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            title="Abrir Planilha de Respostas no Google Sheets"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Planilha</span>
            <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
          </button>

          {/* New Google Doc Report shortcut */}
          <button
            id="btn-quick-docs"
            onClick={openGoogleDocsNew}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            title="Novo Documento no Google Docs"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden lg:inline">Docs</span>
            <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
          </button>

          {/* History Button */}
          <button
            id="btn-open-history"
            onClick={onOpenHistory}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
            title="Ver histórico de avaliações salvas"
          >
            <History className="w-3.5 h-3.5 text-slate-600" />
            <span>Histórico</span>
            {evaluationsCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold">
                {evaluationsCount}
              </span>
            )}
          </button>

          {/* Modelo Personalizado de Respostas */}
          {onOpenTemplateModal && (
            <button
              id="btn-open-template-modal"
              onClick={onOpenTemplateModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Documento Modelo Personalizado para Salvar Respostas e Folha de Observação BNCC"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">Modelo de Respostas</span>
              <span className="md:hidden">Modelo</span>
            </button>
          )}

          {/* Google Apps Script Modal */}
          <button
            id="btn-open-script-code"
            onClick={onOpenScriptModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
            title="Código do Google Apps Script (Code.gs) e Instalação"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Code.gs</span>
          </button>

          {/* Admin ACL Panel Button (for authorized administrators) */}
          {isAdmin && onOpenAdmin && (
            <button
              id="btn-open-admin-panel"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
              title="Painel do Administrador - Gestão de Acessos & Permissões"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Admin</span>
            </button>
          )}

          {/* Theme Quick Toggle (Acessibilidade) */}
          {onToggleTheme && (
            <button
              id="btn-quick-theme-toggle"
              type="button"
              onClick={onToggleTheme}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                settings.theme === 'alto_contraste'
                  ? 'bg-amber-400 text-black font-bold ring-2 ring-amber-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={
                settings.theme === 'alto_contraste'
                  ? 'Mudar para Tema Padrão'
                  : 'Ativar Tema Alto Contraste (Acessibilidade)'
              }
              aria-label="Alternar tema de acessibilidade"
            >
              <Contrast className="w-4 h-4" />
            </button>
          )}

          {/* Settings Button */}
          <button
            id="btn-open-settings"
            onClick={onOpenSettings}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Configurações e Integração Google Workspace"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
