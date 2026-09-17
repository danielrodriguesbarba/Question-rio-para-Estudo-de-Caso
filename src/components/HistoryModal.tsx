import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Trash2, 
  FileText, 
  CloudCheck, 
  HardDrive, 
  RefreshCw, 
  Download,
  AlertCircle,
  Baby,
  Users,
  Cloud,
  ExternalLink,
  Loader2,
  FileSpreadsheet,
  FolderOpen,
  Calendar,
  FilterX,
  FileDown
} from 'lucide-react';
import { EvaluationRecord, TipoQuestionario } from '../types';
import { exportEvaluationsToCSV } from '../utils/storage';
import { openGoogleSheets, openGoogleDrive } from '../utils/googleWorkspace';
import { exportEvaluationToPDF } from '../utils/pdfExport';

interface HistoryModalProps {
  records: EvaluationRecord[];
  onClose: () => void;
  onSelectReport: (record: EvaluationRecord) => void;
  onDeleteRecord: (sessionId: string) => void;
  onSyncAll: () => void;
  isSyncing: boolean;
  isGoogleAuthenticated?: boolean;
  onSyncAllToGoogle?: () => Promise<void>;
  onSyncRecordToGoogle?: (record: EvaluationRecord) => Promise<any>;
  spreadsheetId?: string;
  driveFolderId?: string;
}

/**
 * Normalizes string for accent-insensitive search (e.g., 'João' matches 'joao')
 */
function normalizeString(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Formats date to YYYY-MM-DD for comparison with HTML5 date picker
 */
function getIsoDate(timestamp: string): string {
  try {
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  } catch {
    return '';
  }
}

/**
 * Formats date to local pt-BR DD/MM/YYYY
 */
function getPtBrDate(timestamp: string): string {
  try {
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('pt-BR');
  } catch {
    return '';
  }
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  records,
  onClose,
  onSelectReport,
  onDeleteRecord,
  onSyncAll,
  isSyncing,
  isGoogleAuthenticated = false,
  onSyncAllToGoogle,
  onSyncRecordToGoogle,
  spreadsheetId,
  driveFolderId
}) => {
  // Search and filter states
  const [childSearch, setChildSearch] = useState('');
  const [dateSearch, setDateSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'sincronizado' | 'pendente_offline'>('todos');
  const [tipoFilter, setTipoFilter] = useState<'todos' | 'bebes' | 'bem_pequenas'>('todos');
  const [syncingRecordId, setSyncingRecordId] = useState<string | null>(null);

  // Memoized filter calculation for instant response and zero redundant overhead
  const filtered = useMemo(() => {
    const normalizedChildQuery = normalizeString(childSearch);
    
    return records.filter(rec => {
      // 1. Child Name search (also checks turma and sessionId for convenience)
      let matchesChild = true;
      if (normalizedChildQuery) {
        const nomeNorm = normalizeString(rec.criancaNome || '');
        const turmaNorm = normalizeString(rec.turma || '');
        const sessionNorm = normalizeString(rec.sessionId || '');
        const ptBrDate = getPtBrDate(rec.timestamp);
        
        // Match child name, turma, session ID, or if user typed date directly in the text input
        matchesChild = 
          nomeNorm.includes(normalizedChildQuery) ||
          turmaNorm.includes(normalizedChildQuery) ||
          sessionNorm.includes(normalizedChildQuery) ||
          ptBrDate.includes(normalizedChildQuery);
      }

      // 2. Evaluation Date filter (from date picker or preset)
      let matchesDate = true;
      if (dateSearch) {
        const recDate = getIsoDate(rec.timestamp);
        matchesDate = recDate === dateSearch;
      }

      // 3. Status filter
      const matchesStatus = statusFilter === 'todos' || rec.status === statusFilter;

      // 4. Type filter
      const matchesTipo = tipoFilter === 'todos' || rec.tipoQuestionario === tipoFilter;

      return matchesChild && matchesDate && matchesStatus && matchesTipo;
    });
  }, [records, childSearch, dateSearch, statusFilter, tipoFilter]);

  const pendingCount = records.filter(r => r.status === 'pendente_offline').length;

  const handleSyncSingle = async (rec: EvaluationRecord) => {
    if (!onSyncRecordToGoogle) return;
    setSyncingRecordId(rec.sessionId);
    try {
      await onSyncRecordToGoogle(rec);
    } finally {
      setSyncingRecordId(null);
    }
  };

  const handleSetToday = () => {
    const today = new Date().toISOString().slice(0, 10);
    setDateSearch(today);
  };

  const handleClearFilters = () => {
    setChildSearch('');
    setDateSearch('');
    setStatusFilter('todos');
    setTipoFilter('todos');
  };

  const hasActiveFilters = !!childSearch || !!dateSearch || statusFilter !== 'todos' || tipoFilter !== 'todos';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <span>Histórico de Avaliações BNCC</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                {records.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Filtre avaliações pelo nome da criança, data de aplicação, turma ou sincronização no Google
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-4 border-b border-slate-200 bg-white space-y-3">
          {/* Dual Search Fields: Nome da Criança and Data da Avaliação */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            {/* 1. Nome da Criança Search */}
            <div className="sm:col-span-7 relative">
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Search className="w-3 h-3 text-indigo-600" />
                  Nome da Criança
                </span>
                {childSearch && (
                  <button
                    onClick={() => setChildSearch('')}
                    className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Limpar
                  </button>
                )}
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="search-child-name"
                  type="text"
                  placeholder="Buscar pelo nome da criança ou turma..."
                  value={childSearch}
                  onChange={(e) => setChildSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white transition"
                />
                {childSearch && (
                  <button
                    onClick={() => setChildSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 2. Data da Avaliação Search */}
            <div className="sm:col-span-5 relative">
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-600" />
                  Data da Avaliação
                </span>
                {dateSearch && (
                  <button
                    onClick={() => setDateSearch('')}
                    className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Limpar data
                  </button>
                )}
              </label>
              <div className="flex items-center gap-1">
                <div className="relative flex-1">
                  <input
                    id="search-evaluation-date"
                    type="date"
                    value={dateSearch}
                    onChange={(e) => setDateSearch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white transition cursor-pointer"
                    title="Filtrar por data específica da avaliação"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSetToday}
                  className="px-2.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer shrink-0"
                  title="Filtrar avaliações de hoje"
                >
                  Hoje
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Filters & Google Sync Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <select
                id="filter-tipo-questionario"
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium focus:outline-none"
              >
                <option value="todos">Todos os Questionários</option>
                <option value="bebes">Bebês (Q1 - 75 Itens)</option>
                <option value="bem_pequenas">Crianças Bem Pequenas (Q2 - 75 Itens)</option>
              </select>

              <select
                id="filter-status-sync"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium focus:outline-none"
              >
                <option value="todos">Status: Todos</option>
                <option value="sincronizado">Sincronizados no Google</option>
                <option value="pendente_offline">Fila Offline ({pendingCount})</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer font-medium"
                >
                  <FilterX className="w-3 h-3" />
                  <span>Limpar Filtros</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Google Sync All Button */}
              {isGoogleAuthenticated && onSyncAllToGoogle && (
                <button
                  onClick={onSyncAllToGoogle}
                  disabled={isSyncing}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition disabled:opacity-50 cursor-pointer"
                  title="Sincronizar todas as avaliações com sua Planilha Google e Google Drive"
                >
                  <Cloud className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Salvar Tudo no Google</span>
                </button>
              )}

              <button
                onClick={() => exportEvaluationsToCSV(records, 'bebes')}
                disabled={records.filter(r => r.tipoQuestionario === 'bebes').length === 0}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-40 cursor-pointer"
                title="Exportar CSV dos Bebês"
              >
                <Download className="w-3 h-3 text-emerald-600" />
                <span className="hidden sm:inline">CSV Bebês</span>
              </button>
              <button
                onClick={() => exportEvaluationsToCSV(records, 'bem_pequenas')}
                disabled={records.filter(r => r.tipoQuestionario === 'bem_pequenas').length === 0}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-40 cursor-pointer"
                title="Exportar CSV Crianças Bem Pequenas"
              >
                <Download className="w-3 h-3 text-emerald-600" />
                <span className="hidden sm:inline">CSV Crianças</span>
              </button>
            </div>
          </div>

          {/* Active Filter Summary Bar */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
            <span>
              Mostrando <strong className="text-slate-800">{filtered.length}</strong> de {records.length} avaliações
            </span>
            {(childSearch || dateSearch) && (
              <span className="text-indigo-600 font-medium">
                Filtros ativos: {childSearch ? `"${childSearch}"` : ''} {dateSearch ? `Data: ${new Date(dateSearch + 'T12:00:00').toLocaleDateString('pt-BR')}` : ''}
              </span>
            )}
          </div>
        </div>

        {/* List of Records */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium">Nenhuma avaliação encontrada com estes critérios.</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {hasActiveFilters ? 'Tente ajustar ou limpar os filtros de busca.' : 'Preencha uma avaliação para começar.'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="mt-3 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                >
                  Limpar todos os filtros
                </button>
              )}
            </div>
          ) : (
            filtered.map((rec) => {
              const isSynced = rec.status === 'sincronizado';
              const isBebes = rec.tipoQuestionario === 'bebes';
              const isCurrentlySyncing = syncingRecordId === rec.sessionId;
              const formattedDate = new Date(rec.timestamp).toLocaleDateString('pt-BR');
              const formattedTime = new Date(rec.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={rec.sessionId} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 px-2 rounded-xl transition">
                  <div className="space-y-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">
                        {rec.criancaNome || 'Nome não preenchido'}
                      </h4>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                        isBebes ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {isBebes ? <Baby className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                        {isBebes ? 'Bebês (Q1)' : 'Crianças (Q2)'}
                      </span>
                      {isSynced ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CloudCheck className="w-3 h-3" /> No Google Workspace
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          <HardDrive className="w-3 h-3" /> Fila Offline
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      {rec.turma ? `Turma: ${rec.turma} • ` : ''}
                      <span className="font-medium text-slate-700">Data: {formattedDate} às {formattedTime}</span> • 
                      ID: <span className="font-mono text-[11px] text-indigo-600 font-bold">{rec.sessionId}</span>
                    </p>
                    {/* Google File Links if available */}
                    {(rec.driveFileUrl || rec.spreadsheetUrl) && (
                      <div className="flex items-center gap-2 text-[11px] pt-0.5">
                        {rec.spreadsheetUrl && (
                          <button
                            onClick={() => openGoogleSheets(rec.spreadsheetUrl)}
                            className="text-emerald-700 hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
                          >
                            <FileSpreadsheet className="w-3 h-3" />
                            <span>Planilha Google</span>
                          </button>
                        )}
                        {rec.driveFileUrl && (
                          <a
                            href={rec.driveFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
                          >
                            <FolderOpen className="w-3 h-3 text-amber-500" />
                            <span>Dossiê no Drive</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center flex-wrap gap-2 self-end sm:self-center">
                    {/* If authenticated and not synced to Google Drive/Sheets, offer quick sync */}
                    {isGoogleAuthenticated && onSyncRecordToGoogle && !rec.driveFileUrl && (
                      <button
                        onClick={() => handleSyncSingle(rec)}
                        disabled={isCurrentlySyncing}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                        title="Gravar na planilha e salvar dossiê no Drive da sua conta Google"
                      >
                        {isCurrentlySyncing ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        <span>Salvar no Google</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSelectReport(rec)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-indigo-600 transition cursor-pointer"
                      title="Abrir Dossiê Detalhado com os 75 indicadores"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Dossiê BNCC</span>
                    </button>

                    <button
                      onClick={() => exportEvaluationToPDF(rec)}
                      className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-xs font-semibold text-indigo-700 transition cursor-pointer"
                      title="Baixar Relatório Oficial em PDF direto"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        if (confirm(`Atenção: Tem certeza de que deseja excluir permanentemente o registro de "${rec.criancaNome || rec.sessionId}" do seu dispositivo?`)) {
                          onDeleteRecord(rec.sessionId);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Excluir Registro"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
          <span>{filtered.length} de {records.length} avaliação(ões) exibida(s)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs sm:text-sm font-semibold transition cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
