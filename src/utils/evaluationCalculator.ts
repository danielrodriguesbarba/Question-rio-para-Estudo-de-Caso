import { BNCCQuestion, QUESTOES_BEBES, QUESTOES_CRIANCAS_BEM_PEQUENAS, CAMPOS_BNCC } from '../data/questionarios';
import { TipoQuestionario, EvaluationRecord } from '../types';

export function getQuestoesPorTipo(tipo: TipoQuestionario): BNCCQuestion[] {
  return tipo === 'bebes' ? QUESTOES_BEBES : QUESTOES_CRIANCAS_BEM_PEQUENAS;
}

export function getNomeQuestionario(tipo: TipoQuestionario): string {
  return tipo === 'bebes'
    ? 'Questionário 1: Bebês (6 meses a 1 ano e 6 meses)'
    : 'Questionário 2: Crianças Bem Pequenas (1 ano e 7 meses a 3 anos e 11 meses)';
}

export function calcularMediasPorCampo(
  tipo: TipoQuestionario,
  respostas: Record<string, number | string>
): Record<number, number> {
  const questoes = getQuestoesPorTipo(tipo);
  const medias: Record<number, number> = {};

  CAMPOS_BNCC.forEach((campo) => {
    const questoesDoCampo = questoes.filter((q) => q.campoId === campo.id);
    let soma = 0;
    let totalComValor = 0;

    questoesDoCampo.forEach((q) => {
      const valor = Number(respostas[q.id]);
      if (!isNaN(valor) && valor >= 1 && valor <= 5) {
        soma += valor;
        totalComValor++;
      }
    });

    medias[campo.id] = totalComValor > 0 ? Number((soma / totalComValor).toFixed(1)) : 0;
  });

  return medias;
}

export function calcularProgressoGeral(
  tipo: TipoQuestionario,
  respostas: Record<string, number | string>
): { respondidas: number; total: number; percentual: number; porCampo: Record<number, { respondidas: number; total: number }> } {
  const questoes = getQuestoesPorTipo(tipo);
  const total = questoes.length;
  let respondidas = 0;
  const porCampo: Record<number, { respondidas: number; total: number }> = {
    1: { respondidas: 0, total: 15 },
    2: { respondidas: 0, total: 15 },
    3: { respondidas: 0, total: 15 },
    4: { respondidas: 0, total: 15 },
    5: { respondidas: 0, total: 15 },
  };

  questoes.forEach((q) => {
    const val = respostas[q.id];
    if (val !== undefined && val !== null && val !== '') {
      respondidas++;
      if (porCampo[q.campoId]) {
        porCampo[q.campoId].respondidas++;
      }
    }
  });

  const percentual = Math.round((respondidas / total) * 100);
  return { respondidas, total, percentual, porCampo };
}
