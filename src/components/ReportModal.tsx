import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  FolderOpen, 
  Star,
  Sparkles,
  Baby,
  Users,
  CheckCircle2,
  Cloud,
  ExternalLink,
  Loader2,
  FileDown
} from 'lucide-react';
import { EvaluationRecord } from '../types';
import { CAMPOS_BNCC, ESCALA_AVALIACAO } from '../data/questionarios';
import { getQuestoesPorTipo, getNomeQuestionario } from '../utils/evaluationCalculator';
import { openGoogleDrive } from '../utils/googleWorkspace';
import { exportEvaluationToPDF } from '../utils/pdfExport';

interface ReportModalProps {
  evaluation: EvaluationRecord;
  onClose: () => void;
  driveFolderId?: string;
  isGoogleAuthenticated?: boolean;
  onSaveToGoogleDrive?: (record: EvaluationRecord) => Promise<any>;
  institutionName?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  evaluation,
  onClose,
  driveFolderId,
  isGoogleAuthenticated = false,
  onSaveToGoogleDrive,
  institutionName
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const handleDownloadPDF = () => {
    setIsDownloadingPdf(true);
    setTimeout(() => {
      try {
        exportEvaluationToPDF(evaluation, { institutionName });
      } catch (e) {
        console.error('Erro ao gerar PDF:', e);
      } finally {
        setIsDownloadingPdf(false);
      }
    }, 50);
  };

  const handleSaveToDrive = async () => {
    if (!onSaveToGoogleDrive) return;
    setIsSaving(true);
    setSaveSuccessMsg(null);
    try {
      const res = await onSaveToGoogleDrive(evaluation);
      if (res && res.sucesso) {
        setSaveSuccessMsg('Dossiê salvo no seu Google Drive com sucesso!');
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const tipo = evaluation.tipoQuestionario || 'bebes';
  const todasQuestoes = getQuestoesPorTipo(tipo);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    let content = `========================================================================\n`;
    content += `RELATÓRIO DE AVALIAÇÃO DO DESENVOLVIMENTO INFANTIL - BNCC\n`;
    content += `${getNomeQuestionario(tipo).toUpperCase()}\n`;
    content += `========================================================================\n\n`;
    content += `Criança: ${evaluation.criancaNome || 'Não informado'}\n`;
    content += `Turma / Agrupamento: ${evaluation.turma || 'Não informado'}\n`;
    content += `Professor(a) / Avaliador(a): ${evaluation.educadorNome || 'Não informado'}\n`;
    content += `ID da Sessão: ${evaluation.sessionId}\n`;
    content += `Data da Avaliação: ${new Date(evaluation.timestamp).toLocaleString('pt-BR')}\n`;
    content += `Status de Sincronização: ${evaluation.status}\n\n`;

    content += `--- MÉDIAS POR CAMPO DE EXPERIÊNCIAS (ESCALA 1 A 5) ---\n`;
    CAMPOS_BNCC.forEach(c => {
      const media = evaluation.mediasPorCampo?.[c.id] || 0;
      content += `• ${c.nomeCurto}: ${media} / 5.0\n`;
    });
    content += `\n`;

    content += `--- DETALHAMENTO DOS 75 INDICADORES DE OBSERVAÇÃO ---\n\n`;

    CAMPOS_BNCC.forEach(campo => {
      content += `[${campo.nome}]\n`;
      const questoesCampo = todasQuestoes.filter(q => q.campoId === campo.id);
      questoesCampo.forEach(q => {
        const val = evaluation.respostas[q.id];
        const rotulo = ESCALA_AVALIACAO.find(e => e.valor === Number(val))?.rotulo || 'Não avaliado';
        content += `  ${q.numero}. ${q.pergunta}\n`;
        content += `     Nível ${val || '—'} - ${rotulo}\n\n`;
      });
      if (evaluation.observacoesPorCampo?.[campo.id]) {
        content += `  Observações do Campo: ${evaluation.observacoesPorCampo[campo.id]}\n\n`;
      }
    });

    if (evaluation.parecerDescritivo) {
      content += `========================================================================\n`;
      content += `PARECER DESCRITIVO GERAL / SÍNTESE PEDAGÓGICA\n`;
      content += `========================================================================\n`;
      content += `${evaluation.parecerDescritivo}\n\n`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Relatorio_BNCC_${(evaluation.criancaNome || 'Crianca').replace(/\s+/g, '_')}_${evaluation.sessionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                Dossiê Pedagógico Individual - BNCC (75 Questões)
              </h3>
              <p className="text-xs text-slate-500">
                {getNomeQuestionario(tipo)} • {new Date(evaluation.timestamp).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Document Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 print:p-0" id="relatorio-bncc-print">
          
          {/* Metadata Card */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                Aluno(a) Avaliado(a)
              </span>
              <h4 className="text-xl font-bold text-slate-900">
                {evaluation.criancaNome || 'Nome não informado'}
              </h4>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600 mt-1">
                <span><strong>Grupo:</strong> {tipo === 'bebes' ? 'Bebês (6m a 1a6m)' : 'Crianças Bem Pequenas (1a7m a 3a11m)'}</span>
                {evaluation.turma && <span>• <strong>Turma:</strong> {evaluation.turma}</span>}
                {evaluation.educadorNome && <span>• <strong>Educador(a):</strong> {evaluation.educadorNome}</span>}
              </div>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 font-semibold px-2.5 py-1 rounded-full bg-white text-indigo-700 border border-indigo-200 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Matriz BNCC 75 Indicadores
              </span>
              <p className="text-[11px] text-slate-400 mt-1">Sessão: {evaluation.sessionId}</p>
            </div>
          </div>

          {/* Médias nos 5 Campos de Experiências */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
              Síntese do Desenvolvimento nos 5 Campos de Experiências:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {CAMPOS_BNCC.map((c) => {
                const media = evaluation.mediasPorCampo?.[c.id] || 0;
                const percentual = (media / 5) * 100;

                return (
                  <div key={c.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Campo {c.id}</span>
                    <p className="text-xs font-bold text-slate-900 leading-tight mt-0.5 line-clamp-1">
                      {c.nomeCurto}
                    </p>
                    <div className="my-2">
                      <span className="text-lg font-extrabold text-indigo-700">{media}</span>
                      <span className="text-xs text-slate-400"> / 5.0</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${percentual}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Parecer Descritivo */}
          {evaluation.parecerDescritivo && (
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                Parecer Descritivo Geral / Observações Pedagógicas
              </h4>
              <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {evaluation.parecerDescritivo}
              </p>
            </div>
          )}

          {/* Checklist detalhado dos 75 itens por campo */}
          <div className="space-y-6 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-2">
              Detalhamento dos 75 Indicadores por Campo de Experiências:
            </h4>

            {CAMPOS_BNCC.map((campo) => {
              const questoesCampo = todasQuestoes.filter((q) => q.campoId === campo.id);
              const mediaCampo = evaluation.mediasPorCampo?.[campo.id] || 0;

              return (
                <div key={campo.id} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className={`p-3 border-b border-slate-200 flex items-center justify-between gap-2 ${campo.corBg}`}>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 uppercase">
                        {campo.nome}
                      </h5>
                      <p className="text-[11px] text-slate-600">{campo.descricao}</p>
                    </div>
                    <span className="text-xs font-extrabold text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 flex-shrink-0">
                      Média: {mediaCampo} / 5.0
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {questoesCampo.map((q) => {
                      const val = evaluation.respostas[q.id];
                      const esc = ESCALA_AVALIACAO.find((e) => e.valor === Number(val));

                      return (
                        <div key={q.id} className="p-2.5 sm:p-3 flex items-start justify-between gap-3 text-xs">
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-slate-400 w-5 flex-shrink-0">
                              {q.numero}.
                            </span>
                            <span className="text-slate-800">{q.pergunta}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[11px] flex-shrink-0 ${
                              esc?.cor || 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {val ? `Nível ${val} - ${esc?.rotuloCurto}` : 'Não respondido'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {evaluation.observacoesPorCampo?.[campo.id] && (
                    <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-700">
                      <strong>Observações do Campo:</strong> {evaluation.observacoesPorCampo[campo.id]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col gap-2">
          {saveSuccessMsg && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
              <span>{saveSuccessMsg}</span>
              {evaluation.driveFileUrl && (
                <a
                  href={evaluation.driveFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-emerald-700 inline-flex items-center gap-1"
                >
                  <span>Abrir arquivo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              {isGoogleAuthenticated && onSaveToGoogleDrive && (
                <button
                  onClick={handleSaveToDrive}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition disabled:opacity-60 cursor-pointer"
                  title="Fazer upload do arquivo de dossiê diretamente no seu Google Drive"
                >
                  {isSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  <span>{evaluation.driveFileUrl ? 'Atualizar no Meu Drive' : 'Salvar no Meu Google Drive'}</span>
                </button>
              )}

              {evaluation.driveFileUrl && (
                <a
                  href={evaluation.driveFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Ver no Drive</span>
                </a>
              )}

              <button
                onClick={() => openGoogleDrive(driveFolderId)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition"
              >
                <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                <span>Pasta no Drive</span>
              </button>
              
              <button
                onClick={handleDownloadTxt}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Exportar TXT</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer"
                title="Imprimir visualização da página"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Imprimir</span>
              </button>

              <button
                id="btn-download-official-pdf"
                onClick={handleDownloadPDF}
                disabled={isDownloadingPdf}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-60"
                title="Gerar e baixar o Relatório Oficial Consolidado em formato PDF (jsPDF)"
              >
                {isDownloadingPdf ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileDown className="w-4 h-4" />
                )}
                <span>Baixar PDF Oficial</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
