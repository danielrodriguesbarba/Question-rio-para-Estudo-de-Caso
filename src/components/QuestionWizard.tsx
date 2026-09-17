import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  FileText, 
  AlertCircle, 
  Check, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { TipoQuestionario } from '../types';
import { CAMPOS_BNCC, ESCALA_AVALIACAO, BNCCQuestion } from '../data/questionarios';
import { getQuestoesPorTipo, calcularProgressoGeral, getNomeQuestionario } from '../utils/evaluationCalculator';

interface QuestionWizardProps {
  tipo: TipoQuestionario;
  criancaNome: string;
  turma?: string;
  educadorNome?: string;
  respostas: Record<string, number | string>;
  onUpdateResposta: (questionId: string, value: number) => void;
  observacoesPorCampo: Record<number, string>;
  onUpdateObservacaoCampo: (campoId: number, texto: string) => void;
  parecerDescritivo: string;
  onChangeParecerDescritivo: (texto: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const QuestionWizard: React.FC<QuestionWizardProps> = ({
  tipo,
  criancaNome,
  turma,
  educadorNome,
  respostas,
  onUpdateResposta,
  observacoesPorCampo,
  onUpdateObservacaoCampo,
  parecerDescritivo,
  onChangeParecerDescritivo,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  // Current active tab: 1..5 for Campos, 6 for Parecer Descritivo / Finalização
  const [activeTab, setActiveTab] = useState<number>(1);
  const [showHelper, setShowHelper] = useState(false);

  const todasQuestoes = useMemo(() => getQuestoesPorTipo(tipo), [tipo]);

  const progresso = useMemo(() => {
    return calcularProgressoGeral(tipo, respostas);
  }, [tipo, respostas]);

  const questoesDoCampoAtual = useMemo(() => {
    if (activeTab > 5) return [];
    return todasQuestoes.filter((q) => q.campoId === activeTab);
  }, [todasQuestoes, activeTab]);

  const campoAtualInfo = CAMPOS_BNCC.find((c) => c.id === activeTab);

  // Quick bulk fill for this campo if needed by teacher
  const handleBulkFillCampo = (campoId: number, valor: number) => {
    const questoesCampo = todasQuestoes.filter((q) => q.campoId === campoId);
    questoesCampo.forEach((q) => {
      onUpdateResposta(q.id, valor);
    });
  };

  const handleNextTab = () => {
    if (activeTab < 6) {
      setActiveTab((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevTab = () => {
    if (activeTab > 1) {
      setActiveTab((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-in fade-in duration-200">
      {/* Top Header Information */}
      <div className="border-b border-slate-200 pb-4 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
              {getNomeQuestionario(tipo)}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {criancaNome}
            </h2>
            {(turma || educadorNome) && (
              <p className="text-xs text-slate-500">
                {turma ? `Turma: ${turma}` : ''} {turma && educadorNome ? '•' : ''} {educadorNome ? `Prof(a): ${educadorNome}` : ''}
              </p>
            )}
          </div>

          {/* Overall Progress Widget */}
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-600">
              Progresso Geral:{' '}
              <span className="text-indigo-700 font-bold">
                {progresso.respondidas} de {progresso.total}
              </span>
            </div>
            <div className="w-36 h-2 bg-slate-100 rounded-full overflow-hidden mt-1 border border-slate-200">
              <div
                className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${progresso.percentual}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {progresso.percentual}% preenchido
            </span>
          </div>
        </div>

        {/* Campos Tabs Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5 mt-4">
          {CAMPOS_BNCC.map((c) => {
            const campoProg = progresso.porCampo[c.id];
            const isCompleted = campoProg.respondidas === campoProg.total;
            const isActive = activeTab === c.id;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveTab(c.id)}
                className={`px-2 py-2 rounded-xl text-left border transition-all cursor-pointer ${
                  isActive
                    ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 text-indigo-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold">Campo {c.id}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium">
                      {campoProg.respondidas}/{campoProg.total}
                    </span>
                  )}
                </div>
                <p className="text-[10px] leading-tight truncate mt-0.5 text-slate-600">
                  {c.nomeCurto}
                </p>
              </button>
            );
          })}

          {/* Tab 6: Parecer & Finalização */}
          <button
            type="button"
            onClick={() => setActiveTab(6)}
            className={`px-2 py-2 rounded-xl text-left border transition-all cursor-pointer ${
              activeTab === 6
                ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 text-indigo-900 font-bold shadow-xs'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold">Parecer</span>
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <p className="text-[10px] leading-tight truncate mt-0.5 text-slate-600">
              Síntese e Envio
            </p>
          </button>
        </div>
      </div>

      {/* Main Content Area: Questions for Selected Campo (Tabs 1 to 5) */}
      {activeTab <= 5 && campoAtualInfo && (
        <section className="space-y-4">
          {/* Header of the Field */}
          <div className={`p-4 rounded-2xl border ${campoAtualInfo.corBg}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {campoAtualInfo.nome}
              </span>
              <button
                type="button"
                onClick={() => setShowHelper(!showHelper)}
                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Legenda da Escala</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {campoAtualInfo.descricao}
            </p>

            {/* Escala helper modal/drawer */}
            {showHelper && (
              <div className="mt-3 pt-3 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                {ESCALA_AVALIACAO.map((item) => (
                  <div key={item.valor} className="p-2 rounded-lg bg-white border border-slate-200">
                    <span className="font-bold text-slate-900">{item.valor} - {item.rotuloCurto}:</span>
                    <p className="text-[11px] text-slate-500">{item.rotulo}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bulk quick helper bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1 py-1 text-xs text-slate-500">
            <span>Avalie cada um dos 15 indicadores de 1 a 5:</span>
            <div className="flex items-center gap-1">
              <span className="text-[11px]">Marcar todos como:</span>
              {[3, 4, 5].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => handleBulkFillCampo(campoAtualInfo.id, v)}
                  className="px-2 py-0.5 rounded border border-slate-200 text-slate-600 bg-white hover:bg-slate-100 text-[11px]"
                  title={`Preencher todos os 15 com valor ${v}`}
                >
                  Nível {v}
                </button>
              ))}
            </div>
          </div>

          {/* List of 15 Questions */}
          <div className="space-y-3">
            {questoesDoCampoAtual.map((questao) => {
              const valorAtual = respostas[questao.id];

              return (
                <div
                  key={questao.id}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                    valorAtual !== undefined
                      ? 'bg-white border-slate-200 shadow-xs'
                      : 'bg-slate-50/70 border-dashed border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5 mb-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-200">
                      {questao.numero}
                    </span>
                    <p className="text-sm font-medium text-slate-900 leading-snug">
                      {questao.pergunta}
                    </p>
                  </div>

                  {/* Rating Buttons 1 to 5 */}
                  <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                    {ESCALA_AVALIACAO.map((item) => {
                      const isSelected = valorAtual === item.valor;

                      return (
                        <button
                          key={item.valor}
                          type="button"
                          onClick={() => onUpdateResposta(questao.id, item.valor)}
                          className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs ring-2 ring-indigo-500/20'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-sm font-bold">{item.valor}</span>
                          <span className={`text-[10px] leading-tight mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                            {item.rotuloCurto}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Observações específicas deste campo */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Observações Pedagógicas para {campoAtualInfo.nomeCurto} (opcional):
            </label>
            <textarea
              rows={2}
              value={observacoesPorCampo[campoAtualInfo.id] || ''}
              onChange={(e) => onUpdateObservacaoCampo(campoAtualInfo.id, e.target.value)}
              placeholder="Ex.: Demonstra grande facilidade na interação com os colegas; requer apoio nas brincadeiras com regras..."
              className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </section>
      )}

      {/* Tab 6: Parecer Descritivo Geral & Síntese */}
      {activeTab === 6 && (
        <section className="space-y-5 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200">
            <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Parecer Descritivo Geral e Síntese de Aprendizagens
            </h3>
            <p className="text-xs text-indigo-900/80">
              Redija aqui a síntese avaliativa do aluno. Esse texto será incorporado ao relatório individual da BNCC, pronto para impressão e salvamento em PDF no Google Drive.
            </p>
          </div>

          {/* Status dos 5 Campos */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Status do Preenchimento dos 5 Campos:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {CAMPOS_BNCC.map((c) => {
                const info = progresso.porCampo[c.id];
                const concluido = info.respondidas === info.total;

                return (
                  <div
                    key={c.id}
                    className={`p-2.5 rounded-lg border text-center ${
                      concluido ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {concluido ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      <span className="text-[11px] font-bold text-slate-900">Campo {c.id}</span>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      {info.respondidas} de {info.total} itens
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Textarea do Parecer */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Parecer Descritivo do Desenvolvimento da Criança (BNCC):
            </label>
            <textarea
              rows={6}
              value={parecerDescritivo}
              onChange={(e) => onChangeParecerDescritivo(e.target.value)}
              placeholder="Descreva as conquistas, desafios, interesses e avanços observados nas experiências vivenciadas pela criança ao longo do período..."
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder-slate-400"
            />
          </div>

          {progresso.respondidas < progresso.total && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Atenção: restam <strong>{progresso.total - progresso.respondidas} questões</strong> não respondidas. Você pode finalizar agora ou retornar aos campos para completar todos os itens.
              </span>
            </div>
          )}
        </section>
      )}

      {/* Navigation & Action Footer Bar */}
      <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={activeTab === 1 ? onCancel : handlePrevTab}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{activeTab === 1 ? 'Voltar ao Início' : 'Campo Anterior'}</span>
        </button>

        <div className="flex items-center gap-2">
          {activeTab < 6 ? (
            <button
              type="button"
              onClick={handleNextTab}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <span>{activeTab === 5 ? 'Avançar para Parecer' : 'Próximo Campo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btnEnviar"
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Salvando Avaliação...' : 'Finalizar e Salvar Avaliação'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
