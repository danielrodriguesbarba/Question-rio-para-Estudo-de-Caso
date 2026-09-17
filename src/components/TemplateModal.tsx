import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Printer, 
  Check, 
  Cloud, 
  ExternalLink, 
  Loader2, 
  Sparkles, 
  Save, 
  FileCheck2,
  HelpCircle,
  Building,
  User,
  GraduationCap
} from 'lucide-react';
import { AppSettings, TemplateConfig, TipoQuestionario } from '../types';
import { exportBlankTemplateToPDF } from '../utils/pdfExport';
import { generateTemplateDocumentHTML, uploadTemplateToGoogleDrive } from '../utils/templateDocumentGenerator';
import { saveStoredSettings } from '../utils/storage';

interface TemplateModalProps {
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  isGoogleAuthenticated?: boolean;
  driveFolderId?: string;
  getGoogleAccessToken?: () => Promise<string | null>;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  onClose,
  settings,
  onUpdateSettings,
  isGoogleAuthenticated = false,
  driveFolderId,
  getGoogleAccessToken,
}) => {
  const [config, setConfig] = useState<TemplateConfig>({
    instituicao: settings.instituicaoNome || '',
    educador: settings.defaultEducadorNome || '',
    turma: settings.defaultTurma || '',
    anoLetivo: new Date().getFullYear().toString(),
    periodo: '1º Semestre',
    tipo: (settings.defaultTipoQuestionario as TipoQuestionario) || 'bebes',
    incluirRubricas: true,
    incluirObservacoes: true,
    incluirEspacoParecer: true,
    incluirInstrucoes: true,
  });

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [driveResultUrl, setDriveResultUrl] = useState<string | null>(null);
  const [savedDefaultFeedback, setSavedDefaultFeedback] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Baixar Modelo Oficial em PDF usando jsPDF
  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    setFeedbackMsg(null);
    try {
      // Pequeno timeout para permitir renderização de feedback
      setTimeout(() => {
        try {
          exportBlankTemplateToPDF(config);
          setFeedbackMsg('Modelo de respostas em PDF baixado com sucesso!');
        } catch (e: any) {
          console.error(e);
          setFeedbackMsg('Erro ao gerar PDF do modelo: ' + (e?.message || 'Tente novamente'));
        } finally {
          setIsGeneratingPdf(false);
        }
      }, 100);
    } catch (e: any) {
      console.error(e);
      setIsGeneratingPdf(false);
    }
  };

  // Salvar no Google Drive
  const handleSaveToDrive = async () => {
    if (!getGoogleAccessToken) return;
    setIsSavingToDrive(true);
    setFeedbackMsg(null);
    setDriveResultUrl(null);
    try {
      const token = await getGoogleAccessToken();
      if (!token) {
        setFeedbackMsg('Não foi possível obter a autenticação do Google. Faça login novamente.');
        setIsSavingToDrive(false);
        return;
      }

      const res = await uploadTemplateToGoogleDrive(config, token, driveFolderId || settings.driveFolderId);
      setDriveResultUrl(res.webViewLink);
      setFeedbackMsg('Documento modelo salvo com sucesso na sua pasta do Google Drive!');
    } catch (e: any) {
      console.error(e);
      setFeedbackMsg('Erro ao salvar no Google Drive: ' + (e?.message || 'Verifique as permissões'));
    } finally {
      setIsSavingToDrive(false);
    }
  };

  // Baixar como HTML/Word
  const handleDownloadHTML = () => {
    const html = generateTemplateDocumentHTML(config);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Modelo_Respostas_BNCC_${config.tipo}_${(config.turma || 'Turma').replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setFeedbackMsg('Arquivo do modelo baixado com sucesso!');
  };

  // Salvar dados como padrão para o app
  const handleSaveAsDefault = () => {
    const updated: AppSettings = {
      ...settings,
      instituicaoNome: config.instituicao,
      defaultEducadorNome: config.educador,
      defaultTurma: config.turma,
      defaultTipoQuestionario: config.tipo,
    };
    saveStoredSettings(updated);
    onUpdateSettings(updated);
    setSavedDefaultFeedback(true);
    setTimeout(() => setSavedDefaultFeedback(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabeçalho */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                Documento Modelo de Respostas Personalizado
              </h3>
              <p className="text-xs text-slate-500">
                Gere folhas de respostas, instrumentos de observação e modelos para salvar dados
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com Configuração do Modelo */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Informações explicativas */}
          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900">
            <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Para que serve este documento modelo?</p>
              <p className="text-indigo-800 mt-0.5 leading-relaxed">
                Este modelo personalizado inclui o cabeçalho oficial da sua instituição e a grade estruturada dos 75 indicadores BNCC com opções de marcação de 1 a 5, campos para anotações pedagógicas e espaço para parecer descritivo. Perfeito para imprimir, preencher durante a rotina ou salvar como gabarito na nuvem.
              </p>
            </div>
          </div>

          {feedbackMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
              <span>{feedbackMsg}</span>
              {driveResultUrl && (
                <a
                  href={driveResultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-emerald-700 inline-flex items-center gap-1 ml-2"
                >
                  <span>Abrir no Google Drive</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {/* Formulário de Personalização */}
          <div className="space-y-4">
            
            {/* Instituição de Ensino */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-indigo-600" />
                <span>Nome da Instituição / Escola / Creche</span>
              </label>
              <input
                type="text"
                value={config.instituicao}
                onChange={(e) => setConfig({ ...config, instituicao: e.target.value })}
                placeholder="Ex: Centro de Educação Infantil Girassol"
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            {/* Linha dupla: Educador e Turma */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Educador(a) / Avaliador(a)</span>
                </label>
                <input
                  type="text"
                  value={config.educador}
                  onChange={(e) => setConfig({ ...config, educador: e.target.value })}
                  placeholder="Ex: Profa. Mariana Silva"
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Turma / Agrupamento</span>
                </label>
                <input
                  type="text"
                  value={config.turma}
                  onChange={(e) => setConfig({ ...config, turma: e.target.value })}
                  placeholder="Ex: Berçário II - Manhã"
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Linha dupla: Ano Letivo / Período e Tipo de Questionário */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ano Letivo & Período
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={config.anoLetivo}
                    onChange={(e) => setConfig({ ...config, anoLetivo: e.target.value })}
                    placeholder="2026"
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                  <input
                    type="text"
                    value={config.periodo}
                    onChange={(e) => setConfig({ ...config, periodo: e.target.value })}
                    placeholder="1º Semestre"
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Grupo / Matriz BNCC
                </label>
                <select
                  value={config.tipo}
                  onChange={(e) => setConfig({ ...config, tipo: e.target.value as TipoQuestionario })}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer"
                >
                  <option value="bebes">Bebês (Zero a 1 ano e 6 meses)</option>
                  <option value="bem_pequenas">Crianças Bem Pequenas (1a7m a 3a11m)</option>
                </select>
              </div>
            </div>

            {/* Opções adicionais de conteúdo do modelo */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5">
              <span className="block text-xs font-bold text-slate-800 mb-1">
                Elementos Inclusos no Modelo de Documento:
              </span>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.incluirRubricas}
                  onChange={(e) => setConfig({ ...config, incluirRubricas: e.target.checked })}
                  className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Incluir escala oficial de 1 a 5 e rubricas pedagógicas</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.incluirObservacoes}
                  onChange={(e) => setConfig({ ...config, incluirObservacoes: e.target.checked })}
                  className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Incluir pauta para anotações e evidências ao final de cada campo</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.incluirEspacoParecer}
                  onChange={(e) => setConfig({ ...config, incluirEspacoParecer: e.target.checked })}
                  className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Incluir espaço pautado para rascunho do parecer descritivo geral</span>
              </label>
            </div>

          </div>

          {/* Salvar como padrão */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleSaveAsDefault}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar esta instituição e educador como padrão do aplicativo</span>
            </button>
            {savedDefaultFeedback && (
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Salvo como padrão!
              </span>
            )}
          </div>

        </div>

        {/* Rodapé com botões de ação e exportação */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadHTML}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
              title="Baixar arquivo HTML/Word editável"
            >
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              <span>Exportar Word/HTML</span>
            </button>

            {isGoogleAuthenticated && (
              <button
                type="button"
                onClick={handleSaveToDrive}
                disabled={isSavingToDrive}
                className="px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
                title="Salvar modelo diretamente na pasta do Google Drive"
              >
                {isSavingToDrive ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span>Salvar no Google Drive</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-60"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>Baixar Modelo em PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
