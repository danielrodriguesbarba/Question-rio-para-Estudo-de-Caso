import React, { useState } from 'react';
import { 
  CheckCircle2, 
  RotateCcw, 
  FileText, 
  FileSpreadsheet, 
  Copy, 
  Check, 
  HardDrive,
  Baby,
  Users,
  ExternalLink,
  FolderOpen,
  Cloud,
  Loader2,
  FileDown
} from 'lucide-react';
import { User } from 'firebase/auth';
import { EvaluationRecord } from '../types';
import { openGoogleSheets, openGoogleDrive } from '../utils/googleWorkspace';
import { CAMPOS_BNCC } from '../data/questionarios';
import { exportEvaluationToPDF } from '../utils/pdfExport';

interface SuccessScreenProps {
  evaluation: EvaluationRecord;
  onReset: () => void;
  onOpenReport: () => void;
  spreadsheetId?: string;
  driveFolderId?: string;
  googleUser: User | null;
  isGoogleAuthenticated: boolean;
  onGoogleLogin: () => Promise<any>;
  onSyncToGoogle: (record: EvaluationRecord) => Promise<any>;
  isSyncingToGoogle: boolean;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  evaluation,
  onReset,
  onOpenReport,
  spreadsheetId,
  driveFolderId,
  googleUser,
  isGoogleAuthenticated,
  onGoogleLogin,
  onSyncToGoogle,
  isSyncingToGoogle
}) => {
  const [copied, setCopied] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const handleCopySession = () => {
    navigator.clipboard.writeText(evaluation.sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerSync = async () => {
    try {
      const res = await onSyncToGoogle(evaluation);
      if (res && res.sucesso) {
        setSyncFeedback({ msg: 'Salvo com sucesso na sua conta Google (Sheets & Drive)!', type: 'success' });
      } else {
        setSyncFeedback({ msg: res?.mensagem || 'Erro ao sincronizar', type: 'error' });
      }
    } catch (err: any) {
      setSyncFeedback({ msg: err.message || 'Erro ao sincronizar', type: 'error' });
    }
  };

  const isSynced = evaluation.status === 'sincronizado';
  const isBebes = evaluation.tipoQuestionario === 'bebes';

  const sheetsUrl = evaluation.spreadsheetUrl || (spreadsheetId ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit` : undefined);
  const driveDossierUrl = evaluation.driveFileUrl;

  return (
    <section className="text-center animate-in fade-in duration-300 py-2">
      {/* Success Icon */}
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-xs">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
        Avaliação BNCC Concluída!
      </h2>
      <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto mb-4">
        Os 75 indicadores de <strong>{evaluation.criancaNome || 'criança'}</strong> foram computados e registrados com sucesso.
      </p>

      {/* Tipo e Faixa */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-6 bg-slate-100 text-slate-700 border border-slate-200">
        {isBebes ? <Baby className="w-3.5 h-3.5 text-purple-600" /> : <Users className="w-3.5 h-3.5 text-blue-600" />}
        <span>{isBebes ? 'Questionário 1: Bebês (6m a 1a6m)' : 'Questionário 2: Crianças Bem Pequenas (1a7m a 3a11m)'}</span>
      </div>

      {/* Campo Averages Preview */}
      <div className="grid grid-cols-5 gap-1.5 max-w-md mx-auto mb-6">
        {CAMPOS_BNCC.map(c => {
          const media = evaluation.mediasPorCampo?.[c.id] || 0;
          return (
            <div key={c.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold block">C{c.id}</span>
              <span className="text-xs font-bold text-indigo-700">{media}</span>
            </div>
          );
        })}
      </div>

      {/* Google Account Persistence Status & Sync Box */}
      {isGoogleAuthenticated ? (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 mb-6 text-left">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Cloud className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-sm text-emerald-950">
                  {isSynced ? 'Salvo na sua Conta Google' : 'Pronto para salvar na sua Conta Google'}
                </span>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                  {googleUser?.email}
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-1">
                {isSynced
                  ? 'Esta avaliação já foi arquivada na sua planilha do Google Sheets e o dossiê pedagógico salvo no seu Google Drive.'
                  : 'Clique no botão abaixo para gravar os dados na sua planilha e fazer upload do dossiê no Drive.'}
              </p>

              {/* Direct links to user's Google Files if available */}
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-emerald-200/60">
                {sheetsUrl && (
                  <button
                    onClick={() => openGoogleSheets(sheetsUrl)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-100/50 transition cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Abrir na Minha Planilha Sheets</span>
                    <ExternalLink className="w-3 h-3 text-emerald-600" />
                  </button>
                )}
                {driveDossierUrl && (
                  <a
                    href={driveDossierUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-100/50 transition"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                    <span>Ver Dossiê no Google Drive</span>
                    <ExternalLink className="w-3 h-3 text-emerald-600" />
                  </a>
                )}
                <button
                  onClick={handleTriggerSync}
                  disabled={isSyncingToGoogle}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition cursor-pointer disabled:opacity-60 ml-auto"
                >
                  {isSyncingToGoogle ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Salvando no Google...</span>
                    </>
                  ) : (
                    <>
                      <Cloud className="w-3.5 h-3.5" />
                      <span>{isSynced ? 'Atualizar no Google' : 'Salvar na Conta Google'}</span>
                    </>
                  )}
                </button>
              </div>

              {syncFeedback && (
                <p className={`text-xs mt-2 font-medium ${syncFeedback.type === 'success' ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {syncFeedback.msg}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Not logged in banner */
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">
                Salvo localmente no dispositivo (Modo Offline PWA)
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Faça login com sua conta Google para salvar tudo automaticamente na sua planilha e no seu Google Drive.
              </p>
            </div>
          </div>
          <button
            onClick={onGoogleLogin}
            className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-300 shadow-2xs transition cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
            <span>Conectar Conta Google</span>
          </button>
        </div>
      )}

      {/* Session ID Box */}
      <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-3.5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="text-slate-600">
          <span>Identificador da Sessão: </span>
          <code className="bg-slate-200/80 text-indigo-700 font-mono font-bold px-2 py-1 rounded-md ml-1">
            {evaluation.sessionId}
          </code>
        </div>
        <button
          onClick={handleCopySession}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copiar ID</span>
            </>
          )}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => exportEvaluationToPDF(evaluation)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition cursor-pointer"
          title="Baixar diretamente o Relatório Consolidado em formato PDF"
        >
          <FileDown className="w-4 h-4" />
          <span>Baixar PDF Oficial</span>
        </button>

        <button
          onClick={onOpenReport}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 transition cursor-pointer"
        >
          <FileText className="w-4 h-4 text-indigo-600" />
          <span>Ver Dossiê Completo</span>
        </button>

        <button
          onClick={() => openGoogleSheets(sheetsUrl || spreadsheetId)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 transition cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Abrir Planilha Google</span>
        </button>

        <button
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Nova Avaliação</span>
        </button>
      </div>
    </section>
  );
};
