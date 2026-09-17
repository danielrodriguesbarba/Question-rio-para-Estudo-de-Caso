import { TemplateConfig } from '../types';
import { CAMPOS_BNCC, ESCALA_AVALIACAO } from '../data/questionarios';
import { getQuestoesPorTipo, getNomeQuestionario } from './evaluationCalculator';

/**
 * Gera documento HTML estilizado e formatado para servir de modelo de respostas,
 * compatível com abertura direta no Google Docs, Word ou impressão.
 */
export function generateTemplateDocumentHTML(config: TemplateConfig): string {
  const tipo = config.tipo || 'bebes';
  const questoes = getQuestoesPorTipo(tipo);
  const nomeQuestionario = getNomeQuestionario(tipo);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Modelo de Registro e Respostas - BNCC (${nomeQuestionario})</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #1e293b;
      margin: 30px;
      line-height: 1.4;
      font-size: 13px;
    }
    .header {
      border-bottom: 3px solid #4f46e5;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .inst-title {
      font-size: 14px;
      font-weight: bold;
      color: #3730a3;
      text-transform: uppercase;
      margin: 0;
    }
    .doc-title {
      font-size: 20px;
      font-weight: bold;
      color: #0f172a;
      margin: 6px 0 2px 0;
    }
    .doc-subtitle {
      font-size: 13px;
      color: #4f46e5;
      font-weight: bold;
      margin: 0;
    }
    .meta-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 20px;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .meta-row:last-child {
      margin-bottom: 0;
    }
    .meta-field {
      flex: 1;
    }
    .meta-label {
      font-size: 11px;
      font-weight: bold;
      color: #64748b;
      text-transform: uppercase;
    }
    .meta-line {
      border-bottom: 1px solid #94a3b8;
      display: inline-block;
      width: 80%;
      height: 16px;
    }
    .rubrica-box {
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      border-radius: 6px;
      padding: 10px;
      margin-bottom: 20px;
      font-size: 12px;
    }
    .campo-section {
      margin-bottom: 24px;
      page-break-inside: avoid;
    }
    .campo-header {
      background: #4f46e5;
      color: #ffffff;
      padding: 8px 12px;
      font-weight: bold;
      font-size: 13px;
      border-radius: 6px 6px 0 0;
      display: flex;
      justify-content: space-between;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #e2e8f0;
    }
    th {
      background: #f1f5f9;
      padding: 6px 10px;
      font-size: 11px;
      text-align: left;
      border: 1px solid #cbd5e1;
    }
    td {
      padding: 7px 10px;
      border: 1px solid #e2e8f0;
      font-size: 12px;
    }
    tr:nth-child(even) {
      background: #f8fafc;
    }
    .rating-col {
      width: 140px;
      text-align: center;
      white-space: nowrap;
    }
    .rating-pill {
      display: inline-block;
      width: 18px;
      height: 18px;
      line-height: 18px;
      border: 1px solid #94a3b8;
      border-radius: 50%;
      margin: 0 2px;
      font-size: 10px;
      font-weight: bold;
      color: #475569;
    }
    .notes-box {
      border: 1px dashed #cbd5e1;
      padding: 10px;
      background: #ffffff;
      margin-top: 8px;
      border-radius: 4px;
    }
    .parecer-box {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 14px;
      margin-top: 25px;
      min-height: 160px;
    }
    @media print {
      body { margin: 15mm; font-size: 11px; }
      .campo-section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <p class="inst-title">${(config.instituicao || 'Instituição de Educação Infantil').toUpperCase()}</p>
    <h1 class="doc-title">Instrumento Pedagógico de Registro e Observação - BNCC</h1>
    <p class="doc-subtitle">MODELO DE RESPOSTAS E AVALIAÇÃO • ${nomeQuestionario.toUpperCase()}</p>
  </div>

  <div class="meta-box">
    <div class="meta-row">
      <div class="meta-field" style="flex: 2;">
        <span class="meta-label">Nome da Criança:</span>
        <span class="meta-line"></span>
      </div>
      <div class="meta-field">
        <span class="meta-label">Data Nasc.:</span>
        <span class="meta-line" style="width: 120px;"></span>
      </div>
    </div>
    <div class="meta-row" style="margin-top: 10px;">
      <div class="meta-field">
        <span class="meta-label">Turma:</span> <strong>${config.turma || '_____________________'}</strong>
      </div>
      <div class="meta-field">
        <span class="meta-label">Ano Letivo / Período:</span> <strong>${config.anoLetivo || '2026'} • ${config.periodo || '1º Semestre'}</strong>
      </div>
      <div class="meta-field">
        <span class="meta-label">Data da Avaliação:</span>
        <span class="meta-line" style="width: 100px;"></span>
      </div>
    </div>
    <div class="meta-row" style="margin-top: 10px;">
      <div class="meta-field">
        <span class="meta-label">Educador(a) Avaliador(a):</span> <strong>${config.educador || '_____________________________________'}</strong>
      </div>
    </div>
  </div>

  ${config.incluirRubricas ? `
  <div class="rubrica-box">
    <strong>Escala de Avaliação BNCC:</strong>
    ${ESCALA_AVALIACAO.map(e => `[${e.valor}] ${e.rotulo}`).join(' &bull; ')}
  </div>
  ` : ''}

  ${CAMPOS_BNCC.map(campo => {
    const questoesCampo = questoes.filter(q => q.campoId === campo.id);
    return `
    <div class="campo-section">
      <div class="campo-header">
        <span>${campo.nome}</span>
        <span>15 Indicadores</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 35px; text-align: center;">Nº</th>
            <th>Indicador de Observação do Desenvolvimento</th>
            <th class="rating-col">Nível de Domínio (1 a 5)</th>
          </tr>
        </thead>
        <tbody>
          ${questoesCampo.map(q => `
            <tr>
              <td style="text-align: center; font-weight: bold; color: #64748b;">${q.numero}</td>
              <td>${q.pergunta}</td>
              <td class="rating-col">
                <span class="rating-pill">1</span>
                <span class="rating-pill">2</span>
                <span class="rating-pill">3</span>
                <span class="rating-pill">4</span>
                <span class="rating-pill">5</span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      ${config.incluirObservacoes ? `
      <div class="notes-box">
        <strong style="color: #475569; font-size: 11px;">Anotações / Evidências Pedagógicas do Campo ${campo.id}:</strong>
        <div style="border-bottom: 1px dotted #cbd5e1; height: 24px; margin-top: 4px;"></div>
        <div style="border-bottom: 1px dotted #cbd5e1; height: 24px; margin-top: 4px;"></div>
      </div>
      ` : ''}
    </div>
    `;
  }).join('')}

  ${config.incluirEspacoParecer ? `
  <div class="parecer-box">
    <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 14px;">Rascunho do Parecer Descritivo Geral / Síntese dos Aprendizados</h3>
    <div style="border-bottom: 1px dotted #cbd5e1; height: 28px;"></div>
    <div style="border-bottom: 1px dotted #cbd5e1; height: 28px;"></div>
    <div style="border-bottom: 1px dotted #cbd5e1; height: 28px;"></div>
    <div style="border-bottom: 1px dotted #cbd5e1; height: 28px;"></div>
    <div style="border-bottom: 1px dotted #cbd5e1; height: 28px;"></div>
  </div>
  ` : ''}

  <div style="margin-top: 40px; display: flex; justify-content: space-around; text-align: center;">
    <div style="width: 40%; border-top: 1px solid #94a3b8; padding-top: 6px;">
      <strong>${config.educador || 'Educador(a) Avaliador(a)'}</strong><br>
      <span style="font-size: 11px; color: #64748b;">Docente Responsável</span>
    </div>
    <div style="width: 40%; border-top: 1px solid #94a3b8; padding-top: 6px;">
      <strong>Coordenação Pedagógica</strong><br>
      <span style="font-size: 11px; color: #64748b;">Instituição de Educação Infantil</span>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Salva o modelo personalizado no Google Drive do usuário como arquivo HTML/Google Docs
 */
export async function uploadTemplateToGoogleDrive(
  config: TemplateConfig,
  token: string,
  folderId?: string
): Promise<{ fileId: string; webViewLink: string }> {
  const fileName = `Modelo_Respostas_BNCC_${config.tipo}_${(config.turma || 'Turma').replace(/\s+/g, '_')}.html`;
  const fileContent = generateTemplateDocumentHTML(config);

  const metadata: any = {
    name: fileName,
    mimeType: 'text/html'
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/html; charset=UTF-8\r\n\r\n' +
    fileContent +
    closeDelimiter;

  const uploadRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: multipartRequestBody
  });

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    throw new Error(`Erro ao enviar modelo para o Google Drive: ${errText}`);
  }

  const uploadedFile = await uploadRes.json();
  return {
    fileId: uploadedFile.id,
    webViewLink: uploadedFile.webViewLink || `https://drive.google.com/file/d/${uploadedFile.id}/view`
  };
}
