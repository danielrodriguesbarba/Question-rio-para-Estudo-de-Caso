import { jsPDF } from 'jspdf';
import { EvaluationRecord, TemplateConfig } from '../types';
import { CAMPOS_BNCC, ESCALA_AVALIACAO } from '../data/questionarios';
import { getQuestoesPorTipo, getNomeQuestionario } from './evaluationCalculator';

/**
 * Paleta de cores institucionais para o relatório PDF
 */
const COLORS = {
  primary: [79, 70, 229] as [number, number, number],      // Indigo 600
  primaryDark: [55, 48, 163] as [number, number, number],  // Indigo 800
  secondary: [15, 23, 42] as [number, number, number],     // Slate 900
  textMuted: [100, 116, 139] as [number, number, number],  // Slate 500
  border: [226, 232, 240] as [number, number, number],     // Slate 200
  bgSubtle: [248, 250, 252] as [number, number, number],   // Slate 50
  accent: [245, 158, 11] as [number, number, number],      // Amber 500
  success: [16, 185, 129] as [number, number, number],    // Emerald 500
  campos: [
    [225, 29, 72] as [number, number, number],   // Rose
    [217, 119, 6] as [number, number, number],   // Amber
    [5, 150, 105] as [number, number, number],   // Emerald
    [37, 99, 235] as [number, number, number],   // Blue
    [147, 51, 234] as [number, number, number],  // Purple
  ]
};

/**
 * Gera e realiza o download do relatório oficial de avaliação em formato PDF
 */
export function exportEvaluationToPDF(
  evaluation: EvaluationRecord,
  options?: { institutionName?: string }
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();   // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;          // 182 mm

  const tipo = evaluation.tipoQuestionario || 'bebes';
  const todasQuestoes = getQuestoesPorTipo(tipo);
  const dataAvaliacao = new Date(evaluation.timestamp).toLocaleDateString('pt-BR');
  const horaAvaliacao = new Date(evaluation.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const nomeQuestionario = getNomeQuestionario(tipo);
  const instituicao = options?.institutionName || 'Educação Infantil • Sistema de Acompanhamento BNCC';

  let currentY = margin;

  // Função auxiliar para verificar necessidade de nova página
  const checkAddPage = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 20) {
      doc.addPage();
      currentY = margin + 8;
      return true;
    }
    return false;
  };

  // --------------------------------------------------------------------------
  // PÁGINA 1: CABEÇALHO OFICIAL & DADOS CADASTRAIS
  // --------------------------------------------------------------------------

  // Barra decorativa superior
  doc.setFillColor(...COLORS.primary);
  doc.rect(margin, currentY, contentWidth, 3, 'F');
  currentY += 7;

  // Cabeçalho Institucional
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.primaryDark);
  doc.text(instituicao.toUpperCase(), margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.textMuted);
  doc.text(`Protocolo: ${evaluation.sessionId}`, pageWidth - margin, currentY, { align: 'right' });
  currentY += 5;

  // Título Principal
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...COLORS.secondary);
  doc.text('Relatório de Avaliação do Desenvolvimento Infantil', margin, currentY);
  currentY += 5.5;

  // Faixa do Questionário / Marco BNCC
  doc.setFillColor(...COLORS.bgSubtle);
  doc.setDrawColor(...COLORS.border);
  doc.roundedRect(margin, currentY, contentWidth, 7, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.primary);
  doc.text(`MATRIZ BNCC • 75 INDICADORES — ${nomeQuestionario.toUpperCase()}`, margin + 3, currentY + 4.8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.textMuted);
  doc.text(`Data: ${dataAvaliacao} às ${horaAvaliacao}`, pageWidth - margin - 3, currentY + 4.8, { align: 'right' });
  currentY += 10;

  // Quadro de Identificação do(a) Aluno(a) e Educador(a)
  doc.setFillColor(...COLORS.bgSubtle);
  doc.setDrawColor(...COLORS.border);
  doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, 'FD');

  // Linha 1 do Quadro: Aluno e Turma
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.textMuted);
  doc.text('ALUNO(A) AVALIADO(A):', margin + 4, currentY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.secondary);
  doc.text(evaluation.criancaNome || 'Nome não informado', margin + 4, currentY + 10.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.textMuted);
  doc.text('TURMA / AGRUPAMENTO:', margin + 115, currentY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...COLORS.secondary);
  doc.text(evaluation.turma || 'Não informada', margin + 115, currentY + 10.5);

  // Linha 2 do Quadro: Educador e Faixa Etária
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.textMuted);
  doc.text(`Educador(a): ${evaluation.educadorNome || 'Não informado'}`, margin + 4, currentY + 16.5);
  doc.text(`Faixa Etária: ${evaluation.faixaEtaria || nomeQuestionario}`, margin + 115, currentY + 16.5);

  currentY += 26;

  // --------------------------------------------------------------------------
  // SÍNTESE CONSOLIDADA NOS 5 CAMPOS DE EXPERIÊNCIAS (TABELA + BARRAS)
  // --------------------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...COLORS.secondary);
  doc.text('1. Síntese Consolidada nos 5 Campos de Experiências (Escala 1 a 5)', margin, currentY);
  currentY += 4.5;

  // Cabeçalho da tabela de campos
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, contentWidth, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('CAMPO DE EXPERIÊNCIAS BNCC', margin + 3, currentY + 4.2);
  doc.text('MÉDIA', margin + 105, currentY + 4.2);
  doc.text('DESEMPENHO GRÁFICO', margin + 125, currentY + 4.2);
  doc.text('CLASSIFICAÇÃO', pageWidth - margin - 3, currentY + 4.2, { align: 'right' });
  currentY += 6;

  // Linhas dos 5 Campos
  let somaMedias = 0;
  let countMedias = 0;

  CAMPOS_BNCC.forEach((campo, index) => {
    const media = evaluation.mediasPorCampo?.[campo.id] || 0;
    if (media > 0) {
      somaMedias += media;
      countMedias++;
    }

    const rowBg = index % 2 === 0 ? [255, 255, 255] as [number, number, number] : [248, 250, 252] as [number, number, number];
    doc.setFillColor(...rowBg);
    doc.rect(margin, currentY, contentWidth, 7, 'F');

    // Bullet colorido do campo
    const corCampo = COLORS.campos[index] || COLORS.primary;
    doc.setFillColor(...corCampo);
    doc.circle(margin + 4, currentY + 3.5, 1.3, 'F');

    // Nome curto do campo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.secondary);
    doc.text(`Campo ${campo.id}: ${campo.nomeCurto}`, margin + 7.5, currentY + 4.5);

    // Média numérica
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLORS.primaryDark);
    doc.text(`${media.toFixed(1)} / 5.0`, margin + 105, currentY + 4.5);

    // Barra de progresso visual
    const barWidth = 36;
    const progressWidth = Math.max(1, (media / 5) * barWidth);
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(margin + 125, currentY + 2.2, barWidth, 2.8, 1, 1, 'F');
    doc.setFillColor(...corCampo);
    doc.roundedRect(margin + 125, currentY + 2.2, progressWidth, 2.8, 1, 1, 'F');

    // Rótulo qualitativo
    const esc = ESCALA_AVALIACAO.find((e) => e.valor === Math.round(media)) || ESCALA_AVALIACAO[2];
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.textMuted);
    doc.text(esc.rotuloCurto, pageWidth - margin - 3, currentY + 4.5, { align: 'right' });

    currentY += 7;
  });

  // Linha de Média Geral Consolidada
  const mediaGeral = countMedias > 0 ? (somaMedias / countMedias).toFixed(2) : '0.00';
  doc.setFillColor(238, 242, 255);
  doc.setDrawColor(...COLORS.primary);
  doc.rect(margin, currentY, contentWidth, 7, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.primaryDark);
  doc.text('ÍNDICE GLOBAL DE DESENVOLVIMENTO (MÉDIA GERAL BNCC):', margin + 3, currentY + 4.6);
  doc.text(`${mediaGeral} / 5.00`, margin + 105, currentY + 4.6);
  currentY += 11;

  // --------------------------------------------------------------------------
  // PARECER DESCRITIVO GERAL / SÍNTESE PEDAGÓGICA
  // --------------------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...COLORS.secondary);
  doc.text('2. Parecer Descritivo Geral / Síntese Pedagógica do Educador', margin, currentY);
  currentY += 4.5;

  const parecerTexto = evaluation.parecerDescritivo?.trim() || 'Nenhum parecer descritivo foi redigido para esta avaliação.';
  const parecerLinhas = doc.splitTextToSize(parecerTexto, contentWidth - 8);
  const parecerBoxHeight = Math.max(18, parecerLinhas.length * 4.2 + 8);

  checkAddPage(parecerBoxHeight + 10);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...COLORS.border);
  doc.roundedRect(margin, currentY, contentWidth, parecerBoxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text(parecerLinhas, margin + 4, currentY + 6);

  currentY += parecerBoxHeight + 9;

  // --------------------------------------------------------------------------
  // ASSINATURAS DO RELATÓRIO NA PÁGINA 1
  // --------------------------------------------------------------------------
  if (currentY + 28 <= pageHeight - 20) {
    const colWidth = (contentWidth - 10) / 2;
    
    // Assinatura do Educador
    doc.setDrawColor(148, 163, 184);
    doc.line(margin, currentY + 12, margin + colWidth, currentY + 12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.secondary);
    doc.text(evaluation.educadorNome || 'Educador(a) Responsável', margin + colWidth / 2, currentY + 16, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.textMuted);
    doc.text('Docente / Avaliador(a)', margin + colWidth / 2, currentY + 19.5, { align: 'center' });

    // Assinatura da Coordenação
    doc.line(margin + colWidth + 10, currentY + 12, pageWidth - margin, currentY + 12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.secondary);
    doc.text('Coordenação Pedagógica / Direção', margin + colWidth + 10 + colWidth / 2, currentY + 16, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.textMuted);
    doc.text('Instituição de Educação Infantil', margin + colWidth + 10 + colWidth / 2, currentY + 19.5, { align: 'center' });
  }

  // --------------------------------------------------------------------------
  // PÁGINAS SEGUINTES: DETALHAMENTO DOS 75 INDICADORES BNCC
  // --------------------------------------------------------------------------
  doc.addPage();
  currentY = margin;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.secondary);
  doc.text('3. Detalhamento Consolidado dos 75 Indicadores de Observação BNCC', margin, currentY);
  currentY += 4.5;

  CAMPOS_BNCC.forEach((campo, campoIdx) => {
    const questoesCampo = todasQuestoes.filter((q) => q.campoId === campo.id);
    const mediaCampo = evaluation.mediasPorCampo?.[campo.id] || 0;
    const corCampo = COLORS.campos[campoIdx] || COLORS.primary;

    checkAddPage(22);

    // Banner do Campo de Experiência
    doc.setFillColor(...corCampo);
    doc.roundedRect(margin, currentY, contentWidth, 7.5, 1.5, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(campo.nome, margin + 3, currentY + 5.2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`Média: ${mediaCampo.toFixed(1)} / 5.0`, pageWidth - margin - 3, currentY + 5.2, { align: 'right' });
    currentY += 9;

    // Questões do Campo
    questoesCampo.forEach((q, qIdx) => {
      const val = evaluation.respostas[q.id];
      const esc = ESCALA_AVALIACAO.find((e) => e.valor === Number(val));
      const valText = val ? `Nível ${val} - ${esc?.rotuloCurto || ''}` : 'Não avaliado';

      // Quebra do enunciado
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      const textoPergunta = `${q.numero}. ${q.pergunta}`;
      const linhasPergunta = doc.splitTextToSize(textoPergunta, contentWidth - 36);
      const rowHeight = Math.max(5.8, linhasPergunta.length * 3.4 + 2);

      checkAddPage(rowHeight + 2);

      const rowBg = qIdx % 2 === 0 ? [255, 255, 255] as [number, number, number] : [248, 250, 252] as [number, number, number];
      doc.setFillColor(...rowBg);
      doc.rect(margin, currentY, contentWidth, rowHeight, 'F');

      doc.setTextColor(30, 41, 59);
      doc.text(linhasPergunta, margin + 2.5, currentY + 3.4);

      // Caixa de pontuação
      const badgeBg = val ? [238, 242, 255] : [241, 245, 249];
      const badgeBorder = val ? COLORS.primary : [203, 213, 225];
      doc.setFillColor(badgeBg[0], badgeBg[1], badgeBg[2]);
      doc.setDrawColor(badgeBorder[0], badgeBorder[1], badgeBorder[2]);
      doc.roundedRect(pageWidth - margin - 32, currentY + 0.8, 30, 4.2, 0.8, 0.8, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(val ? COLORS.primaryDark[0] : 100, val ? COLORS.primaryDark[1] : 116, val ? COLORS.primaryDark[2] : 139);
      doc.text(valText, pageWidth - margin - 17, currentY + 3.7, { align: 'center' });

      currentY += rowHeight;
    });

    // Observações específicas do campo
    const obsCampo = evaluation.observacoesPorCampo?.[campo.id]?.trim();
    if (obsCampo) {
      checkAddPage(14);
      doc.setFillColor(254, 252, 232); // Amarelo suave
      doc.setDrawColor(254, 240, 138);
      const linhasObs = doc.splitTextToSize(`Observações do Campo ${campo.id}: ${obsCampo}`, contentWidth - 6);
      const obsHeight = Math.max(7, linhasObs.length * 3.2 + 3);

      doc.roundedRect(margin, currentY + 1, contentWidth, obsHeight, 1, 1, 'FD');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(113, 63, 18);
      doc.text(linhasObs, margin + 3, currentY + 4.2);
      currentY += obsHeight + 2;
    }

    currentY += 3;
  });

  // --------------------------------------------------------------------------
  // NUMERAÇÃO DE PÁGINAS E RODAPÉ PADRÃO EM TODAS AS PÁGINAS
  // --------------------------------------------------------------------------
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(...COLORS.border);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.textMuted);
    doc.text(
      `Dossiê Individual BNCC • Aluno: ${evaluation.criancaNome || 'Não informado'} • ID: ${evaluation.sessionId}`,
      margin,
      pageHeight - 7
    );
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth - margin,
      pageHeight - 7,
      { align: 'right' }
    );
  }

  // Nome do arquivo gerado
  const sanitizedNome = (evaluation.criancaNome || 'Aluno')
    .replace(/[^\w\s-]/gi, '')
    .trim()
    .replace(/\s+/g, '_');
  const fileName = `Relatorio_Avaliacao_BNCC_${sanitizedNome}_${evaluation.sessionId}.pdf`;

  doc.save(fileName);
}

/**
 * Gera e realiza o download do Documento Modelo Personalizado de Respostas em PDF
 * para o educador levar para a sala de aula, preencher manualmente ou usar como modelo.
 */
export function exportBlankTemplateToPDF(config: TemplateConfig): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  const tipo = config.tipo || 'bebes';
  const questoes = getQuestoesPorTipo(tipo);
  const nomeQuestionario = getNomeQuestionario(tipo);

  let currentY = margin;

  const checkAddPage = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 20) {
      doc.addPage();
      currentY = margin + 8;
      return true;
    }
    return false;
  };

  // --------------------------------------------------------------------------
  // CABEÇALHO DO DOCUMENTO MODELO
  // --------------------------------------------------------------------------
  doc.setFillColor(...COLORS.primary);
  doc.rect(margin, currentY, contentWidth, 3, 'F');
  currentY += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.primaryDark);
  doc.text((config.instituicao || 'INSTITUIÇÃO DE EDUCAÇÃO INFANTIL').toUpperCase(), margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.textMuted);
  doc.text(`Ano Letivo: ${config.anoLetivo || '2026'} • Período: ${config.periodo || 'Geral'}`, pageWidth - margin, currentY, { align: 'right' });
  currentY += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.secondary);
  doc.text('Instrumento Pedagógico de Registro e Observação - BNCC', margin, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.primary);
  doc.text(`DOCUMENTO MODELO DE RESPOSTAS (75 INDICADORES) — ${nomeQuestionario.toUpperCase()}`, margin, currentY);
  currentY += 7;

  // --------------------------------------------------------------------------
  // CAMPOS PERSONALIZADOS DE IDENTIFICAÇÃO PARA PREENCHIMENTO
  // --------------------------------------------------------------------------
  doc.setFillColor(...COLORS.bgSubtle);
  doc.setDrawColor(...COLORS.border);
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.textMuted);
  doc.text('NOME DA CRIANÇA:', margin + 4, currentY + 5.5);
  doc.line(margin + 34, currentY + 5.5, margin + 115, currentY + 5.5);

  doc.text('DATA NASC.:', margin + 120, currentY + 5.5);
  doc.line(margin + 138, currentY + 5.5, pageWidth - margin - 4, currentY + 5.5);

  doc.text('TURMA / AGRUPAMENTO:', margin + 4, currentY + 13);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.secondary);
  doc.text(config.turma || '_________________________', margin + 40, currentY + 13);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.textMuted);
  doc.text('DATA DA AVALIAÇÃO:', margin + 120, currentY + 13);
  doc.line(margin + 152, currentY + 13, pageWidth - margin - 4, currentY + 13);

  doc.text('EDUCADOR(A) AVALIADOR(A):', margin + 4, currentY + 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.secondary);
  doc.text(config.educador || '_____________________________________', margin + 46, currentY + 20);

  currentY += 28;

  // --------------------------------------------------------------------------
  // ESCALA E INSTRUÇÕES DE PREENCHIMENTO
  // --------------------------------------------------------------------------
  if (config.incluirRubricas) {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(...COLORS.border);
    doc.roundedRect(margin, currentY, contentWidth, 13, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.primaryDark);
    doc.text('ESCALA DE AVALIAÇÃO BNCC (ASSINALE UMA OPÇÃO DE 1 A 5 PARA CADA INDICADOR):', margin + 3, currentY + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    const escalaTexto = '[1] Não observado    |    [2] Desenvolvimento inicial    |    [3] Em processo com apoio    |    [4] Frequentemente observado    |    [5] Totalmente consolidado';
    doc.text(escalaTexto, margin + 3, currentY + 9);

    currentY += 16;
  }

  // --------------------------------------------------------------------------
  // LISTAGEM DOS 75 INDICADORES COM CAIXAS DE SELEÇÃO [1] [2] [3] [4] [5]
  // --------------------------------------------------------------------------
  CAMPOS_BNCC.forEach((campo, campoIdx) => {
    const questoesCampo = questoes.filter((q) => q.campoId === campo.id);
    const corCampo = COLORS.campos[campoIdx] || COLORS.primary;

    checkAddPage(18);

    // Banner do Campo
    doc.setFillColor(...corCampo);
    doc.roundedRect(margin, currentY, contentWidth, 6.5, 1, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(campo.nome, margin + 3, currentY + 4.5);
    currentY += 8;

    questoesCampo.forEach((q, qIdx) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);

      const texto = `${q.numero}. ${q.pergunta}`;
      // Largura da pergunta considerando o espaço das opções 1 a 5 à direita
      const linhas = doc.splitTextToSize(texto, contentWidth - 45);
      const rowHeight = Math.max(5.5, linhas.length * 3.4 + 1.5);

      checkAddPage(rowHeight + 2);

      const rowBg = qIdx % 2 === 0 ? [255, 255, 255] as [number, number, number] : [248, 250, 252] as [number, number, number];
      doc.setFillColor(...rowBg);
      doc.rect(margin, currentY, contentWidth, rowHeight, 'F');

      doc.setTextColor(30, 41, 59);
      doc.text(linhas, margin + 2, currentY + 3.4);

      // Botões/Círculos de marcação 1, 2, 3, 4, 5
      const baseX = pageWidth - margin - 42;
      for (let n = 1; n <= 5; n++) {
        const circleX = baseX + (n - 1) * 8.2;
        doc.setDrawColor(148, 163, 184);
        doc.circle(circleX, currentY + 2.8, 2.2, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
        doc.setTextColor(71, 85, 105);
        doc.text(String(n), circleX, currentY + 3.6, { align: 'center' });
      }

      currentY += rowHeight;
    });

    // Espaço para anotações do campo se ativado
    if (config.incluirObservacoes) {
      checkAddPage(16);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(...COLORS.border);
      doc.roundedRect(margin, currentY + 1, contentWidth, 12, 1, 1, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(...COLORS.textMuted);
      doc.text(`Anotações / Evidências Pedagógicas do Campo ${campo.id}:`, margin + 3, currentY + 4.5);

      // Linhas pautadas para anotação
      doc.setDrawColor(241, 245, 249);
      doc.line(margin + 3, currentY + 7.5, pageWidth - margin - 3, currentY + 7.5);
      doc.line(margin + 3, currentY + 10.5, pageWidth - margin - 3, currentY + 10.5);

      currentY += 15;
    }

    currentY += 2;
  });

  // --------------------------------------------------------------------------
  // ESPAÇO PARA PARECER DESCRITIVO RASCUNHADO
  // --------------------------------------------------------------------------
  if (config.incluirEspacoParecer) {
    checkAddPage(36);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...COLORS.border);
    doc.roundedRect(margin, currentY, contentWidth, 32, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.primaryDark);
    doc.text('Rascunho de Parecer Descritivo Geral / Síntese dos Aprendizados:', margin + 3, currentY + 5);

    doc.setDrawColor(226, 232, 240);
    for (let l = 1; l <= 6; l++) {
      doc.line(margin + 3, currentY + 6 + l * 4, pageWidth - margin - 3, currentY + 6 + l * 4);
    }

    currentY += 35;
  }

  // --------------------------------------------------------------------------
  // RODAPÉ COM NUMERAÇÃO DE PÁGINAS
  // --------------------------------------------------------------------------
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(...COLORS.border);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.textMuted);
    doc.text(
      `Modelo de Instrumento de Avaliação BNCC • ${config.instituicao || 'Educação Infantil'} • ${config.turma || 'Turma'}`,
      margin,
      pageHeight - 7
    );
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth - margin,
      pageHeight - 7,
      { align: 'right' }
    );
  }

  const fileName = `Modelo_Respostas_BNCC_${tipo}_${(config.turma || 'Turma').replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
}
