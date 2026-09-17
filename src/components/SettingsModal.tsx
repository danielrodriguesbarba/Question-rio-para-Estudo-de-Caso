import React, { useState } from 'react';
import { 
  X, 
  Save, 
  FolderOpen, 
  FileSpreadsheet, 
  Mail, 
  Globe, 
  RotateCcw, 
  Check, 
  Info,
  Wifi,
  Cloud,
  ExternalLink,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Contrast,
  Sun
} from 'lucide-react';
import { User } from 'firebase/auth';
import { AppSettings, AppTheme, TipoQuestionario } from '../types';
import { DEFAULT_SETTINGS, saveStoredSettings } from '../utils/storage';
import { getOrCreateUserSpreadsheet, getOrCreateDossiersFolder } from '../utils/googleDriveSheetsSync';
import { FileCheck2, Building, GraduationCap, User as UserIcon } from 'lucide-react';

interface SettingsModalProps {
  settings: AppSettings;
  onClose: () => void;
  onSave: (newSettings: AppSettings) => void;
  googleUser?: User | null;
  isGoogleAuthenticated?: boolean;
  googleToken?: string | null;
  onGoogleLogin?: () => Promise<any>;
  onGoogleLogout?: () => Promise<void>;
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
  onOpenTemplateModal?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onClose,
  onSave,
  googleUser,
  isGoogleAuthenticated = false,
  googleToken,
  onGoogleLogin,
  onGoogleLogout,
  isAdmin = false,
  onOpenAdmin,
  onOpenTemplateModal
}) => {
  const [form, setForm] = useState<AppSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleThemeChange = (newTheme: AppTheme) => {
    setForm((prev) => ({ ...prev, theme: newTheme }));
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'alto_contraste') {
      document.documentElement.classList.add('theme-alto-contraste');
    } else {
      document.documentElement.classList.remove('theme-alto-contraste');
    }
  };

  const handleClose = () => {
    const originalTheme = settings.theme || 'padrao';
    document.documentElement.setAttribute('data-theme', originalTheme);
    if (originalTheme === 'alto_contraste') {
      document.documentElement.classList.add('theme-alto-contraste');
    } else {
      document.documentElement.classList.remove('theme-alto-contraste');
    }
    onClose();
  };

  const handleResetToDefault = () => {
    if (confirm('Atenção: Deseja restaurar os parâmetros do aplicativo para o padrão inicial?')) {
      setForm({ ...DEFAULT_SETTINGS });
      document.documentElement.setAttribute('data-theme', DEFAULT_SETTINGS.theme || 'padrao');
      document.documentElement.classList.remove('theme-alto-contraste');
    }
  };

  const handleAutoCreateSpreadsheet = async () => {
    if (!googleToken) {
      if (onGoogleLogin) await onGoogleLogin();
      return;
    }
    setIsCreatingSheet(true);
    setActionFeedback(null);
    try {
      const sheet = await getOrCreateUserSpreadsheet(googleToken);
      setForm(prev => ({
        ...prev,
        spreadsheetId: sheet.id,
        spreadsheetUrl: sheet.url
      }));
      setActionFeedback(`Planilha vinculada com sucesso! ID: ${sheet.id}`);
    } catch (err: any) {
      setActionFeedback(`Erro: ${err.message || 'Falha ao vincular planilha'}`);
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const handleAutoCreateFolder = async () => {
    if (!googleToken) {
      if (onGoogleLogin) await onGoogleLogin();
      return;
    }
    setIsCreatingFolder(true);
    setActionFeedback(null);
    try {
      const folder = await getOrCreateDossiersFolder(googleToken);
      setForm(prev => ({
        ...prev,
        driveFolderId: folder.id,
        driveFolderUrl: folder.url
      }));
      setActionFeedback(`Pasta vinculada no Google Drive! ID: ${folder.id}`);
    } catch (err: any) {
      setActionFeedback(`Erro: ${err.message || 'Falha ao vincular pasta no Drive'}`);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSettings(form);
    const selectedTheme = form.theme || 'padrao';
    document.documentElement.setAttribute('data-theme', selectedTheme);
    if (selectedTheme === 'alto_contraste') {
      document.documentElement.classList.add('theme-alto-contraste');
    } else {
      document.documentElement.classList.remove('theme-alto-contraste');
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onSave(form);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              Configurações & Google Workspace
            </h3>
            <p className="text-xs text-slate-500">
              Vínculo com Google Drive, Google Sheets e Conta Google do Usuário
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
          
          {/* Google Account Status Banner */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70">
            <span className="font-bold text-xs text-slate-800 uppercase tracking-wider block mb-2">
              Conta Google Vinculada
            </span>
            {isGoogleAuthenticated && googleUser ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {googleUser.photoURL ? (
                    <img
                      src={googleUser.photoURL}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full ring-1 ring-emerald-400 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                      {(googleUser.displayName || 'G')[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-xs text-slate-900 leading-tight">
                      {googleUser.displayName || 'Usuário Google'}
                    </p>
                    <p className="text-[11px] text-slate-500">{googleUser.email}</p>
                  </div>
                </div>
                {onGoogleLogout && (
                  <button
                    type="button"
                    onClick={onGoogleLogout}
                    className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                  >
                    Desconectar
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <p className="text-xs text-slate-600">
                  Conecte sua conta Google para salvar planilhas e dossiês no seu Drive.
                </p>
                {onGoogleLogin && (
                  <button
                    type="button"
                    onClick={onGoogleLogin}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <Cloud className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Conectar Google</span>
                  </button>
                )}
              </div>
            )}

            {/* Quick provision buttons for authenticated users */}
            {isGoogleAuthenticated && (
              <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleAutoCreateSpreadsheet}
                  disabled={isCreatingSheet}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-100/70 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                  title="Criar ou localizar automaticamente a planilha oficial no Google Sheets"
                >
                  {isCreatingSheet ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />}
                  <span>Criar/Vincular Planilha no Sheets</span>
                </button>

                <button
                  type="button"
                  onClick={handleAutoCreateFolder}
                  disabled={isCreatingFolder}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-100/70 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                  title="Criar ou localizar automaticamente a pasta de dossiês no Google Drive"
                >
                  {isCreatingFolder ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FolderOpen className="w-3.5 h-3.5 text-amber-700" />}
                  <span>Criar/Vincular Pasta no Drive</span>
                </button>
              </div>
            )}

            {actionFeedback && (
              <p className="text-[11px] text-indigo-700 font-medium mt-2">
                {actionFeedback}
              </p>
            )}
          </div>

          {/* Admin Management Section (if admin) */}
          {isAdmin && onOpenAdmin && (
            <div className="p-3.5 rounded-2xl border border-indigo-200 bg-indigo-50/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-950">
                    Painel do Administrador & Permissões
                  </h4>
                  <p className="text-[11px] text-indigo-700">
                    Cadastrar e gerenciar contas Google com acesso ao programa
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer shadow-2xs shrink-0"
              >
                Gerenciar Acessos
              </button>
            </div>
          )}

          {/* Tema & Acessibilidade Visual (Padrão vs Alto Contraste) */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-2">
                <Contrast className="w-4 h-4 text-indigo-600" />
                <span>Tema & Acessibilidade Visual</span>
              </label>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                WCAG AAA
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Alterne entre o tema visual Padrão e o tema de Alto Contraste para garantir máxima legibilidade e conformidade de acessibilidade.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Opção Tema Padrão */}
              <button
                type="button"
                id="theme-option-padrao"
                onClick={() => handleThemeChange('padrao')}
                className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  (form.theme || 'padrao') === 'padrao'
                    ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-xs sm:text-sm text-slate-900">Tema Padrão</span>
                  </div>
                  {(form.theme || 'padrao') === 'padrao' && (
                    <Check className="w-4 h-4 text-indigo-600 font-bold" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Visual moderno com paleta institucional suave, fundo claro e contrastes balanceados.
                </p>
              </button>

              {/* Opção Tema Alto Contraste */}
              <button
                type="button"
                id="theme-option-alto-contraste"
                onClick={() => handleThemeChange('alto_contraste')}
                className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  form.theme === 'alto_contraste'
                    ? 'border-indigo-600 bg-slate-900 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Contrast className="w-4 h-4 text-amber-500" />
                    <span className={`font-bold text-xs sm:text-sm ${form.theme === 'alto_contraste' ? 'text-white' : 'text-slate-900'}`}>
                      Alto Contraste
                    </span>
                  </div>
                  {form.theme === 'alto_contraste' && (
                    <Check className="w-4 h-4 text-amber-400 font-bold" />
                  )}
                </div>
                <p className={`text-[11px] leading-tight ${form.theme === 'alto_contraste' ? 'text-amber-200' : 'text-slate-500'}`}>
                  Fundo preto profundo, bordas espessas nítidas e textos em amarelo/branco (WCAG AAA).
                </p>
              </button>
            </div>
          </div>

          {/* Dados Padrão para Modelos e Relatórios */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                  Dados Padrão da Instituição e Educador (Modelos e PDF)
                </h4>
              </div>
              {onOpenTemplateModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenTemplateModal();
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Gerador de Modelo</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Building className="w-3 h-3 text-slate-500" />
                  <span>Nome da Instituição de Ensino</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex.: Centro de Educação Infantil Girassol"
                  value={form.instituicaoNome || ''}
                  onChange={(e) => setForm({ ...form, instituicaoNome: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 bg-white text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <UserIcon className="w-3 h-3 text-slate-500" />
                  <span>Educador(a) Responsável Padrão</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex.: Profa. Juliana Santos"
                  value={form.defaultEducadorNome || ''}
                  onChange={(e) => setForm({ ...form, defaultEducadorNome: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 bg-white text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-slate-500" />
                <span>Turma / Agrupamento Padrão</span>
              </label>
              <input
                type="text"
                placeholder="Ex.: Berçário II ou Maternal I"
                value={form.defaultTurma || ''}
                onChange={(e) => setForm({ ...form, defaultTurma: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 bg-white text-xs sm:text-sm"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Esses dados são aplicados automaticamente no cabeçalho dos Relatórios PDF e no Documento Modelo de Respostas.
              </p>
            </div>
          </div>

          {/* Google Spreadsheet ID or URL */}
          <div>
            <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              ID ou Link da Planilha Google Sheets
            </label>
            <input
              type="text"
              placeholder="Ex.: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms ou link completo"
              value={form.spreadsheetId}
              onChange={(e) => setForm({ ...form, spreadsheetId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white text-xs sm:text-sm font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Permite abrir a planilha oficial das avaliações com 1 clique diretamente na barra superior.
            </p>
          </div>

          {/* Google Drive Folder ID or URL */}
          <div>
            <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-amber-500" />
              ID ou Link da Pasta no Google Drive
            </label>
            <input
              type="text"
              placeholder="Ex.: 1a2b3c4d5e6f... ou link completo da pasta"
              value={form.driveFolderId}
              onChange={(e) => setForm({ ...form, driveFolderId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white text-xs sm:text-sm font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Pasta no Google Drive onde você arquiva os relatórios e dossiês das crianças em PDF.
            </p>
          </div>

          {/* Web App URL */}
          <div>
            <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-indigo-600" />
              URL do Web App (Google Apps Script - Opcional)
            </label>
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={form.webAppUrl}
              onChange={(e) => setForm({ ...form, webAppUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white text-xs sm:text-sm font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3 text-indigo-500 shrink-0" />
              Caso deseje usar o webhook do Code.gs, insira a URL do Web App implantado.
            </p>
          </div>

          {/* Email for notifications */}
          <div>
            <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-600" />
              E-mail de Destino para Notificações (Opcional)
            </label>
            <input
              type="email"
              placeholder="coordenação@escola.edu.br"
              value={form.emailDestinatario}
              onChange={(e) => setForm({ ...form, emailDestinatario: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white text-xs sm:text-sm"
            />
          </div>

          {/* Auto-sync on online toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.autoSyncOnOnline}
                onChange={(e) => setForm({ ...form, autoSyncOnOnline: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
              />
              <div>
                <span className="font-semibold text-slate-800 text-xs sm:text-sm">
                  Sincronização Automática ao Reconectar à Internet
                </span>
                <p className="text-[11px] text-slate-500">
                  Envia avaliações gravadas offline assim que a conexão de rede for restabelecida.
                </p>
              </div>
            </label>
          </div>

        </form>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-100 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-2xs transition cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Salvo!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
