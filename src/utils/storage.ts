import { AppSettings, EvaluationRecord, TipoQuestionario } from '../types';
import { getQuestoesPorTipo } from './evaluationCalculator';
import { CAMPOS_BNCC } from '../data/questionarios';

const SETTINGS_KEY = 'bncc_questionario_settings_v2';
const HISTORY_KEY = 'bncc_questionario_history_v2';

export const DEFAULT_SETTINGS: AppSettings = {
  spreadsheetId: '',
  spreadsheetUrl: '',
  driveFolderId: '',
  driveFolderUrl: 'https://drive.google.com/',
  webAppUrl: '',
  emailDestinatario: '',
  primaryColor: '#4F46E5',
  autoSyncOnOnline: true,
  defaultTipoQuestionario: 'bebes',
  theme: 'padrao'
};

export function getStoredSettings(): AppSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (e) {
    console.error('Error loading settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}

export function getStoredEvaluations(): EvaluationRecord[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading evaluations:', e);
    return [];
  }
}

export function saveEvaluationRecord(record: EvaluationRecord): EvaluationRecord[] {
  const current = getStoredEvaluations();
  const updated = [record, ...current.filter(r => r.sessionId !== record.sessionId)];
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving evaluation record:', e);
  }
  return updated;
}

export function updateEvaluationStatus(sessionId: string, status: EvaluationRecord['status'], errorMsg?: string): void {
  const current = getStoredEvaluations();
  const updated = current.map(item => {
    if (item.sessionId === sessionId) {
      return { ...item, status, syncError: errorMsg };
    }
    return item;
  });
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error updating evaluation status:', e);
  }
}

export function deleteEvaluationRecord(sessionId: string): EvaluationRecord[] {
  const current = getStoredEvaluations();
  const updated = current.filter(r => r.sessionId !== sessionId);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting evaluation:', e);
  }
  return updated;
}

export function getPendingEvaluationsCount(): number {
  const list = getStoredEvaluations();
  return list.filter(r => r.status === 'pendente_offline').length;
}

/**
 * Generate CSV compatible with Excel and Google Sheets with UTF-8 BOM
 */
export function exportEvaluationsToCSV(records: EvaluationRecord[], tipo: TipoQuestionario): void {
  const questoes = getQuestoesPorTipo(tipo);
  const headers = [
    'Carimbo de Data/Hora',
    'ID da Sessão',
    'Criança',
    'Grupo / Faixa Etária',
    'Educador(a)',
    'Turma',
    'Status'
  ];

  // Add 5 summary Campo columns
  CAMPOS_BNCC.forEach(c => {
    headers.push(`"MÉDIA - ${c.nomeCurto}"`);
  });

  // Add all 75 questions
  questoes.forEach(q => {
    headers.push(`"[${q.campoNomeCurto} Q${q.numero}] ${q.pergunta.replace(/"/g, '""')}"`);
  });

  headers.push('"Parecer Descritivo Geral"');

  const rows: string[] = [headers.join(',')];

  const filteredRecords = records.filter(r => r.tipoQuestionario === tipo || !r.tipoQuestionario);

  filteredRecords.forEach(rec => {
    const dateFormatted = new Date(rec.timestamp).toLocaleString('pt-BR');
    const row = [
      `"${dateFormatted}"`,
      `"${rec.sessionId}"`,
      `"${(rec.criancaNome || '').replace(/"/g, '""')}"`,
      `"${(rec.faixaEtaria || '').replace(/"/g, '""')}"`,
      `"${(rec.educadorNome || '').replace(/"/g, '""')}"`,
      `"${(rec.turma || '').replace(/"/g, '""')}"`,
      `"${rec.status}"`
    ];

    // Add Campo averages
    CAMPOS_BNCC.forEach(c => {
      const media = rec.mediasPorCampo?.[c.id];
      row.push(media !== undefined ? `"${media}"` : '""');
    });

    // Add 75 question values
    questoes.forEach(q => {
      const val = rec.respostas[q.id];
      if (val !== undefined && val !== null) {
        row.push(`"${String(val).replace(/"/g, '""')}"`);
      } else {
        row.push('""');
      }
    });

    row.push(`"${(rec.parecerDescritivo || '').replace(/"/g, '""')}"`);
    rows.push(row.join(','));
  });

  const csvContent = '\uFEFF' + rows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `avaliacoes_bncc_${tipo}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
