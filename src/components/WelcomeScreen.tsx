import React from 'react';
import { 
  ClipboardCheck, 
  ArrowRight, 
  Baby, 
  Users, 
  Sparkles, 
  HardDrive, 
  FileSpreadsheet, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { TipoQuestionario } from '../types';
import { CAMPOS_BNCC } from '../data/questionarios';

interface WelcomeScreenProps {
  tipo: TipoQuestionario;
  onSelectTipo: (tipo: TipoQuestionario) => void;
  criancaNome: string;
  onChangeCriancaNome: (nome: string) => void;
  turma: string;
  onChangeTurma: (turma: string) => void;
  educadorNome: string;
  onChangeEducadorNome: (educador: string) => void;
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  tipo,
  onSelectTipo,
  criancaNome,
  onChangeCriancaNome,
  turma,
  onChangeTurma,
  educadorNome,
  onChangeEducadorNome,
  onStart
}) => {
  const isNomePreenchido = criancaNome.trim().length > 0;

  return (
    <section className="animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
          <ClipboardCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">
          Instrumento de Avaliação e Desenvolvimento Infantil
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
          Base Nacional Comum Curricular (BNCC) • Educação Infantil • 75 indicadores por faixa etária distribuídos nos 5 Campos de Experiências.
        </p>
      </div>

      {/* Seletor de Faixa Etária (Questionário 1 vs Questionário 2) */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Selecione a Faixa Etária / Questionário:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onSelectTipo('bebes')}
            className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
              tipo === 'bebes'
                ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-xs'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              tipo === 'bebes' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <Baby className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-slate-900 text-sm">Questionário 1</h4>
                {tipo === 'bebes' && (
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-indigo-700 mt-0.5">
                Bebês (6m a 1 ano e 6 meses)
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                75 questões completas nos 5 campos da BNCC
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSelectTipo('bem_pequenas')}
            className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
              tipo === 'bem_pequenas'
                ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-xs'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              tipo === 'bem_pequenas' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-slate-900 text-sm">Questionário 2</h4>
                {tipo === 'bem_pequenas' && (
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-indigo-700 mt-0.5">
                Crianças Bem Pequenas (1a7m a 3a11m)
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                75 questões completas nos 5 campos da BNCC
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Dados de Identificação da Criança */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 mb-6 space-y-3.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          Identificação da Avaliação
        </h3>

        <div>
          <label htmlFor="input-crianca-nome" className="block text-xs font-bold text-slate-700 mb-1">
            Nome Completo da Criança <span className="text-rose-600">*</span>
          </label>
          <input
            id="input-crianca-nome"
            type="text"
            required
            placeholder="Ex.: Maria Clara Souza"
            value={criancaNome}
            onChange={(e) => onChangeCriancaNome(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="input-turma" className="block text-xs font-bold text-slate-700 mb-1">
              Turma / Agrupamento (opcional)
            </label>
            <input
              id="input-turma"
              type="text"
              placeholder="Ex.: Berçário II - B"
              value={turma}
              onChange={(e) => onChangeTurma(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 bg-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label htmlFor="input-educador" className="block text-xs font-bold text-slate-700 mb-1">
              Professor(a) / Avaliador(a) (opcional)
            </label>
            <input
              id="input-educador"
              type="text"
              placeholder="Ex.: Prof. Helena Santos"
              value={educadorNome}
              onChange={(e) => onChangeEducadorNome(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 bg-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      </div>

      {/* Os 5 Campos da BNCC Resumo */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Estrutura Avaliativa (15 questões por campo = 75 questões):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {CAMPOS_BNCC.map((c) => (
            <div key={c.id} className="p-2.5 rounded-xl border border-slate-200 bg-white text-center">
              <span className="text-[10px] font-bold text-indigo-700 uppercase block">Campo {c.id}</span>
              <p className="text-xs font-semibold text-slate-800 leading-tight mt-0.5 line-clamp-2">
                {c.nomeCurto}
              </p>
              <span className="text-[10px] text-slate-400 mt-1 block">15 itens</span>
            </div>
          ))}
        </div>
      </div>

      {/* Botão de Ação */}
      <div className="flex flex-col items-center gap-2">
        <button
          id="btnIniciar"
          onClick={onStart}
          disabled={!isNomePreenchido}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Iniciar Avaliação Completa (75 Questões)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        {!isNomePreenchido && (
          <p className="text-xs text-rose-500 font-medium">
            * Digite o nome da criança para iniciar o preenchimento.
          </p>
        )}
      </div>
    </section>
  );
};
