import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  FolderOpen, 
  FileSpreadsheet, 
  Settings, 
  History, 
  Code2,
  Loader2
} from 'lucide-react';
import { AppSettings, AppTheme, EvaluationRecord, TipoQuestionario } from './types';
import { 
  getStoredSettings, 
  getStoredEvaluations, 
  saveEvaluationRecord, 
  deleteEvaluationRecord,
  saveStoredSettings
} from './utils/storage';
import { 
  sendToGoogleAppsScript, 
  syncAllPendingRecords, 
  openGoogleDrive, 
  openGoogleSheets 
} from './utils/googleWorkspace';
import { 
  syncEvaluationToUserGoogleAccount, 
  uploadDossierToGoogleDrive 
} from './utils/googleDriveSheetsSync';
import { calcularMediasPorCampo } from './utils/evaluationCalculator';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useGoogleAuth } from './hooks/useGoogleAuth';
import { isUserAuthorized, isUserAdmin } from './utils/accessControl';
import { QuickDriveBar } from './components/QuickDriveBar';
import { OfflineIndicator } from './components/OfflineIndicator';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuestionWizard } from './components/QuestionWizard';
import { SuccessScreen } from './components/SuccessScreen';
import { ReportModal } from './components/ReportModal';
import { HistoryModal } from './components/HistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { GoogleScriptModal } from './components/GoogleScriptModal';
import { GoogleLoginGate } from './components/GoogleLoginGate';
import { UnauthorizedScreen } from './components/UnauthorizedScreen';
import { AdminAccessModal } from './components/AdminAccessModal';
import { TemplateModal } from './components/TemplateModal';
import { getAccessToken } from './utils/googleAuth';

export default function App() {
  const isOnline = useOnlineStatus();
  const { 
    user: googleUser, 
    token: googleToken, 
    isLoggingIn: isLoggingInGoogle, 
    isAuthenticated: isGoogleAuthenticated, 
    isInitialized: isGoogleAuthInitialized,
    login: handleGoogleLogin, 
    logout: handleGoogleLogout 
  } = useGoogleAuth();

  // Auth & Access Control Refresh trigger
  const [authRefreshKey, setAuthRefreshKey] = useState(0);

  // Check authorization and admin role
  const authStatus = useMemo(() => {
    if (!googleUser?.email) return { authorized: false, role: undefined };
    return isUserAuthorized(googleUser.email);
  }, [googleUser?.email, authRefreshKey]);

  const isAdmin = useMemo(() => {
    if (!googleUser?.email) return false;
    return isUserAdmin(googleUser.email);
  }, [googleUser?.email, authRefreshKey]);

  // Primary state
  const [screen, setScreen] = useState<'welcome' | 'wizard' | 'success'>('welcome');
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings);
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>(getStoredEvaluations);

  // Form State for Active Evaluation
  const [tipoQuestionario, setTipoQuestionario] = useState<TipoQuestionario>(
    settings.defaultTipoQuestionario || 'bebes'
  );
  const [criancaNome, setCriancaNome] = useState('');
  const [turma, setTurma] = useState('');
  const [educadorNome, setEducadorNome] = useState('');
  const [respostas, setRespostas] = useState<Record<string, number | string>>({});
  const [observacoesPorCampo, setObservacoesPorCampo] = useState<Record<number, string>>({});
  const [parecerDescritivo, setParecerDescritivo] = useState('');

  const [currentEvaluation, setCurrentEvaluation] = useState<EvaluationRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSyncingToGoogle, setIsSyncingToGoogle] = useState(false);

  // Modals
  const [activeModal, setActiveModal] = useState<'report' | 'history' | 'settings' | 'script' | 'admin' | 'template' | null>(null);
  const [reportTarget, setReportTarget] = useState<EvaluationRecord | null>(null);

  const pendingCount = evaluations.filter((r) => r.status === 'pendente_offline').length;

  // Apply theme to document element
  useEffect(() => {
    const theme = settings.theme || 'padrao';
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'alto_contraste') {
      document.documentElement.classList.add('theme-alto-contraste');
    } else {
      document.documentElement.classList.remove('theme-alto-contraste');
    }
  }, [settings.theme]);

  // Prepopulate default educator and turma when settings change
  useEffect(() => {
    if (!educadorNome && settings.defaultEducadorNome) {
      setEducadorNome(settings.defaultEducadorNome);
    }
    if (!turma && settings.defaultTurma) {
      setTurma(settings.defaultTurma);
    }
  }, [settings.defaultEducadorNome, settings.defaultTurma]);

  // Auto-sync when coming back online if enabled
  useEffect(() => {
    if (isOnline && settings.autoSyncOnOnline && pendingCount > 0) {
      if (isGoogleAuthenticated && googleToken) {
        handleSyncAllToGoogle();
      } else if (settings.webAppUrl) {
        handleSyncAll();
      }
    }
  }, [isOnline, isGoogleAuthenticated, googleToken]);

  const handleStart = () => {
    setRespostas({});
    setObservacoesPorCampo({});
    setParecerDescritivo('');
    if (!educadorNome && settings.defaultEducadorNome) {
      setEducadorNome(settings.defaultEducadorNome);
    }
    if (!turma && settings.defaultTurma) {
      setTurma(settings.defaultTurma);
    }
    setScreen('wizard');
  };

  const handleUpdateResposta = (questionId: string, value: number) => {
    setRespostas((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleUpdateObservacaoCampo = (campoId: number, texto: string) => {
    setObservacoesPorCampo((prev) => ({
      ...prev,
      [campoId]: texto
    }));
  };

  /**
   * Sync a single evaluation record directly into user's Google Account (Sheets + Drive)
   */
  const handleSyncEvaluationToGoogle = useCallback(async (record: EvaluationRecord) => {
    let token = googleToken;
    if (!token) {
      const loginRes = await handleGoogleLogin();
      if (!loginRes?.accessToken) return;
      token = loginRes.accessToken;
    }

    setIsSyncingToGoogle(true);
    try {
      const syncResult = await syncEvaluationToUserGoogleAccount(record, token);
      if (syncResult.sucesso) {
        record.status = 'sincronizado';
        if (syncResult.spreadsheetUrl) record.spreadsheetUrl = syncResult.spreadsheetUrl;
        if (syncResult.dossierUrl) record.driveFileUrl = syncResult.dossierUrl;
        if (syncResult.dossierFileId) record.driveFileId = syncResult.dossierFileId;
        if (googleUser?.email) record.googleAccountEmail = googleUser.email;

        saveEvaluationRecord(record);
        setEvaluations(getStoredEvaluations());
        setCurrentEvaluation({ ...record });

        // Update settings with created sheet / folder if not already set
        if (syncResult.spreadsheetId && !settings.spreadsheetId) {
          const updatedSettings = {
            ...settings,
            spreadsheetId: syncResult.spreadsheetId,
            spreadsheetUrl: syncResult.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${syncResult.spreadsheetId}/edit`,
            driveFolderId: syncResult.driveFolderId || settings.driveFolderId
          };
          setSettings(updatedSettings);
          saveStoredSettings(updatedSettings);
        }
      }
      return syncResult;
    } finally {
      setIsSyncingToGoogle(false);
    }
  }, [googleToken, googleUser, handleGoogleLogin, settings]);

  /**
   * Sync ALL evaluations to Google Account
   */
  const handleSyncAllToGoogle = useCallback(async () => {
    let token = googleToken;
    if (!token) {
      const loginRes = await handleGoogleLogin();
      if (!loginRes?.accessToken) return;
      token = loginRes.accessToken;
    }

    setIsSyncing(true);
    try {
      const list = getStoredEvaluations();
      for (const rec of list) {
        if (rec.status !== 'sincronizado' || !rec.driveFileUrl) {
          const res = await syncEvaluationToUserGoogleAccount(rec, token);
          if (res.sucesso) {
            rec.status = 'sincronizado';
            if (res.spreadsheetUrl) rec.spreadsheetUrl = res.spreadsheetUrl;
            if (res.dossierUrl) rec.driveFileUrl = res.dossierUrl;
            if (res.dossierFileId) rec.driveFileId = res.dossierFileId;
            saveEvaluationRecord(rec);
          }
        }
      }
      setEvaluations(getStoredEvaluations());
    } finally {
      setIsSyncing(false);
    }
  }, [googleToken, handleGoogleLogin]);

  /**
   * Save dossier to Google Drive from Report modal
   */
  const handleSaveReportToDrive = useCallback(async (record: EvaluationRecord) => {
    let token = googleToken;
    if (!token) {
      const loginRes = await handleGoogleLogin();
      if (!loginRes?.accessToken) return;
      token = loginRes.accessToken;
    }

    const driveInfo = await uploadDossierToGoogleDrive(record, token, settings.driveFolderId);
    record.driveFileUrl = driveInfo.webViewLink;
    record.driveFileId = driveInfo.fileId;
    saveEvaluationRecord(record);
    setEvaluations(getStoredEvaluations());
    if (reportTarget?.sessionId === record.sessionId) {
      setReportTarget({ ...record });
    }
    return { sucesso: true, url: driveInfo.webViewLink };
  }, [googleToken, handleGoogleLogin, settings.driveFolderId, reportTarget]);

  const handleSubmitEvaluation = async () => {
    setIsSubmitting(true);
    const sessionId = `SESS_${Date.now()}`;
    const medias = calcularMediasPorCampo(tipoQuestionario, respostas);

    const newRecord: EvaluationRecord = {
      sessionId,
      timestamp: new Date().toISOString(),
      tipoQuestionario,
      criancaNome: criancaNome.trim(),
      faixaEtaria:
        tipoQuestionario === 'bebes'
          ? 'Bebês (6 meses a 1 ano e 6 meses)'
          : 'Crianças Bem Pequenas (1 ano e 7 meses a 3 anos e 11 meses)',
      educadorNome: educadorNome.trim(),
      turma: turma.trim(),
      respostas,
      observacoesPorCampo,
      mediasPorCampo: medias,
      status: 'pendente_offline',
      parecerDescritivo: parecerDescritivo.trim()
    };

    // 1. Save locally immediately to guarantee offline data safety
    const updatedList = saveEvaluationRecord(newRecord);
    setEvaluations(updatedList);
    setCurrentEvaluation(newRecord);

    // 2. If authenticated with Google, save directly to Google Sheets and Drive
    if (isGoogleAuthenticated && googleToken && isOnline) {
      try {
        const syncResult = await syncEvaluationToUserGoogleAccount(newRecord, googleToken);
        if (syncResult.sucesso) {
          newRecord.status = 'sincronizado';
          if (syncResult.spreadsheetUrl) newRecord.spreadsheetUrl = syncResult.spreadsheetUrl;
          if (syncResult.dossierUrl) newRecord.driveFileUrl = syncResult.dossierUrl;
          if (syncResult.dossierFileId) newRecord.driveFileId = syncResult.dossierFileId;
          saveEvaluationRecord(newRecord);
          setEvaluations(getStoredEvaluations());
          setCurrentEvaluation({ ...newRecord });

          if (syncResult.spreadsheetId && !settings.spreadsheetId) {
            const updatedSettings = {
              ...settings,
              spreadsheetId: syncResult.spreadsheetId,
              spreadsheetUrl: syncResult.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${syncResult.spreadsheetId}/edit`,
              driveFolderId: syncResult.driveFolderId || settings.driveFolderId
            };
            setSettings(updatedSettings);
            saveStoredSettings(updatedSettings);
          }
        }
      } catch (gErr) {
        console.warn('Erro ao salvar no Google Drive/Sheets:', gErr);
      }
    } else if (isOnline && settings.webAppUrl) {
      // 3. Fallback to Google Apps Script webhook if configured
      const syncResult = await sendToGoogleAppsScript(newRecord, settings);
      if (syncResult.sucesso) {
        newRecord.status = 'sincronizado';
        saveEvaluationRecord(newRecord);
        setEvaluations(getStoredEvaluations());
      }
    }

    setIsSubmitting(false);
    setScreen('success');
  };

  const handleReset = () => {
    setCriancaNome('');
    setTurma(settings.defaultTurma || '');
    setEducadorNome(settings.defaultEducadorNome || '');
    setRespostas({});
    setObservacoesPorCampo({});
    setParecerDescritivo('');
    setCurrentEvaluation(null);
    setScreen('welcome');
  };

  const handleSyncAll = async () => {
    if (isSyncing || pendingCount === 0) return;
    setIsSyncing(true);
    await syncAllPendingRecords(evaluations, settings);
    setEvaluations(getStoredEvaluations());
    setIsSyncing(false);
  };

  const handleDeleteEvaluation = (sessionId: string) => {
    const updated = deleteEvaluationRecord(sessionId);
    setEvaluations(updated);
    if (currentEvaluation?.sessionId === sessionId) {
      setCurrentEvaluation(null);
    }
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
    setActiveModal(null);
  };

  const handleToggleTheme = () => {
    const nextTheme: AppTheme = settings.theme === 'alto_contraste' ? 'padrao' : 'alto_contraste';
    const updated = { ...settings, theme: nextTheme };
    setSettings(updated);
    saveStoredSettings(updated);
  };

  // 1. Initial Auth Loading State
  if (!isGoogleAuthInitialized) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-100 p-4 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-xl">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-slate-300">
          Iniciando Questionário BNCC...
        </p>
      </div>
    );
  }

  // 2. Mandatory Google Account Authentication Gate
  if (!isGoogleAuthenticated || !googleUser) {
    return (
      <GoogleLoginGate
        onLogin={handleGoogleLogin}
        isLoggingIn={isLoggingInGoogle}
      />
    );
  }

  // 3. Administrator Access Control Gate
  if (!authStatus.authorized) {
    return (
      <UnauthorizedScreen
        user={googleUser}
        onLogout={handleGoogleLogout}
        onCheckAgain={() => setAuthRefreshKey((k) => k + 1)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-[#0F172A]">
      {/* Top Google Workspace & Drive Quick Bar */}
      <QuickDriveBar
        settings={settings}
        evaluationsCount={evaluations.length}
        pendingCount={pendingCount}
        onOpenSettings={() => setActiveModal('settings')}
        onOpenHistory={() => setActiveModal('history')}
        onOpenScriptModal={() => setActiveModal('script')}
        onOpenTemplateModal={() => setActiveModal('template')}
        onOpenAdmin={() => setActiveModal('admin')}
        isAdmin={isAdmin}
        onToggleTheme={handleToggleTheme}
        googleUser={googleUser}
        isGoogleAuthenticated={isGoogleAuthenticated}
        isLoggingInGoogle={isLoggingInGoogle}
        onGoogleLogin={handleGoogleLogin}
        onGoogleLogout={handleGoogleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm sm:shadow-lg p-5 sm:p-8 relative">
          
          {screen === 'welcome' && (
            <WelcomeScreen
              tipo={tipoQuestionario}
              onSelectTipo={setTipoQuestionario}
              criancaNome={criancaNome}
              onChangeCriancaNome={setCriancaNome}
              turma={turma}
              onChangeTurma={setTurma}
              educadorNome={educadorNome}
              onChangeEducadorNome={setEducadorNome}
              onStart={handleStart}
            />
          )}

          {screen === 'wizard' && (
            <QuestionWizard
              tipo={tipoQuestionario}
              criancaNome={criancaNome}
              turma={turma}
              educadorNome={educadorNome}
              respostas={respostas}
              onUpdateResposta={handleUpdateResposta}
              observacoesPorCampo={observacoesPorCampo}
              onUpdateObservacaoCampo={handleUpdateObservacaoCampo}
              parecerDescritivo={parecerDescritivo}
              onChangeParecerDescritivo={setParecerDescritivo}
              onSubmit={handleSubmitEvaluation}
              isSubmitting={isSubmitting}
              onCancel={() => setScreen('welcome')}
            />
          )}

          {screen === 'success' && currentEvaluation && (
            <SuccessScreen
              evaluation={currentEvaluation}
              onReset={handleReset}
              onOpenReport={() => {
                setReportTarget(currentEvaluation);
                setActiveModal('report');
              }}
              spreadsheetId={settings.spreadsheetId}
              driveFolderId={settings.driveFolderId}
              googleUser={googleUser}
              isGoogleAuthenticated={isGoogleAuthenticated}
              onGoogleLogin={handleGoogleLogin}
              onSyncToGoogle={handleSyncEvaluationToGoogle}
              isSyncingToGoogle={isSyncingToGoogle}
            />
          )}

        </div>

        {/* Workspace Quick Links Footer */}
        <footer className="mt-8 text-center text-xs text-slate-500 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600">
            <button
              onClick={() => openGoogleDrive(settings.driveFolderId)}
              className="hover:text-indigo-600 transition flex items-center gap-1 cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>Google Drive</span>
            </button>
            <span>•</span>
            <button
              onClick={() => openGoogleSheets(settings.spreadsheetId)}
              className="hover:text-indigo-600 transition flex items-center gap-1 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Google Sheets</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal('script')}
              className="hover:text-indigo-600 transition cursor-pointer"
            >
              Backend Code.gs (Workspace)
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal('template')}
              className="hover:text-indigo-600 transition cursor-pointer font-medium text-indigo-700"
            >
              Modelo de Respostas (PDF/Docs)
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal('settings')}
              className="hover:text-indigo-600 transition cursor-pointer"
            >
              Configurações
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Base Nacional Comum Curricular (BNCC) • Educação Infantil • 75 Indicadores por Faixa Etária • PWA Offline & Google Workspace
          </p>
        </footer>
      </main>

      {/* Floating Offline & Sync Notification Banner */}
      <OfflineIndicator
        pendingCount={pendingCount}
        onSyncClick={isGoogleAuthenticated ? handleSyncAllToGoogle : handleSyncAll}
        isSyncing={isSyncing}
      />

      {/* Modals */}
      {activeModal === 'report' && reportTarget && (
        <ReportModal
          evaluation={reportTarget}
          onClose={() => {
            setActiveModal(null);
            setReportTarget(null);
          }}
          driveFolderId={settings.driveFolderId}
          isGoogleAuthenticated={isGoogleAuthenticated}
          onSaveToGoogleDrive={handleSaveReportToDrive}
          institutionName={settings.instituicaoNome}
        />
      )}

      {activeModal === 'history' && (
        <HistoryModal
          records={evaluations}
          onClose={() => setActiveModal(null)}
          onSelectReport={(rec) => {
            setReportTarget(rec);
            setActiveModal('report');
          }}
          onDeleteRecord={handleDeleteEvaluation}
          onSyncAll={isGoogleAuthenticated ? handleSyncAllToGoogle : handleSyncAll}
          isSyncing={isSyncing}
          isGoogleAuthenticated={isGoogleAuthenticated}
          onSyncAllToGoogle={handleSyncAllToGoogle}
          onSyncRecordToGoogle={handleSyncEvaluationToGoogle}
          spreadsheetId={settings.spreadsheetId}
          driveFolderId={settings.driveFolderId}
        />
      )}

      {activeModal === 'settings' && (
        <SettingsModal
          settings={settings}
          onClose={() => setActiveModal(null)}
          onSave={handleSaveSettings}
          googleUser={googleUser}
          isGoogleAuthenticated={isGoogleAuthenticated}
          googleToken={googleToken}
          onGoogleLogin={handleGoogleLogin}
          onGoogleLogout={handleGoogleLogout}
          isAdmin={isAdmin}
          onOpenAdmin={() => setActiveModal('admin')}
          onOpenTemplateModal={() => setActiveModal('template')}
        />
      )}

      {activeModal === 'template' && (
        <TemplateModal
          onClose={() => setActiveModal(null)}
          settings={settings}
          onUpdateSettings={handleSaveSettings}
          isGoogleAuthenticated={isGoogleAuthenticated}
          driveFolderId={settings.driveFolderId}
          getGoogleAccessToken={getAccessToken}
        />
      )}

      {activeModal === 'script' && (
        <GoogleScriptModal
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'admin' && (
        <AdminAccessModal
          onClose={() => setActiveModal(null)}
          currentUserEmail={googleUser.email || undefined}
          onUsersUpdated={() => setAuthRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
}
