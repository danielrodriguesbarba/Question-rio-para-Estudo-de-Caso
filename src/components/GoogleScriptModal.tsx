import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Code2, 
  ExternalLink, 
  BookOpen, 
  FileCode,
  FolderOpen
} from 'lucide-react';
import { openGoogleAppsScript } from '../utils/googleWorkspace';

interface GoogleScriptModalProps {
  onClose: () => void;
}

export const GoogleScriptModal: React.FC<GoogleScriptModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'codegs' | 'index' | 'styles' | 'javascript' | 'passoapasso'>('passoapasso');
  const [copied, setCopied] = useState(false);

  const codeFiles = {
    codegs: `/**
 * BACKEND DO QUESTIONÁRIO INTERATIVO (Web App)
 * Plataforma: Google Apps Script
 * Integração: Google Sheets & MailApp (Google Workspace)
 */

const ID_PLANILHA = ""; // Deixe vazio para usar a planilha ativa ou insira o ID
const NOME_ABA_RESPOSTAS = "Respostas_Questionario";
const EMAIL_NOTIFICACAO = ""; // Ex: "coordenacao@escola.com.br"

function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Questionário de Avaliação e Desenvolvimento')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function obterPerguntas() {
  return [
    {
      id: "q1",
      tipo: "text",
      pergunta: "Nome completo da criança avaliada:",
      obrigatoria: true
    },
    {
      id: "q2",
      tipo: "radio",
      pergunta: "Grupo / Faixa Etária:",
      opcoes: [
        "Bebês (6 meses a 1 ano e 6 meses)",
        "Crianças Bem Pequenas (1 ano e 7 meses a 3 anos e 11 meses)"
      ],
      obrigatoria: true
    },
    {
      id: "q3",
      tipo: "scale",
      pergunta: "O Eu, o Outro e o Nós: A criança reage ao ser chamada pelo nome e reconhece pessoas do convívio social?",
      min: 1,
      max: 5,
      labelMin: "Em desenvolvimento inicial",
      labelMax: "Totalmente consolidado",
      obrigatoria: true
    },
    {
      id: "q4",
      tipo: "scale",
      pergunta: "Corpo, Gestos e Movimentos: Apresenta segurança postural, equilíbrio e exploração intencional do espaço?",
      min: 1,
      max: 5,
      labelMin: "Em desenvolvimento inicial",
      labelMax: "Totalmente consolidado",
      obrigatoria: true
    },
    {
      id: "q5",
      tipo: "checkbox",
      pergunta: "Traços, Sons, Cores e Formas: Quais manifestações expressivas são observadas com frequência?",
      opcoes: [
        "Interesse por objetos coloridos e contrastes visuais",
        "Exploração ativa de instrumentos sonoros e chocalhos",
        "Interesse e manipulação de livros ou materiais gráficos",
        "Movimentação corporal ao som de ritmos e canções"
      ],
      obrigatoria: false
    },
    {
      id: "q6",
      tipo: "scale",
      pergunta: "Escuta, Fala, Pensamento e Imaginação: Orienta o olhar, emite vocalizações ou usa gestos para se comunicar?",
      min: 1,
      max: 5,
      labelMin: "Em desenvolvimento inicial",
      labelMax: "Totalmente consolidado",
      obrigatoria: true
    },
    {
      id: "q7",
      tipo: "scale",
      pergunta: "Espaços, Tempos, Quantidades e Relações: Demonstra reconhecimento de rotinas, espaços e relações de causa e efeito?",
      min: 1,
      max: 5,
      labelMin: "Em desenvolvimento inicial",
      labelMax: "Totalmente consolidado",
      obrigatoria: true
    },
    {
      id: "q8",
      tipo: "textarea",
      pergunta: "Parecer Descritivo / Observações Complementares:",
      obrigatoria: false
    }
  ];
}

function salvarRespostas(dados) {
  try {
    const ss = ID_PLANILHA !== "" 
      ? SpreadsheetApp.openById(ID_PLANILHA) 
      : SpreadsheetApp.getActiveSpreadsheet();
      
    let aba = ss.getSheetByName(NOME_ABA_RESPOSTAS);
    const perguntas = obterPerguntas();
    
    if (!aba) {
      aba = ss.insertSheet(NOME_ABA_RESPOSTAS);
      const cabecalhos = ["Carimbo de Data/Hora", "ID da Sessão"];
      perguntas.forEach(p => cabecalhos.push(p.pergunta));
      aba.appendRow(cabecalhos);
      
      const rangeCabecalho = aba.getRange(1, 1, 1, cabecalhos.length);
      rangeCabecalho.setBackground("#4F46E5").setFontColor("#FFFFFF").setFontWeight("bold");
      aba.setFrozenRows(1);
    }
    
    const linha = [
      new Date(),
      dados.sessionId || Utilities.getUuid()
    ];
    
    perguntas.forEach(p => {
      let resposta = dados.respostas[p.id];
      if (Array.isArray(resposta)) {
        linha.push(resposta.join("; "));
      } else if (resposta !== undefined && resposta !== null) {
        linha.push(resposta);
      } else {
        linha.push("");
      }
    });
    
    aba.appendRow(linha);
    return { sucesso: true, mensagem: "Avaliação registrada no Google Sheets com sucesso!" };
  } catch (erro) {
    return { sucesso: false, mensagem: "Erro ao registrar: " + erro.toString() };
  }
}

function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);
    const resultado = salvarRespostas(dados);
    return ContentService.createTextOutput(JSON.stringify(resultado))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ sucesso: false, erro: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`,

    index: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <base target="_top">
  <meta charset="UTF-8">
  <?!= include('Styles'); ?>
</head>
<body>
  <div class="app-card">
    <div id="telaBoasVindas" class="active">
      <div class="header-icon">📋</div>
      <h1 class="titulo-principal">Instrumento de Avaliação</h1>
      <p class="descricao-inicial">
        Este questionário permite registrar observações de acompanhamento e desenvolvimento infantil de maneira individualizada, prática e segura.
      </p>
      <div class="instrucoes-box">
        <h3>Instruções de Preenchimento</h3>
        <ul>
          <li>Navegação passo a passo simples e intuitiva.</li>
          <li>Itens com asterisco (*) são de resposta obrigatória.</li>
          <li>Suas respostas são armazenadas diretamente na planilha oficial.</li>
        </ul>
      </div>
      <button id="btnIniciar" class="btn-primario" onclick="iniciarQuestionario()">
        Iniciar Questionário
      </button>
    </div>

    <div id="telaQuestionario">
      <div class="progresso-wrapper">
        <div class="progresso-info">
          <span id="progressoPassoTexto">Pergunta 1 de 8</span>
          <span id="progressoPercentualTexto">12%</span>
        </div>
        <div class="progresso-trilha">
          <div id="progressoPreenchimento" class="progresso-barra"></div>
        </div>
      </div>
      <div id="containerPergunta"></div>
      <div id="mensagemErro" class="alerta-erro"></div>
      <div class="navegacao-acoes">
        <button id="btnAnterior" class="btn-secundario" onclick="perguntaAnterior()">Anterior</button>
        <button id="btnProxima" class="btn-primario" onclick="proximaPergunta()">Próxima</button>
        <button id="btnEnviar" class="btn-sucesso" style="display: none;" onclick="submeterFormulario()">Enviar Respostas</button>
      </div>
    </div>

    <div id="telaSucesso">
      <div class="icone-sucesso">✓</div>
      <h2>Respostas Registradas!</h2>
      <p>As observações foram devidamente consolidadas no banco de dados.</p>
      <div id="sessaoInfo" class="sessao-info"></div>
      <button class="btn-secundario" onclick="reiniciarQuestionario()">Novo Preenchimento</button>
    </div>
  </div>
  <?!= include('JavaScript'); ?>
</body>
</html>`,

    styles: `/* Design Tokens e Estilos Modernos */
:root {
  --primary: #4F46E5;
  --primary-hover: #4338CA;
  --success: #10B981;
  --danger: #EF4444;
  --bg-app: #F8FAFC;
  --surface: #FFFFFF;
  --text-main: #0F172A;
  --text-muted: #64748B;
  --border: #E2E8F0;
  --radius: 16px;
  --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
}
* { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
body { background: var(--bg-app); color: var(--text-main); display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 16px; }
.app-card { background: var(--surface); width: 100%; max-width: 640px; border-radius: var(--radius); box-shadow: var(--shadow); border: 1px solid var(--border); padding: 32px; }
.btn-primario { background: var(--primary); color: white; border: none; border-radius: 10px; padding: 12px 24px; font-weight: 600; cursor: pointer; }
.btn-secundario { background: transparent; border: 1px solid var(--border); border-radius: 10px; padding: 12px 24px; font-weight: 600; cursor: pointer; }
.btn-sucesso { background: var(--success); color: white; border: none; border-radius: 10px; padding: 12px 24px; font-weight: 600; cursor: pointer; }
`,

    javascript: `// Motor do Cliente: Navegação, Validação e Envio
let perguntas = [];
let indiceAtual = 0;
let respostas = {};
let sessionId = "";

window.onload = function() {
  google.script.run
    .withSuccessHandler(function(dados) { perguntas = dados; })
    .obterPerguntas();
};

function iniciarQuestionario() {
  sessionId = "SESS_" + new Date().getTime();
  indiceAtual = 0;
  respostas = {};
  document.getElementById("telaBoasVindas").classList.remove("active");
  document.getElementById("telaQuestionario").classList.add("active");
  renderizarPergunta();
}
`,

    passoapasso: `=== GUIA COMPLETO DE INSTALAÇÃO NO GOOGLE WORKSPACE ===

1. CRIE OU ABRA SUA PLANILHA NO GOOGLE DRIVE:
   - Acesse drive.google.com e crie uma nova "Planilha Google" (Google Sheets).
   - Dê o nome que desejar, por exemplo: "Avaliações BNCC - Educação Infantil".

2. ABRA O EDITOR DE APPS SCRIPT:
   - No menu superior da planilha, clique em: Extensões > Apps Script.

3. CRIE OS 4 ARQUIVOS NO PROJETO:
   - No painel lateral esquerdo (Arquivos), clique em "+":
     a) Arquivo de script: Nomeie como "Code" (substitua o código pelo conteúdo da aba Code.gs).
     b) Arquivo HTML: Nomeie como "Index" (conteúdo da aba Index.html).
     c) Arquivo HTML: Nomeie como "Styles" (conteúdo da aba Styles.html).
     d) Arquivo HTML: Nomeie como "JavaScript" (conteúdo da aba JavaScript.html).

4. IMPLANTE COMO APLICATIVO WEB (WEB APP):
   - No canto superior direito, clique no botão azul: "Implantar" > "Nova implantação".
   - Clique no ícone de engrenagem ⚙️ e selecione "App da Web".
   - Descrição: "Questionário BNCC v1.0"
   - Executar como: "Eu (seu e-mail)"
   - Quem pode acessar: "Qualquer pessoa" (ou "Qualquer pessoa no domínio").
   - Clique em "Implantar", autorize as permissões da sua conta Google.

5. INTEGRAÇÃO COM ESTE PWA OFFLINE:
   - Copie o "URL do app da Web" fornecido pelo Google Apps Script.
   - Volte a este PWA, abra a engrenagem de Configurações (canto superior direito) e cole a URL no campo "URL do Web App".
   - Pronto! Todas as respostas gravadas offline ou online serão enviadas automaticamente para a sua planilha e Google Drive!`
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Arquitetura Google Apps Script (Workspace)
              </h3>
              <p className="text-xs text-slate-500">
                Os 4 módulos originais e guia de implantação no Google Drive / Sheets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 border-b border-slate-200 bg-slate-100 flex items-center gap-1 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('passoapasso')}
            className={`px-3.5 py-2.5 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'passoapasso'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Passo a Passo</span>
          </button>
          <button
            onClick={() => setActiveTab('codegs')}
            className={`px-3.5 py-2.5 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'codegs'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Code.gs (Backend)</span>
          </button>
          <button
            onClick={() => setActiveTab('index')}
            className={`px-3.5 py-2.5 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'index'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Index.html</span>
          </button>
          <button
            onClick={() => setActiveTab('styles')}
            className={`px-3.5 py-2.5 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'styles'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Styles.html</span>
          </button>
          <button
            onClick={() => setActiveTab('javascript')}
            className={`px-3.5 py-2.5 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'javascript'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>JavaScript.html</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-slate-950 text-slate-100 font-mono text-xs">
          {activeTab === 'passoapasso' ? (
            <div className="font-sans text-slate-200 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
              {codeFiles.passoapasso}
            </div>
          ) : (
            <pre className="overflow-x-auto">
              <code>{codeFiles[activeTab]}</code>
            </pre>
          )}
        </div>

        {/* Footer with Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={openGoogleAppsScript}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition"
          >
            <FolderOpen className="w-4 h-4 text-amber-500" />
            <span>Abrir script.google.com</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyCode(codeFiles[activeTab])}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Conteúdo</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
