export interface BNCCQuestion {
  id: string;
  numero: number;
  campoId: 1 | 2 | 3 | 4 | 5;
  campoNome: string;
  campoNomeCurto: string;
  pergunta: string;
}

export interface CampoInfo {
  id: 1 | 2 | 3 | 4 | 5;
  nome: string;
  nomeCurto: string;
  cor: string;
  corBg: string;
  descricao: string;
}

export const CAMPOS_BNCC: CampoInfo[] = [
  {
    id: 1,
    nome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    nomeCurto: 'O Eu, o Outro e o Nós',
    cor: 'text-rose-700',
    corBg: 'bg-rose-50 border-rose-200',
    descricao: 'Construção da identidade, relações interpessoais, vínculo e respeito às diferenças.'
  },
  {
    id: 2,
    nome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    nomeCurto: 'Corpo, Gestos e Movimentos',
    cor: 'text-amber-700',
    corBg: 'bg-amber-50 border-amber-200',
    descricao: 'Exploração espacial, motricidade fina e ampla, equilíbrio e autonomia corporal.'
  },
  {
    id: 3,
    nome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    nomeCurto: 'Traços, Sons, Cores e Formas',
    cor: 'text-emerald-700',
    corBg: 'bg-emerald-50 border-emerald-200',
    descricao: 'Sensibilidade artística, percepção musical, exploração gráfica, texturas e visualidade.'
  },
  {
    id: 4,
    nome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    nomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    cor: 'text-blue-700',
    corBg: 'bg-blue-50 border-blue-200',
    descricao: 'Comunicação oral e gestual, ampliação vocabular, escuta atenta e imaginação.'
  },
  {
    id: 5,
    nome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    nomeCurto: 'Espaços, Tempos e Relações',
    cor: 'text-purple-700',
    corBg: 'bg-purple-50 border-purple-200',
    descricao: 'Noções espaciais, temporais, causalidade, contagem sensorial e transformações.'
  }
];

// QUESTIONÁRIO UNIFICADO 1: Bebês (6 meses a 1 ano e 6 meses)
export const QUESTOES_BEBES: BNCCQuestion[] = [
  // CAMPO 1: O EU, O OUTRO E O NÓS (15 questões)
  {
    id: 'b1_1',
    numero: 1,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'A criança reage quando é chamada pelo nome (olha, sorri, vocaliza, procura com o olhar)?'
  },
  {
    id: 'b1_2',
    numero: 2,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Demonstra reconhecer adultos de referência (professores, funcionários) e pessoas do convívio social (familiares, colegas)?'
  },
  {
    id: 'b1_3',
    numero: 3,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Percebe que suas ações afetam os outros (ex.: joga um objeto esperando que o adulto devolva, provoca para chamar atenção)?'
  },
  {
    id: 'b1_4',
    numero: 4,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Expressa emoções, necessidades e desejos por meio de choro, sorriso, movimentos corporais, vocalizações ou gestos?'
  },
  {
    id: 'b1_5',
    numero: 5,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Participa de brincadeiras simples de interação (ex.: "cadê-achou", imitar gestos, esconder e aparecer) e busca interagir com outras crianças?'
  },
  {
    id: 'b1_6',
    numero: 6,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Interage com outras crianças (observa, toca, sorri, imita, tenta aproximar-se) durante as brincadeiras?'
  },
  {
    id: 'b1_7',
    numero: 7,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Demonstra preferências por algumas pessoas, brinquedos ou situações (busca determinado adulto, objeto, espaço)?'
  },
  {
    id: 'b1_8',
    numero: 8,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Mostra sinais iniciais de cuidado consigo (estende os braços pedindo colo, aponta para algo que deseja, reage a desconfortos)?'
  },
  {
    id: 'b1_9',
    numero: 9,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Explora objetos de nossa cultura (livros, brinquedos, chocalhos, etc.) em situações de interação social?'
  },
  {
    id: 'b1_10',
    numero: 10,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Demonstra reconhecimento do próprio corpo (olha partes do corpo, toca pés e mãos, observa-se no espelho)?'
  },
  {
    id: 'b1_11',
    numero: 11,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Reage positivamente a ambientes afetivos e acolhedores (fica mais tranquilo, explora mais, sorri com maior frequência)?'
  },
  {
    id: 'b1_12',
    numero: 12,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Tolera, com apoio do adulto, frustrações cotidianas (esperar, dividir um brinquedo, interromper uma atividade) sem se desorganizar por muito tempo?'
  },
  {
    id: 'b1_13',
    numero: 13,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Mostra sinais de vínculo com os adultos da unidade (aceita consolo, procura o adulto em situações de medo ou insegurança, busca colo ou contato físico quando necessário)?'
  },
  {
    id: 'b1_14',
    numero: 14,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Participa, de forma inicial, de rodas de conversa ou momentos coletivos (observa, escuta, vocaliza, mantém-se no grupo por algum tempo)?'
  },
  {
    id: 'b1_15',
    numero: 15,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Demonstra curiosidade por imagens, bonecos e brinquedos que representam diferentes identidades, etnias e culturas?'
  },

  // CAMPO 2: CORPO, GESTOS E MOVIMENTOS (15 questões)
  {
    id: 'b2_1',
    numero: 16,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'A criança movimenta mãos e pés com intenção exploratória (olha para as mãos, tenta pegar os próprios pés, toca o rosto)?'
  },
  {
    id: 'b2_2',
    numero: 17,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Demonstra avanços na postura (rolar, sentar com ou sem apoio, engatinhar, ficar em pé com apoio, dar passos)?'
  },
  {
    id: 'b2_3',
    numero: 18,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Usa movimentos corporais para expressar desejos, emoções e necessidades (estende os braços, empurra, puxa, se estica para alcançar)?'
  },
  {
    id: 'b2_4',
    numero: 19,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Explora o espaço disponível (engatinha, rola, arrasta-se, tenta subir pequenos obstáculos, desloca-se em diferentes direções)?'
  },
  {
    id: 'b2_5',
    numero: 20,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Participa de brincadeiras motoras com obstáculos (passar por baixo, por dentro, subir, descer, rolar, escorregar, balançar), de acordo com sua etapa de desenvolvimento?'
  },
  {
    id: 'b2_6',
    numero: 21,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Utiliza movimentos de preensão (pegar objetos com toda a mão, depois com pinça), encaixe e lançamento, ampliando a coordenação motora fina?'
  },
  {
    id: 'b2_7',
    numero: 22,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Explora diferentes objetos e materiais (borracha, madeira, metal, papel, plástico) apertando, mordendo, tocando, balançando, chutando, puxando, rolando, explorando texturas?'
  },
  {
    id: 'b2_8',
    numero: 23,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Demonstra progressos no equilíbrio (mantém-se sentado, apoia-se para ficar em pé, tenta andar com apoio, amplia segurança ao se movimentar)?'
  },
  {
    id: 'b2_9',
    numero: 24,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Imita gestos e movimentos de outras crianças, adultos ou animais (bater palmas, dar tchau, mandar beijo, imitar um animal, dançar)?'
  },
  {
    id: 'b2_10',
    numero: 25,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Reage a diferentes estímulos sensoriais (temperatura, textura, som, cheiro, sabor) demonstrando curiosidade ou preferência?'
  },
  {
    id: 'b2_11',
    numero: 26,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Mostra prazer em movimentar-se ao som de músicas (balança o corpo, bate palmas, movimenta braços e pernas, vocaliza)?'
  },
  {
    id: 'b2_12',
    numero: 27,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Reconhece e reage à própria imagem no espelho (olha com interesse, sorri, toca o espelho, observa movimentos)?'
  },
  {
    id: 'b2_13',
    numero: 28,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Demonstra alguma independência em situações de cuidado (estende os braços para vestir, tenta tirar meias ou sapatos, leva o copo à boca, participa ativamente dos momentos de cuidado)?'
  },
  {
    id: 'b2_14',
    numero: 29,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Aceita, com apoio, pequenas mudanças de espaço (sair da sala, ir ao pátio, explorar outro ambiente) sem se desorganizar excessivamente?'
  },
  {
    id: 'b2_15',
    numero: 30,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Mantém o interesse em circuitos simples de movimento e brincadeiras que envolvem movimento por algum tempo?'
  },

  // CAMPO 3: TRAÇOS, SONS, CORES E FORMAS (15 questões)
  {
    id: 'b3_1',
    numero: 31,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'A criança demonstra interesse por objetos coloridos (olha com atenção, leva à boca, manipula, segue com o olhar)?'
  },
  {
    id: 'b3_2',
    numero: 32,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Explora materiais de desenho e marcação adequados à idade (lápis grosso, giz de cera, tintas seguras), mesmo que apenas bata, segure ou faça rabiscos desorganizados?'
  },
  {
    id: 'b3_3',
    numero: 33,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Observa e manipula livros, revistas e cartões, explorando imagens, cores e formas (vira páginas, bate, leva à boca)?'
  },
  {
    id: 'b3_4',
    numero: 34,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Reage a diferentes sons (músicas, voz do adulto, chocalhos, instrumentos simples) mudando a expressão, movimentos ou vocalizações?'
  },
  {
    id: 'b3_5',
    numero: 35,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Demonstra preferência por determinadas músicas ou sons (acalma, sorri, balança o corpo quando ouve certas canções)?'
  },
  {
    id: 'b3_6',
    numero: 36,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Participa de brincadeiras musicais simples (bater palmas, balançar chocalho, imitar sons com o corpo)?'
  },
  {
    id: 'b3_7',
    numero: 37,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Explora materiais plásticos e táteis diversos (massinhas seguras, tecidos, esponjas, papéis amassáveis) com curiosidade, explorando texturas?'
  },
  {
    id: 'b3_8',
    numero: 38,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Reage a contrastes visuais (luz/sombra, claro/escuro, imagens em movimento) com foco de atenção?'
  },
  {
    id: 'b3_9',
    numero: 39,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Demonstra curiosidade por objetos com luzes, sons e texturas diferentes (brinquedos de apertar, que brilham ou emitem som)?'
  },
  {
    id: 'b3_10',
    numero: 40,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Observa e acompanha com o olhar objetos em movimento (bolas rolando, móbiles, brinquedos que deslizam)?'
  },
  {
    id: 'b3_11',
    numero: 41,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Participa, à sua maneira, de propostas de pintura, colagem ou carimbo (toca a tinta, espalha, bate a mão no papel)?'
  },
  {
    id: 'b3_12',
    numero: 42,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Reconhece, aos poucos, brinquedos preferidos e os busca visualmente ou se desloca até eles?'
  },
  {
    id: 'b3_13',
    numero: 43,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Reage a mudanças de intensidade sonora (sons mais fortes ou mais suaves) com atenção ou alteração do comportamento?'
  },
  {
    id: 'b3_14',
    numero: 44,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Permanece interessado por algum tempo em observar imagens (cartazes, murais, livros com figuras grandes)?'
  },
  {
    id: 'b3_15',
    numero: 45,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Demonstra sinais de estranhamento ou curiosidade diante de novas cores, materiais e objetos apresentados?'
  },

  // CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO (15 questões)
  {
    id: 'b4_1',
    numero: 46,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'A criança orienta o olhar ou o corpo na direção de sons e vozes conhecidos?'
  },
  {
    id: 'b4_2',
    numero: 47,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Reage à voz do adulto (se acalma, sorri, vocaliza, procura a pessoa com o olhar)?'
  },
  {
    id: 'b4_3',
    numero: 48,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Emite vocalizações variadas (sons guturais, balbucios, sílabas repetidas como "ba-ba", "ma-ma", "da-da")?'
  },
  {
    id: 'b4_4',
    numero: 49,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Responde a pequenos chamados e pedidos simples com gestos ou olhar (ex.: "vem cá", "cadê a bola?", "dá pra mim")?'
  },
  {
    id: 'b4_5',
    numero: 50,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Demonstra antecipação de rotinas (reage quando percebe que vai mamar, trocar fralda, dormir, sair para o pátio)?'
  },
  {
    id: 'b4_6',
    numero: 51,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Observa atentamente a leitura de livros de imagens, histórias narradas ou cantadas pelo adulto?'
  },
  {
    id: 'b4_7',
    numero: 52,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Usa gestos comunicativos (apontar, estender braços, dar, mostrar, afastar algo que não quer) para se comunicar?'
  },
  {
    id: 'b4_8',
    numero: 53,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Parece compreender palavras familiares (nome de pessoas, objetos, alimentos, brinquedos) mesmo que ainda não fale?'
  },
  {
    id: 'b4_9',
    numero: 54,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Participa de brincadeiras de faz de conta muito iniciais (ex.: finge falar ao telefone, leva o copo à boca como se estivesse bebendo)?'
  },
  {
    id: 'b4_10',
    numero: 55,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Imita sons do ambiente ou de animais quando estimulada (a seu modo)?'
  },
  {
    id: 'b4_11',
    numero: 56,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Demonstra curiosidade ao ver o adulto conversando com outras crianças (olha, vocaliza, tenta participar)?'
  },
  {
    id: 'b4_12',
    numero: 57,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Reage a pequenas histórias ou canções com gestos combinados (bater palmas, esconder o rosto, levantar os braços) quando repetidas com frequência?'
  },
  {
    id: 'b4_13',
    numero: 58,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Manifesta incômodo quando não é compreendida (chorando, repetindo gestos, insistindo na comunicação)?'
  },
  {
    id: 'b4_14',
    numero: 59,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Mantém o foco de atenção por alguns instantes quando o adulto fala diretamente com ela em tom afetivo?'
  },
  {
    id: 'b4_15',
    numero: 60,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Apresenta aumento progressivo na variedade e frequência de sons e balbucios ao longo do tempo?'
  },

  // CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES (15 questões)
  {
    id: 'b5_1',
    numero: 61,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'A criança demonstra reconhecer alguns espaços da unidade (sala, pátio, refeitório, banheiro) reagindo de forma diferente em cada um?'
  },
  {
    id: 'b5_2',
    numero: 62,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Mostra familiaridade com rotinas simples (hora de comer, dormir, trocar fraldas, brincar), antecipando-as ou reagindo de forma previsível?'
  },
  {
    id: 'b5_3',
    numero: 63,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Explora o espaço ao seu redor (olha, alcança, arrasta-se, engatinha) em busca de objetos, pessoas ou lugares de interesse?'
  },
  {
    id: 'b5_4',
    numero: 64,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Demonstra preferência por determinados espaços (canto de brinquedos, tapete, área próxima a um adulto específico)?'
  },
  {
    id: 'b5_5',
    numero: 65,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Mostra curiosidade por objetos que se movem em diferentes trajetórias (cair, rolar, balançar, deslizar)?'
  },
  {
    id: 'b5_6',
    numero: 66,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Demonstra noções muito iniciais de permanência do objeto (procura com o olhar um brinquedo que caiu ou foi escondido)?'
  },
  {
    id: 'b5_7',
    numero: 67,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Reage ao tempo de espera (ex.: aguarda, com apoio do adulto, sua vez de receber comida, colo, brinquedo)?'
  },
  {
    id: 'b5_8',
    numero: 68,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Explora quantidades de forma sensorial (segura mais de um objeto, larga um para pegar outro, tenta acumular brinquedos nas mãos)?'
  },
  {
    id: 'b5_9',
    numero: 69,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Observa relações de causa e efeito em situações simples (jogar um objeto e esperar que o adulto devolva, apertar um brinquedo que produz som)?'
  },
  {
    id: 'b5_10',
    numero: 70,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Demonstra curiosidade por mudanças no ambiente (móveis em outro lugar, novos brinquedos, mudanças de decoração)?'
  },
  {
    id: 'b5_11',
    numero: 71,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Reage a variações de tempo (dia/noite, momentos mais calmos ou mais agitados na rotina) com comportamentos diferenciados?'
  },
  {
    id: 'b5_12',
    numero: 72,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Aceita, com apoio, transições entre atividades (da brincadeira para o banho, do colo para o berço, da sala para o pátio)?'
  },
  {
    id: 'b5_13',
    numero: 73,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Observa e acompanha deslocamentos de pessoas e objetos no espaço (segue colegas ou adultos com o olhar, tenta alcançar quem se afasta)?'
  },
  {
    id: 'b5_14',
    numero: 74,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Demonstra maior segurança em espaços já conhecidos, explorando-os com mais autonomia ao longo do tempo?'
  },
  {
    id: 'b5_15',
    numero: 75,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Reage a mudanças climáticas e de ambiente (mais claro/escuro, mais quente/frio, som de chuva) com curiosidade ou atenção?'
  }
];

// QUESTIONÁRIO UNIFICADO 2: Crianças Bem Pequenas (1 ano e 7 meses a 3 anos e 11 meses)
export const QUESTOES_CRIANCAS_BEM_PEQUENAS: BNCCQuestion[] = [
  // CAMPO 1: O EU, O OUTRO E O NÓS (15 questões)
  {
    id: 'cbp1_1',
    numero: 1,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'A criança demonstra atitudes de cuidado consigo (lavar as mãos com ajuda, tentar escovar os dentes, cuidar de seus pertences)?'
  },
  {
    id: 'cbp1_2',
    numero: 2,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Participa de hábitos de higiene e alimentação, imitando ações de adultos e crianças, e verbaliza o que está fazendo (quando já fala)?'
  },
  {
    id: 'cbp1_3',
    numero: 3,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Demonstra atitudes de cuidado com os outros (oferece objetos, ajuda colegas, demonstra preocupação com quem chora)?'
  },
  {
    id: 'cbp1_4',
    numero: 4,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Expressa sentimentos e emoções de forma cada vez mais clara (fala, gestos, expressões faciais) em diferentes situações?'
  },
  {
    id: 'cbp1_5',
    numero: 5,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Demonstra compreensão de regras simples de convivência (esperar a vez, guardar brinquedos, não agredir colegas) com apoio do adulto?'
  },
  {
    id: 'cbp1_6',
    numero: 6,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Interage com outras crianças em brincadeiras compartilhadas (brinca junto, participa de jogos de faz de conta, organiza ações em comum)?'
  },
  {
    id: 'cbp1_7',
    numero: 7,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Demonstra respeito às diferenças entre as pessoas (crianças com características físicas diferentes, hábitos distintos, modos de falar variados)?'
  },
  {
    id: 'cbp1_8',
    numero: 8,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Reage ao diálogo do adulto quando está em conflito, mostrando alguma capacidade de escutar, pensar e tentar se acalmar?'
  },
  {
    id: 'cbp1_9',
    numero: 9,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Manifesta imagem positiva de si (fala bem de si, demonstra orgulho de conquistas, aceita desafios com maior confiança)?'
  },
  {
    id: 'cbp1_10',
    numero: 10,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Aceita, com apoio, frustrações cotidianas (perder um brinquedo, esperar a vez, ouvir um "não") com tempo crescente de autorregulação?'
  },
  {
    id: 'cbp1_11',
    numero: 11,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Nomeia pessoas significativas (família, colegas, professores) e reconhece seu papel na rotina (quem cuida, com quem brinca, quem busca na escola)?'
  },
  {
    id: 'cbp1_12',
    numero: 12,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Demonstra interesse em compartilhar vivências (conta algo que aconteceu em casa, mostra algo que trouxe, fala de passeios)?'
  },
  {
    id: 'cbp1_13',
    numero: 13,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Participa de rodas de conversa, escutando por alguns momentos e esperando sua vez de falar (na medida do possível para a idade)?'
  },
  {
    id: 'cbp1_14',
    numero: 14,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Observa e reage a materiais que representam a diversidade étnico-racial e cultural (livros, bonecos, imagens), fazendo comentários ou perguntas?'
  },
  {
    id: 'cbp1_15',
    numero: 15,
    campoId: 1,
    campoNome: 'CAMPO 1: O EU, O OUTRO E O NÓS',
    campoNomeCurto: 'O Eu, o Outro e o Nós',
    pergunta: 'Demonstra compreensão inicial de atitudes de respeito e solidariedade (consolar um amigo, dividir, chamar um adulto diante de uma injustiça)?'
  },

  // CAMPO 2: CORPO, GESTOS E MOVIMENTOS (15 questões)
  {
    id: 'cbp2_1',
    numero: 16,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'A criança se desloca com segurança no espaço (anda, corre, para, muda de direção) compatível com a faixa etária?'
  },
  {
    id: 'cbp2_2',
    numero: 17,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Participa ativamente de circuitos e brincadeiras com obstáculos (subir, descer, passar por cima e por baixo, pular, equilibrar-se), buscando superar desafios?'
  },
  {
    id: 'cbp2_3',
    numero: 18,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Demonstra coordenação ao subir e descer degraus, com ou sem apoio, de forma cada vez mais segura?'
  },
  {
    id: 'cbp2_4',
    numero: 19,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Coordena movimentos de mãos e olhos ao manipular objetos (encaixar, empilhar, rosquear, abrir/fechar, montar e desmontar)?'
  },
  {
    id: 'cbp2_5',
    numero: 20,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Imita gestos e movimentos de pessoas e animais em brincadeiras, músicas e histórias (pular como sapo, voar como pássaro, rastejar como cobra)?'
  },
  {
    id: 'cbp2_6',
    numero: 21,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Realiza movimentos de maior controle (chutar bola, arremessar, rolar, empurrar, puxar) com intencionalidade?'
  },
  {
    id: 'cbp2_7',
    numero: 22,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Demonstra consciência do próprio corpo (nomeia partes, reconhece tamanho, percebe limites corporais ao passar em espaços estreitos)?'
  },
  {
    id: 'cbp2_8',
    numero: 23,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Mantém o equilíbrio em situações simples (ficar em um pé só por alguns segundos, andar em linha, subir em superfícies baixas)?'
  },
  {
    id: 'cbp2_9',
    numero: 24,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Participa de danças e brincadeiras rítmicas, ajustando seus movimentos ao ritmo da música?'
  },
  {
    id: 'cbp2_10',
    numero: 25,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Utiliza as mãos para atividades mais refinadas (folhear livros, virar páginas, segurar lápis ou giz de forma mais funcional, manusear pequenos objetos)?'
  },
  {
    id: 'cbp2_11',
    numero: 26,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Demonstra progressiva autonomia em ações cotidianas (vestir e tirar partes da roupa, colocar/tirar sapatos, subir na cadeira, sentar-se à mesa)?'
  },
  {
    id: 'cbp2_12',
    numero: 27,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Reage a diferentes estímulos sensoriais (temperaturas, texturas, sons, cheiros, sabores), expressando preferências e verbalizando quando possível?'
  },
  {
    id: 'cbp2_13',
    numero: 28,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Mostra iniciativa para explorar novos espaços e materiais motores (pátio, brinquedos grandes, escorregadores, túneis)?'
  },
  {
    id: 'cbp2_14',
    numero: 29,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Adapta seus movimentos conforme o ambiente (andar mais devagar em áreas molhadas, abaixar para passar embaixo de algo, desviar de obstáculos)?'
  },
  {
    id: 'cbp2_15',
    numero: 30,
    campoId: 2,
    campoNome: 'CAMPO 2: CORPO, GESTOS E MOVIMENTOS',
    campoNomeCurto: 'Corpo, Gestos e Movimentos',
    pergunta: 'Consegue permanecer em atividades que exigem controle motor fino ou grosso por tempo crescente (montar blocos, correr em circuito, jogar bola)?'
  },

  // CAMPO 3: TRAÇOS, SONS, CORES E FORMAS (15 questões)
  {
    id: 'cbp3_1',
    numero: 31,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'A criança demonstra interesse por desenhar, rabiscar, pintar e utilizar diferentes materiais gráficos (lápis, giz, canetinha, tinta)?'
  },
  {
    id: 'cbp3_2',
    numero: 32,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Explora cores, traços e formas, comentando ou escolhendo intencionalmente algumas (ex.: fala "azul", "grande", "bolinha")?'
  },
  {
    id: 'cbp3_3',
    numero: 33,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Participa de atividades de colagem e montagem com diferentes materiais (papel, tecido, sucata), demonstrando curiosidade e envolvimento?'
  },
  {
    id: 'cbp3_4',
    numero: 34,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Observa ilustrações em livros, cartazes e murais, apontando ou nomeando figuras que reconhece?'
  },
  {
    id: 'cbp3_5',
    numero: 35,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Reage às músicas com interesse (ouve, canta trechos, tenta acompanhar o ritmo com o corpo ou instrumentos simples)?'
  },
  {
    id: 'cbp3_6',
    numero: 36,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Experimenta instrumentos musicais simples (chocalhos, tambores, sinos, latas) e explora diferentes sons que produzem?'
  },
  {
    id: 'cbp3_7',
    numero: 37,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Participa de cantigas e brincadeiras musicais, repetindo refrões, gestos e movimentos combinados?'
  },
  {
    id: 'cbp3_8',
    numero: 38,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Mostra preferência por determinadas músicas, histórias ou atividades de artes visuais e sonoras, pedindo que se repitam?'
  },
  {
    id: 'cbp3_9',
    numero: 39,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Demonstra, aos poucos, maior controle no uso de materiais (pincel, esponja, rolinho), utilizando-os na superfície proposta?'
  },
  {
    id: 'cbp3_10',
    numero: 40,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Comenta sobre o que produziu (mesmo que de forma imaginativa), atribuindo significados aos rabiscos e produções ("é um carro", "é mamãe")?'
  },
  {
    id: 'cbp3_11',
    numero: 41,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Participa de propostas de modelagem (massinha, argila e outros materiais seguros), amassando, cortando, enrolando, achatando?'
  },
  {
    id: 'cbp3_12',
    numero: 42,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Observa e reage a mudanças visuais no ambiente (novas exposições de trabalhos, murais, decoração), fazendo comentários ou perguntas?'
  },
  {
    id: 'cbp3_13',
    numero: 43,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Distingue sons do ambiente (voz humana, música, barulho de carro, chuva), demonstrando reconhecimento ou tentando nomeá-los?'
  },
  {
    id: 'cbp3_14',
    numero: 44,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Mantém-se envolvida em atividades artísticas (desenho, pintura, música, modelagem) por tempo crescente, conforme a idade?'
  },
  {
    id: 'cbp3_15',
    numero: 45,
    campoId: 3,
    campoNome: 'CAMPO 3: TRAÇOS, SONS, CORES E FORMAS',
    campoNomeCurto: 'Traços, Sons, Cores e Formas',
    pergunta: 'Demonstra curiosidade ao experimentar novos materiais, técnicas ou suportes (papel grande no chão, pintura com dedos, colagem em caixas)?'
  },

  // CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO (15 questões)
  {
    id: 'cbp4_1',
    numero: 46,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'A criança compreende e segue instruções simples do cotidiano (guardar brinquedos, vir até o adulto, pegar determinado objeto)?'
  },
  {
    id: 'cbp4_2',
    numero: 47,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Amplia progressivamente o vocabulário, nomeando pessoas, objetos, lugares e ações do dia a dia?'
  },
  {
    id: 'cbp4_3',
    numero: 48,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Usa frases simples para se comunicar (ex.: "quero água", "não quero", "brincar com bola")?'
  },
  {
    id: 'cbp4_4',
    numero: 49,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Participa de rodas de conversa, ouvindo por alguns instantes, respondendo a perguntas simples e esperando sua vez, com apoio?'
  },
  {
    id: 'cbp4_5',
    numero: 50,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Demonstra interesse por histórias, fábulas e contos, prestando atenção à leitura e comentando partes que chamam sua atenção?'
  },
  {
    id: 'cbp4_6',
    numero: 51,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Faz perguntas sobre o que vê e vive ("o que é?", "por quê?", "onde?"), revelando curiosidade?'
  },
  {
    id: 'cbp4_7',
    numero: 52,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Participa de brincadeiras de faz de conta (fingir ser alguém, cozinhar, cuidar de bonecos, dirigir carro, realizar cenas do cotidiano)?'
  },
  {
    id: 'cbp4_8',
    numero: 53,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Reconta, à sua maneira, histórias que ouviu ou acontecimentos do dia (na escola ou em casa)?'
  },
  {
    id: 'cbp4_9',
    numero: 54,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Usa a linguagem para negociar em conflitos (dizer o que quer, pedir, reclamar, chamar o adulto) em vez de agir apenas com o corpo?'
  },
  {
    id: 'cbp4_10',
    numero: 55,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Demonstra imaginar situações que não estão presentes no momento (brinca com objetos substituindo outros, inventa personagens, fala de situações imaginárias)?'
  },
  {
    id: 'cbp4_11',
    numero: 56,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Reconhece e nomeia algumas emoções básicas (triste, bravo, feliz, com medo) em si e nos outros, com apoio do adulto?'
  },
  {
    id: 'cbp4_12',
    numero: 57,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Responde quando o adulto nomeia seus sentimentos, mostrando sinais de compreensão e acolhimento?'
  },
  {
    id: 'cbp4_13',
    numero: 58,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Demonstra aumento de atenção em atividades que envolvem escuta (histórias, conversas, músicas), ficando envolvida por tempo maior?'
  },
  {
    id: 'cbp4_14',
    numero: 59,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Usa gestos, expressões faciais e corporais articulados à fala para enriquecer a comunicação?'
  },
  {
    id: 'cbp4_15',
    numero: 60,
    campoId: 4,
    campoNome: 'CAMPO 4: ESCUTA, FALA, PENSAMENTO E IMAGINAÇÃO',
    campoNomeCurto: 'Escuta, Fala, Pensamento e Imaginação',
    pergunta: 'Demonstra capacidade de lembrar de acontecimentos recentes e de retomar assuntos vividos anteriormente (ex.: "ontem fui no parque", "na casa da vovó tem…")?'
  },

  // CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES (15 questões)
  {
    id: 'cbp5_1',
    numero: 61,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'A criança reconhece e nomeia alguns espaços da unidade (sala, parque, refeitório, banheiro, biblioteca) e compreende, aos poucos, seus usos?'
  },
  {
    id: 'cbp5_2',
    numero: 62,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Mostra familiaridade com a rotina diária (hora do lanche, da roda, do sono, do parque), antecipando ou comentando os momentos?'
  },
  {
    id: 'cbp5_3',
    numero: 63,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Desloca-se com autonomia pelos espaços da escola, respeitando limites combinados?'
  },
  {
    id: 'cbp5_4',
    numero: 64,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Demonstra noções iniciais de tempo, usando expressões como "hoje", "ontem", "amanhã", "agora", ainda que de forma não precisa?'
  },
  {
    id: 'cbp5_5',
    numero: 65,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Observa mudanças no ambiente (decoração, disposição de móveis, presença de novos materiais) e comenta sobre elas?'
  },
  {
    id: 'cbp5_6',
    numero: 66,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Demonstra curiosidade por pontos históricos ou turísticos apresentados em imagens, vídeos ou conversas, fazendo comentários ou tentando nomeá-los?'
  },
  {
    id: 'cbp5_7',
    numero: 67,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Relaciona experiências de passeios ou saídas com o que vê na escola (fala de lugares conhecidos, reconhece imagens de sua cidade)?'
  },
  {
    id: 'cbp5_8',
    numero: 68,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Explora quantidades em situações cotidianas (pega mais de um objeto, compara "muito/pouco", tenta contar, aponta quantidades)?'
  },
  {
    id: 'cbp5_9',
    numero: 69,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Participa de brincadeiras que envolvem organização no espaço (fazer fila, correr até um ponto combinado, esconder e procurar objetos)?'
  },
  {
    id: 'cbp5_10',
    numero: 70,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Compreende e aceita, com apoio, as transições entre atividades (terminar de brincar para lanchar, ir ao banheiro antes de dormir, sair do parque para a sala)?'
  },
  {
    id: 'cbp5_11',
    numero: 71,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Demonstra, em seu nível, noções de causa e efeito (se jogar a bola, ela rola; se virar o copo, derrama; se apertar, produz som)?'
  },
  {
    id: 'cbp5_12',
    numero: 72,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Observa e comenta fenômenos naturais e mudanças no ambiente (chuva, sol, frio, calor, vento), relacionando-os às atividades do dia?'
  },
  {
    id: 'cbp5_13',
    numero: 73,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Reconhece alguns objetos do cotidiano da cultura tecnológica (livros, rádio, telefone, calculadora) e comenta sobre seu uso?'
  },
  {
    id: 'cbp5_14',
    numero: 74,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Demonstra noções iniciais de organização e classificação (separa brinquedos por tipo, agrupa objetos iguais, escolhe "maior/menor" em situações simples)?'
  },
  {
    id: 'cbp5_15',
    numero: 75,
    campoId: 5,
    campoNome: 'CAMPO 5: ESPAÇOS, TEMPOS, QUANTIDADES, RELAÇÕES E TRANSFORMAÇÕES',
    campoNomeCurto: 'Espaços, Tempos e Relações',
    pergunta: 'Consegue permanecer em espaços coletivos com maior autonomia e segurança (senta à mesa, participa de rodas, circula pelo pátio), respeitando progressivamente os combinados de convivência?'
  }
];

export const ESCALA_AVALIACAO = [
  { valor: 1, rotulo: 'Não observado', rotuloCurto: 'Não Obs.', cor: 'bg-rose-50 text-rose-700 border-rose-200' },
  { valor: 2, rotulo: 'Em desenvolvimento inicial (Raras vezes)', rotuloCurto: 'Inicial', cor: 'bg-amber-50 text-amber-700 border-amber-200' },
  { valor: 3, rotulo: 'Em processo / Com apoio', rotuloCurto: 'Em Processo', cor: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { valor: 4, rotulo: 'Frequentemente observado', rotuloCurto: 'Frequente', cor: 'bg-blue-50 text-blue-700 border-blue-200' },
  { valor: 5, rotulo: 'Totalmente consolidado / Autônomo', rotuloCurto: 'Consolidado', cor: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
];
