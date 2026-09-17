export type TipoQuestionario = 'bebes' | 'bem_pequenas';

export type AppTheme = 'padrao' | 'alto_contraste';

export type QuestionType = 'text' | 'textarea' | 'radio' | 'checkbox' | 'scale';

export interface Question {
  id: string;
  tipo: QuestionType;
  pergunta: string;
  opcoes?: string[];
  min?: number;
  max?: number;
  labelMin?: string;
  labelMax?: string;
  obrigatoria: boolean;
  bnccCampo?: string;
}

export interface EvaluationRecord {
  sessionId: string;
  timestamp: string; // ISO string
  tipoQuestionario: TipoQuestionario;
  criancaNome: string;
  faixaEtaria: string;
  educadorNome?: string;
  turma?: string;
  dataNascimento?: string;
  respostas: Record<string, number | string>; // rating 1-5 or notes
  observacoesPorCampo?: Record<number, string>;
  mediasPorCampo?: Record<number, number>;
  status: 'sincronizado' | 'pendente_offline' | 'erro';
  syncError?: string;
  parecerDescritivo?: string;
  driveFileId?: string;
  driveFileUrl?: string;
  spreadsheetUrl?: string;
  googleAccountEmail?: string;
}

export interface AppSettings {
  spreadsheetId: string;
  spreadsheetUrl: string;
  driveFolderId: string;
  driveFolderUrl: string;
  webAppUrl: string;
  emailDestinatario: string;
  primaryColor: string;
  autoSyncOnOnline: boolean;
  defaultTipoQuestionario?: TipoQuestionario;
  theme?: AppTheme;
  instituicaoNome?: string;
  defaultEducadorNome?: string;
  defaultTurma?: string;
}

export interface TemplateConfig {
  instituicao: string;
  educador: string;
  turma: string;
  anoLetivo: string;
  periodo: string;
  tipo: TipoQuestionario;
  incluirRubricas: boolean;
  incluirObservacoes: boolean;
  incluirEspacoParecer: boolean;
  incluirInstrucoes: boolean;
}
