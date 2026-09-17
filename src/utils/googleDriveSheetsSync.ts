import { EvaluationRecord, TipoQuestionario, AppSettings } from '../types';
import { CAMPOS_BNCC, ESCALA_AVALIACAO } from '../data/questionarios';
import { getQuestoesPorTipo, getNomeQuestionario } from './evaluationCalculator';
import { saveStoredSettings, getStoredSettings, updateEvaluationStatus } from './storage';
import { appCache } from './cache';

export interface GoogleSyncResult {
  sucesso: boolean;
  mensagem: string;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  driveFolderId?: string;
  dossierFileId?: string;
  dossierUrl?: string;
}

/**
 * Helper to generate spreadsheet header row for a given questionnaire type (75 questions)
 */
function buildHeaderRow(tipo: TipoQuestionario): string[] {
  const questoes = getQuestoesPorTipo(tipo);
  
  const headers = [
    'Data / Hora',
    'ID da Sessão',
    'Nome da Criança',
    'Faixa Etária / Agrupamento',
    'Turma',
    'Educador(a) / Avaliador(a)',
    'Média Geral (1 a 5)',
    'Média C1 (O Eu, o Outro e o Nós)',
    'Média C2 (Corpo, Gestos e Movimentos)',
    'Média C3 (Traços, Sons, Cores e Formas)',
    'Média C4 (Escuta, Fala, Pensamento e Imaginação)',
    'Média C5 (Espaços, Tempos, Quantidades e Relações)',
    'Parecer Descritivo Geral',
  ];

  // Add 75 questions as individual columns
  questoes.forEach(q => {
    headers.push(`Q${q.numero}: ${q.pergunta}`);
  });

  // Add 5 observations columns for each field
  CAMPOS_BNCC.forEach(c => {
    headers.push(`Obs. ${c.nomeCurto}`);
  });

  return headers;
}

/**
 * Helper to generate row values from an evaluation record (75 questions)
 */
function buildDataRow(record: EvaluationRecord): (string | number)[] {
  const questoes = getQuestoesPorTipo(record.tipoQuestionario);
  
  const medias = record.mediasPorCampo || {};
  const mediaValues = Object.values(medias).filter(v => typeof v === 'number' && v > 0);
  const mediaGeral = mediaValues.length > 0 
    ? Number((mediaValues.reduce((a, b) => a + b, 0) / mediaValues.length).toFixed(2))
    : 0;

  const row: (string | number)[] = [
    new Date(record.timestamp).toLocaleString('pt-BR'),
    record.sessionId,
    record.criancaNome || 'Não informado',
    record.faixaEtaria,
    record.turma || '',
    record.educadorNome || '',
    mediaGeral,
    medias[1] || 0,
    medias[2] || 0,
    medias[3] || 0,
    medias[4] || 0,
    medias[5] || 0,
    record.parecerDescritivo || '',
  ];

  // 75 question answers
  questoes.forEach(q => {
    const val = record.respostas[q.id];
    const rotulo = ESCALA_AVALIACAO.find(e => e.valor === Number(val))?.rotuloCurto || '';
    row.push(val ? `${val} - ${rotulo}` : '');
  });

  // Observations per field
  CAMPOS_BNCC.forEach(c => {
    row.push(record.observacoesPorCampo?.[c.id] || '');
  });

  return row;
}

/**
 * Search user's Google Drive for an existing spreadsheet or create a new organized one
 */
export async function getOrCreateUserSpreadsheet(token: string): Promise<{ id: string; url: string }> {
  return appCache.getOrFetch('google_user_spreadsheet_info', async () => {
    const settings = getStoredSettings();
    if (settings.spreadsheetId && settings.spreadsheetId.trim() !== '') {
      return {
        id: settings.spreadsheetId.trim(),
        url: `https://docs.google.com/spreadsheets/d/${settings.spreadsheetId.trim()}/edit`
      };
    }

    // Search if a sheet created by this app already exists
    try {
      const query = encodeURIComponent("name = 'Avaliações BNCC - Educação Infantil' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false");
      const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.files && searchData.files.length > 0) {
          const found = searchData.files[0];
          saveStoredSettings({ ...settings, spreadsheetId: found.id });
          return {
            id: found.id,
            url: found.webViewLink || `https://docs.google.com/spreadsheets/d/${found.id}/edit`
          };
        }
      }
    } catch (err) {
      console.warn('Erro ao pesquisar planilha existente:', err);
    }

    // Create new Spreadsheet with two tabs for Q1 and Q2
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          title: 'Avaliações BNCC - Educação Infantil'
        },
        sheets: [
          {
            properties: {
              sheetId: 0,
              title: 'Bebês (Q1 - 75 Itens)',
              gridProperties: { frozenRowCount: 1 }
            }
          },
          {
            properties: {
              sheetId: 1,
              title: 'Crianças Bem Pequenas (Q2 - 75 Itens)',
              gridProperties: { frozenRowCount: 1 }
            }
          }
        ]
      })
    });

    if (!createRes.ok) {
      const errorText = await createRes.text();
      throw new Error(`Falha ao criar planilha no Google Sheets: ${errorText}`);
    }

    const createdSheet = await createRes.json();
    const spreadsheetId = createdSheet.spreadsheetId;
    const spreadsheetUrl = createdSheet.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    // Write headers to both sheets
    try {
      const headersBebes = buildHeaderRow('bebes');
      const headersCriancas = buildHeaderRow('bem_pequenas');

      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Bebês (Q1 - 75 Itens)'!A1?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: [headersBebes] })
      });

      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Crianças Bem Pequenas (Q2 - 75 Itens)'!A1?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: [headersCriancas] })
      });
    } catch (headerErr) {
      console.warn('Erro ao inserir cabeçalhos da planilha:', headerErr);
    }

    // Update app settings with the new spreadsheet ID
    saveStoredSettings({ ...settings, spreadsheetId });

    return { id: spreadsheetId, url: spreadsheetUrl };
  }, 45 * 60 * 1000, true);
}

/**
 * Search or create a dedicated folder in Google Drive for child dossiers
 */
export async function getOrCreateDossiersFolder(token: string): Promise<{ id: string; url: string }> {
  return appCache.getOrFetch('google_user_dossiers_folder_info', async () => {
    const settings = getStoredSettings();
    if (settings.driveFolderId && settings.driveFolderId.trim() !== '') {
      return {
        id: settings.driveFolderId.trim(),
        url: `https://drive.google.com/drive/folders/${settings.driveFolderId.trim()}`
      };
    }

    try {
      const query = encodeURIComponent("name = 'Dossiês BNCC - Educação Infantil' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
      const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (searchRes.ok) {
        const data = await searchRes.json();
        if (data.files && data.files.length > 0) {
          const found = data.files[0];
          saveStoredSettings({ ...settings, driveFolderId: found.id });
          return {
            id: found.id,
            url: found.webViewLink || `https://drive.google.com/drive/folders/${found.id}`
          };
        }
      }
    } catch (e) {
      console.warn('Erro ao buscar pasta no Drive:', e);
    }

    // Create folder
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Dossiês BNCC - Educação Infantil',
        mimeType: 'application/vnd.google-apps.folder'
      })
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      throw new Error(`Falha ao criar pasta de dossiês no Google Drive: ${errText}`);
    }

    const folder = await createRes.json();
    saveStoredSettings({ ...settings, driveFolderId: folder.id });

    return {
      id: folder.id,
      url: folder.webViewLink || `https://drive.google.com/drive/folders/${folder.id}`
    };
  }, 45 * 60 * 1000, true);
}

/**
 * Append evaluation to user's Google Sheet
 */
export async function appendEvaluationToGoogleSheet(
  record: EvaluationRecord,
  token: string,
  spreadsheetId: string
): Promise<{ success: boolean; url: string }> {
  const tabName = record.tipoQuestionario === 'bebes' 
    ? 'Bebês (Q1 - 75 Itens)' 
    : 'Crianças Bem Pequenas (Q2 - 75 Itens)';

  const row = buildDataRow(record);

  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${encodeURIComponent(tabName)}'!A1:append?valueInputOption=USER_ENTERED`;
  
  const res = await fetch(appendUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values: [row]
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Erro ao salvar na planilha do Google: ${errText}`);
  }

  return {
    success: true,
    url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
  };
}

/**
 * Generate formatted HTML pedagogical dossier text for upload to Drive
 */
function generateDossierHTML(record: EvaluationRecord): string {
  const tipo = record.tipoQuestionario;
  const todasQuestoes = getQuestoesPorTipo(tipo);

  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Dossiê Pedagógico BNCC - ${record.criancaNome || 'Criança'}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; }
    h1 { color: #4338ca; border-bottom: 2px solid #e0e7ff; padding-bottom: 8px; }
    .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px; }
    .campo-section { border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 20px; overflow: hidden; }
    .campo-header { background: #eef2ff; padding: 12px; font-weight: bold; color: #312e81; display: flex; justify-content: space-between; }
    .question-row { padding: 8px 12px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; font-size: 13px; }
    .question-row:last-child { border-bottom: none; }
    .badge { background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; white-space: nowrap; }
    .parecer-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-top: 24px; }
  </style>
</head>
<body>
  <h1>Relatório e Dossiê Pedagógico Individual - BNCC</h1>
  <p><strong>${getNomeQuestionario(tipo)}</strong> • 75 Indicadores de Desenvolvimento</p>
  
  <div class="meta-box">
    <div class="meta-grid">
      <div><strong>Criança:</strong> ${record.criancaNome || 'Não informado'}</div>
      <div><strong>Faixa Etária:</strong> ${record.faixaEtaria}</div>
      <div><strong>Turma:</strong> ${record.turma || 'Não informado'}</div>
      <div><strong>Educador(a):</strong> ${record.educadorNome || 'Não informado'}</div>
      <div><strong>Data da Avaliação:</strong> ${new Date(record.timestamp).toLocaleString('pt-BR')}</div>
      <div><strong>ID da Sessão:</strong> ${record.sessionId}</div>
    </div>
  </div>

  <h2>Síntese nos 5 Campos de Experiências (Escala 1 a 5)</h2>
  <div style="display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap;">
    ${CAMPOS_BNCC.map(c => `
      <div style="flex: 1; min-width: 120px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; text-align: center;">
        <div style="font-size: 11px; color: #64748b; font-weight: bold;">Campo ${c.id}</div>
        <div style="font-size: 12px; font-weight: bold; margin: 4px 0;">${c.nomeCurto}</div>
        <div style="font-size: 18px; font-weight: 800; color: #4338ca;">${record.mediasPorCampo?.[c.id] || 0} / 5.0</div>
      </div>
    `).join('')}
  </div>

  ${record.parecerDescritivo ? `
    <div class="parecer-box">
      <h3 style="margin-top: 0; color: #166534;">Parecer Descritivo Geral / Síntese Pedagógica</h3>
      <p style="white-space: pre-wrap;">${record.parecerDescritivo}</p>
    </div>
  ` : ''}

  <h2>Detalhamento dos 75 Indicadores de Observação</h2>
  ${CAMPOS_BNCC.map(campo => {
    const questoesCampo = todasQuestoes.filter(q => q.campoId === campo.id);
    const media = record.mediasPorCampo?.[campo.id] || 0;
    return `
      <div class="campo-section">
        <div class="campo-header">
          <span>Campo ${campo.id}: ${campo.nome}</span>
          <span>Média: ${media} / 5.0</span>
        </div>
        <div>
          ${questoesCampo.map(q => {
            const val = record.respostas[q.id];
            const esc = ESCALA_AVALIACAO.find(e => e.valor === Number(val));
            return `
              <div class="question-row">
                <span>${q.numero}. ${q.pergunta}</span>
                <span class="badge">${val ? `Nível ${val} - ${esc?.rotuloCurto}` : 'Não avaliado'}</span>
              </div>
            `;
          }).join('')}
        </div>
        ${record.observacoesPorCampo?.[campo.id] ? `
          <div style="padding: 10px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px;">
            <strong>Observações do Educador:</strong> ${record.observacoesPorCampo[campo.id]}
          </div>
        ` : ''}
      </div>
    `;
  }).join('')}

  <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 40px;">
    Documento pedagógico gerado automaticamente e armazenado no Google Drive do usuário.
  </p>
</body>
</html>`;

  return html;
}

/**
 * Upload pedagogical dossier to Google Drive folder
 */
export async function uploadDossierToGoogleDrive(
  record: EvaluationRecord,
  token: string,
  folderId?: string
): Promise<{ fileId: string; webViewLink: string }> {
  const fileName = `Dossiê_BNCC_${(record.criancaNome || 'Crianca').replace(/\s+/g, '_')}_${record.sessionId}.html`;
  const fileContent = generateDossierHTML(record);

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
    throw new Error(`Erro ao enviar arquivo para o Google Drive: ${errText}`);
  }

  const uploadedFile = await uploadRes.json();
  return {
    fileId: uploadedFile.id,
    webViewLink: uploadedFile.webViewLink || `https://drive.google.com/file/d/${uploadedFile.id}/view`
  };
}

/**
 * Master function to save everything directly to the user's Google Account:
 * 1. Appends record to Google Sheets
 * 2. Uploads full Dossier to Google Drive folder
 * 3. Updates local record to 'sincronizado'
 */
export async function syncEvaluationToUserGoogleAccount(
  record: EvaluationRecord,
  token: string
): Promise<GoogleSyncResult> {
  return appCache.deduplicate(`sync_eval_${record.sessionId}`, async () => {
    try {
      // 1. Get or create Google Sheet
      const sheetInfo = await getOrCreateUserSpreadsheet(token);

      // 2. Append row to sheet
      await appendEvaluationToGoogleSheet(record, token, sheetInfo.id);

      // 3. Get or create Drive Folder for dossiers
      let folderInfo: { id: string; url: string } | null = null;
      try {
        folderInfo = await getOrCreateDossiersFolder(token);
      } catch (folderErr) {
        console.warn('Erro ao criar pasta no Drive, enviando para raiz:', folderErr);
      }

      // 4. Upload dossier HTML file to Drive
      const dossierInfo = await uploadDossierToGoogleDrive(record, token, folderInfo?.id);

      // 5. Update local record
      updateEvaluationStatus(record.sessionId, 'sincronizado');

      return {
        sucesso: true,
        mensagem: 'Avaliação salva com sucesso no Google Sheets e no Google Drive da sua conta!',
        spreadsheetId: sheetInfo.id,
        spreadsheetUrl: sheetInfo.url,
        driveFolderId: folderInfo?.id,
        dossierFileId: dossierInfo.fileId,
        dossierUrl: dossierInfo.webViewLink
      };
    } catch (err: any) {
      console.error('Falha na sincronização direta com conta Google:', err);
      updateEvaluationStatus(record.sessionId, 'pendente_offline', err.message);
      return {
        sucesso: false,
        mensagem: err.message || 'Falha ao sincronizar com a conta Google.'
      };
    }
  });
}
