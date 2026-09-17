import { AppSettings, EvaluationRecord } from '../types';
import { updateEvaluationStatus } from './storage';

/**
 * Open Google Drive in a new tab
 */
export function openGoogleDrive(folderIdOrUrl?: string) {
  if (folderIdOrUrl && folderIdOrUrl.trim() !== '') {
    if (folderIdOrUrl.startsWith('http')) {
      window.open(folderIdOrUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    window.open(`https://drive.google.com/drive/folders/${folderIdOrUrl.trim()}`, '_blank', 'noopener,noreferrer');
    return;
  }
  window.open('https://drive.google.com/', '_blank', 'noopener,noreferrer');
}

/**
 * Open Google Sheets in a new tab
 */
export function openGoogleSheets(spreadsheetIdOrUrl?: string) {
  if (spreadsheetIdOrUrl && spreadsheetIdOrUrl.trim() !== '') {
    if (spreadsheetIdOrUrl.startsWith('http')) {
      window.open(spreadsheetIdOrUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    window.open(`https://docs.google.com/spreadsheets/d/${spreadsheetIdOrUrl.trim()}/edit`, '_blank', 'noopener,noreferrer');
    return;
  }
  window.open('https://sheets.google.com/', '_blank', 'noopener,noreferrer');
}

/**
 * Open Google Apps Script editor
 */
export function openGoogleAppsScript() {
  window.open('https://script.google.com/', '_blank', 'noopener,noreferrer');
}

/**
 * Open new Google Doc for report writing
 */
export function openGoogleDocsNew() {
  window.open('https://docs.google.com/document/create', '_blank', 'noopener,noreferrer');
}

/**
 * Submit answers to deployed Google Apps Script Web App
 */
export async function sendToGoogleAppsScript(
  record: EvaluationRecord,
  settings: AppSettings
): Promise<{ sucesso: boolean; mensagem: string }> {
  if (!navigator.onLine) {
    return {
      sucesso: false,
      mensagem: 'Dispositivo offline. Resposta armazenada no dispositivo e agendada para sincronização automática.'
    };
  }

  const endpoint = settings.webAppUrl ? settings.webAppUrl.trim() : '';

  if (!endpoint) {
    return {
      sucesso: true,
      mensagem: 'Salvo localmente no dispositivo (PWA) com sucesso! Configure o URL do Web App nas configurações para enviar à planilha.'
    };
  }

  const payload = {
    sessionId: record.sessionId,
    timestamp: record.timestamp,
    tipoQuestionario: record.tipoQuestionario,
    criancaNome: record.criancaNome,
    faixaEtaria: record.faixaEtaria,
    educadorNome: record.educadorNome,
    turma: record.turma,
    respostas: record.respostas,
    mediasPorCampo: record.mediasPorCampo,
    parecerDescritivo: record.parecerDescritivo,
    spreadsheetId: settings.spreadsheetId || undefined,
    emailDestinatario: settings.emailDestinatario || undefined
  };

  try {
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    updateEvaluationStatus(record.sessionId, 'sincronizado');
    return {
      sucesso: true,
      mensagem: 'Dados enviados e sincronizados com o Google Workspace!'
    };
  } catch (error: any) {
    console.warn('Network error when sending to Google Apps Script:', error);
    updateEvaluationStatus(record.sessionId, 'pendente_offline', error.message);
    return {
      sucesso: false,
      mensagem: 'Não foi possível contatar o Google Apps Script. O registro foi mantido na fila offline.'
    };
  }
}

/**
 * Synchronize all pending records when online
 */
export async function syncAllPendingRecords(
  records: EvaluationRecord[],
  settings: AppSettings,
  onProgress?: (synced: number, total: number) => void
): Promise<{ total: number; successCount: number; errors: number }> {
  const pending = records.filter(r => r.status === 'pendente_offline');
  let successCount = 0;
  let errors = 0;

  for (let i = 0; i < pending.length; i++) {
    const rec = pending[i];
    const res = await sendToGoogleAppsScript(rec, settings);
    if (res.sucesso) {
      successCount++;
    } else {
      errors++;
    }
    if (onProgress) {
      onProgress(i + 1, pending.length);
    }
  }

  return { total: pending.length, successCount, errors };
}
