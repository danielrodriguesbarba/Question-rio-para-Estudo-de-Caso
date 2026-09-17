import { Question } from '../types';

export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 'q1',
    tipo: 'text',
    pergunta: 'Nome completo da criança avaliada:',
    obrigatoria: true,
    bnccCampo: 'Identificação'
  },
  {
    id: 'q2',
    tipo: 'radio',
    pergunta: 'Grupo / Faixa Etária:',
    opcoes: [
      'Bebês (6 meses a 1 ano e 6 meses)',
      'Crianças Bem Pequenas (1 ano e 7 meses a 3 anos e 11 meses)'
    ],
    obrigatoria: true,
    bnccCampo: 'Faixa Etária'
  },
  {
    id: 'q3',
    tipo: 'scale',
    pergunta: 'O Eu, o Outro e o Nós: A criança reage ao ser chamada pelo nome e reconhece pessoas do convívio social?',
    min: 1,
    max: 5,
    labelMin: 'Em desenvolvimento inicial',
    labelMax: 'Totalmente consolidado',
    obrigatoria: true,
    bnccCampo: 'O Eu, o Outro e o Nós'
  },
  {
    id: 'q4',
    tipo: 'scale',
    pergunta: 'Corpo, Gestos e Movimentos: Apresenta segurança postural, equilíbrio e exploração intencional do espaço?',
    min: 1,
    max: 5,
    labelMin: 'Em desenvolvimento inicial',
    labelMax: 'Totalmente consolidado',
    obrigatoria: true,
    bnccCampo: 'Corpo, Gestos e Movimentos'
  },
  {
    id: 'q5',
    tipo: 'checkbox',
    pergunta: 'Traços, Sons, Cores e Formas: Quais manifestações expressivas são observadas com frequência?',
    opcoes: [
      'Interesse por objetos coloridos e contrastes visuais',
      'Exploração ativa de instrumentos sonoros e chocalhos',
      'Interesse e manipulação de livros ou materiais gráficos',
      'Movimentação corporal ao som de ritmos e canções'
    ],
    obrigatoria: false,
    bnccCampo: 'Traços, Sons, Cores e Formas'
  },
  {
    id: 'q6',
    tipo: 'scale',
    pergunta: 'Escuta, Fala, Pensamento e Imaginação: Orienta o olhar, emite vocalizações ou usa gestos para se comunicar?',
    min: 1,
    max: 5,
    labelMin: 'Em desenvolvimento inicial',
    labelMax: 'Totalmente consolidado',
    obrigatoria: true,
    bnccCampo: 'Escuta, Fala, Pensamento e Imaginação'
  },
  {
    id: 'q7',
    tipo: 'scale',
    pergunta: 'Espaços, Tempos, Quantidades e Relações: Demonstra reconhecimento de rotinas, espaços e relações de causa e efeito?',
    min: 1,
    max: 5,
    labelMin: 'Em desenvolvimento inicial',
    labelMax: 'Totalmente consolidado',
    obrigatoria: true,
    bnccCampo: 'Espaços, Tempos, Quantidades e Relações'
  },
  {
    id: 'q8',
    tipo: 'textarea',
    pergunta: 'Parecer Descritivo / Observações Complementares:',
    obrigatoria: false,
    bnccCampo: 'Parecer Descritivo'
  }
];

export const BNCC_SAMPLE_EXTRA_QUESTION: Question = {
  id: 'q9',
  tipo: 'scale',
  pergunta: 'Participa de brincadeiras simples de interação (ex.: "cadê-achou", imitar gestos)?',
  min: 1,
  max: 5,
  labelMin: 'Não observado',
  labelMax: 'Observado com frequência',
  obrigatoria: true,
  bnccCampo: 'O Eu, o Outro e o Nós (Interações)'
};
