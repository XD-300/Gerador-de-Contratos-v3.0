// === AutoCalc Event Bus & helpers (append-only) ===
window.CalcBus = window.CalcBus || new EventTarget();

function emitCalc(type, detail) {
  try { CalcBus.dispatchEvent(new CustomEvent(type, { detail })); }
  catch {}
}
window.emitCalc = emitCalc;
/* ==========================================================================
   GERADOR DE CONTRATOS - UTILITÁRIOS AVANÇADOS
   Funções auxiliares baseadas no sistema Python existente
   ========================================================================== */

// ==========================================================================
// CONSTANTES E CONFIGURAÇÕES
// ==========================================================================

/**
 * Siglas que devem ser mantidas em maiúsculas
 */
const SIGLAS = new Set(["CPF", "RG", "UF", "RA", "CEP", "CNH", "CS"]);

/**
 * Palavras que não devem ser capitalizadas (exceto no início)
 */
const excTitle = new Set(["da", "de", "do", "das", "dos", "e"]);

/**
 * Mapeamento de aliases para campos canônicos
 */
const ALIASES = {
  "NÚMERO DO CPF": "CPF",
  "NÚMERO DE PARCELAS": "NUMERO DE PARCELAS", 
  "CARGA HORARIA": "CARGA HORÁRIA",
  "PROFISSINALIZANTE": "PROFISSIONALIZANTE",
  "TELEFONE RESPONSAVEL": "TELEFONE",
  "NASC RESPONSAVEL": "NASC RESP"
};

/**
 * Placeholders canônicos para templates
 */
const PLACEHOLDERS_CANONICOS = {
  // Identificação
  "CONTRATO": "{{CONTRATO}}",
  "DATA": "{{DATA}}",
  
  // Responsável
  "NOME COMPLETO": "{{NOME COMPLETO}}",
  "NASC RESP": "{{NASC RESP}}",
  "CPF": "{{NÚMERO DO CPF}}",
  "RG RESPONSAVEL": "{{RG RESPONSAVEL}}",
  "TELEFONE": "{{TELEFONE}}",
  
  // Endereço
  "ENDEREÇO COMPLETO": "{{ENDEREÇO COMPLETO}}",
  "N CS": "{{N CS}}",
  "BAIRRO": "{{BAIRRO}}",
  "CEP": "{{CEP}}",
  "CID/EST": "{{CID/EST}}",
  
  // Aluno
  "NOME DO ALUNO": "{{NOME DO ALUNO}}",
  "NASC ALUNO": "{{NASC ALUNO}}",
  "CPF DO ALUNO": "{{CPF DO ALUNO}}",
  "RG ALUNO": "{{RG ALUNO}}",
  
  // Curso
  "PROFISSIONALIZANTE": "{{PROFISSIONALIZANTE}}",
  "CARGA HORÁRIA": "{{CARGA HORÁRIA}}",
  
  // Valores
  "VALOR TOTAL": "{{VALOR TOTAL}}",
  "PARCELA": "{{PARCELA}}",
  "DESCONTO": "{{DESCONTO}}",
  "NUMERO DE PARCELAS": "{{NUMERO DE PARCELAS}}"
};

// ==========================================================================
// NORMALIZAÇÃO DE TEXTO
// ==========================================================================

/**
 * Remove espaços duplicados e faz trim
 * @param {string} s - String para normalizar
 * @returns {string} String normalizada
 */
const normalizarEspacos = (s) => {
  return (s || "").split(/\s+/).filter(Boolean).join(" ");
};

/**
 * Mantém siglas em maiúsculas quando aparecem como palavras inteiras
 * @param {string} s - String para processar
 * @returns {string} String com siglas formatadas
 */
const normalizarSiglas = (s) => {
  return (s || "").replace(/\b[A-Za-z]{2,4}\b/g, (match) => {
    return SIGLAS.has(match.toUpperCase()) ? match.toUpperCase() : match;
  });
};

/**
 * Converte texto para Title Case respeitando preposições e siglas
 * @param {string} s - String para converter
 * @returns {string} Texto formatado
 */
const titleCase = (s = "") => {
  const normalizado = normalizarEspacos(s);
  const comSiglas = normalizarSiglas(normalizado);
  
  return comSiglas.split(/\s+/).map((p, i) => {
    // Se já é uma sigla, mantém
    if (SIGLAS.has(p.toUpperCase())) {
      return p.toUpperCase();
    }
    
    const lower = p.toLowerCase();
    // Preposições (exceto primeira palavra)
    if (i > 0 && excTitle.has(lower)) {
      return lower;
    }
    
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join(" ");
};

// ==========================================================================
// FUNÇÕES DE LIMPEZA
// ==========================================================================

/**
 * Remove todos os caracteres não numéricos
 * @param {string} s - String para limpar
 * @returns {string} Apenas dígitos
 */
const onlyDigits = (s) => (s || "").replace(/\D+/g, "");

// ==========================================================================
// MÁSCARAS DE FORMATAÇÃO
// ==========================================================================

/**
 * Aplica máscara de CPF (000.000.000-00)
 * @param {string} v - Valor para formatar
 * @returns {string} CPF formatado
 */
function maskCPF(v) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

/**
 * Aplica máscara de telefone ((99) 99999-9999)
 * @param {string} v - Valor para formatar
 * @returns {string} Telefone formatado
 */
function maskPhone(v) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/**
 * Aplica máscara de CEP (00000-000)
 * @param {string} v - Valor para formatar
 * @returns {string} CEP formatado
 */
function maskCEP(v) {
  const d = onlyDigits(v).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

/**
 * Aplica máscara de data (DD/MM/AAAA)
 * @param {string} v - Valor para formatar
 * @returns {string} Data formatada
 */
function maskDate(v) {
  const d = onlyDigits(v).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

// ==========================================================================
// FORMATAÇÃO MONETÁRIA (BRL)
// ==========================================================================

/**
 * Converte string monetária brasileira para número
 * @param {string} s - String no formato "R$ 1.234,56" ou "1.234,56"
 * @returns {number} Valor numérico
 */
function parseBRL(s) {
  s = (s || "").trim();
  if (!s) return 0;
  s = s.replace(/R\$|\s|\./g, "").replace(",", ".");
  const n = Number(s);
  return isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

/**
 * Formata número para string monetária brasileira
 * @param {number} n - Valor numérico
 * @returns {string} String formatada "R$ 1.234,56"
 */
function fmtBRL(n) {
  if (n == null || isNaN(n)) return "";
  
  n = Math.round((Number(n) || 0) * 100) / 100;
  
  // Para valores zero, retorna R$ 0,00
  if (n === 0) return "R$ 0,00";
  
  // Formata sempre com R$ e separadores corretos
  const absoluteValue = Math.abs(n);
  const formatted = absoluteValue.toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return n < 0 ? `-R$ ${formatted}` : `R$ ${formatted}`;
}

// ==========================================================================
// HELPERS DOM
// ==========================================================================

/**
 * Seletor de elemento único
 * @param {string} sel - Seletor CSS
 * @returns {Element|null} Elemento encontrado
 */
const $ = (sel) => document.querySelector(sel);

/**
 * Seletor de múltiplos elementos
 * @param {string} sel - Seletor CSS
 * @returns {Array} Array de elementos
 */
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/**
 * Obtém valor de um input pelo ID (à prova de null)
 * @param {string} id - ID do elemento (com #)
 * @returns {string} Valor do input
 */
const get = (id) => (document.getElementById(id)?.value ?? '').trim();

/**
 * Define valor de um input pelo ID
 * @param {string} id - ID do elemento (com #)
 * @param {string} v - Valor para definir
 */
const set = (id, v) => { 
  const el = $(id);
  if (el) el.value = v; 
};

// ==========================================================================
// VALIDAÇÕES AVANÇADAS (baseadas no sistema Python)
// ==========================================================================

/**
 * Valida CPF usando algoritmo oficial
 * @param {string} cpf - CPF para validar
 * @returns {boolean} CPF é válido
 */
function isValidCPF(cpf) {
  cpf = onlyDigits(cpf);
  
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; // Todos iguais
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  let digitoVerificador1 = resto < 2 ? 0 : resto;
  
  if (digitoVerificador1 !== parseInt(cpf.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  let digitoVerificador2 = resto < 2 ? 0 : resto;
  
  return digitoVerificador2 === parseInt(cpf.charAt(10));
}

/**
 * Valida se uma data está no formato correto e é válida
 * @param {string} date - Data no formato DD/MM/AAAA
 * @returns {boolean} Data é válida
 */
function isValidDate(date) {
  if (!date || !/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return false;
  
  const [day, month, year] = date.split('/').map(Number);
  
  // Validação de range
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) {
    return false;
  }
  
  const dateObj = new Date(year, month - 1, day);
  
  return dateObj.getDate() === day && 
         dateObj.getMonth() === month - 1 && 
         dateObj.getFullYear() === year;
}

/**
 * Valida telefone (10 ou 11 dígitos)
 * @param {string} phone - Telefone para validar
 * @returns {boolean} Telefone é válido
 */
function isValidPhone(phone) {
  const digits = onlyDigits(phone);
  return digits.length === 10 || digits.length === 11;
}

/**
 * Validação completa por tipo de campo (baseada no Python)
 * @param {string} fieldName - Nome do campo
 * @param {string} value - Valor para validar
 * @returns {boolean} Campo é válido
 */
function validarCampo(fieldName, value) {
  const nome = (fieldName || "").toUpperCase().trim();
  const valor = (value || "").trim();
  
  // Nomes completos
  if (nome.includes("NOME COMPLETO") || nome.includes("NOME DO ALUNO")) {
    return valor.length >= 3;
  }
  
  // Datas
  if (nome.includes("NASC") || nome === "DATA") {
    return isValidDate(valor);
  }
  
  // CPFs
  if (nome.includes("CPF")) {
    return isValidCPF(valor);
  }
  
  // Telefones
  if (nome.includes("TELEFONE")) {
    return isValidPhone(valor);
  }
  
  // Endereços
  if (nome.includes("ENDEREÇO") || nome.includes("BAIRRO") || 
      nome.includes("CEP") || nome.includes("CID/EST")) {
    return valor.length > 0;
  }
  
  // Cursos
  if (nome.includes("PROFISSIONALIZANTE") || nome.includes("CARGA")) {
    return valor.length > 0;
  }
  
  // Valores monetários
  if (nome.includes("VALOR") || nome.includes("PARCELA") || 
      nome.includes("ENTRADA") || nome.includes("DESCONTO")) {
    const parsed = parseBRL(valor);
    return parsed > 0;
  }
  
  // Por padrão, apenas verifica se não está vazio
  return valor.length > 0;
}

/**
 * Valida múltiplos campos de uma vez
 * @param {Object} campos - Objeto com nome_campo: valor
 * @returns {Object} Resultado da validação
 */
function validarCampos(campos) {
  const erros = [];
  const warnings = [];
  
  for (const [nome, valor] of Object.entries(campos)) {
    if (!validarCampo(nome, valor)) {
      erros.push(`${nome}: valor inválido ou em formato incorreto`);
    }
  }
  
  return {
    valido: erros.length === 0,
    erros,
    warnings
  };
}

// ==========================================================================
// SISTEMA DE ALIASES E MAPEAMENTO (baseado no Python)
// ==========================================================================

/**
 * Normaliza rótulos para casar com aliases (similar ao _canon do Python)
 * @param {string} label - Rótulo para normalizar
 * @returns {string} Rótulo canonico
 */
function canonicalizarCampo(label) {
  if (!label) return "";
  
  const normalizado = label.toString().trim().split(/\s+/).join(" ").toUpperCase();
  
  // Primeiro tenta alias direto
  return ALIASES[normalizado] || normalizado;
}

/**
 * Mescla dados por alias (baseado na função Python)
 * @param {Object} dados - Dados com possíveis aliases
 * @returns {Object} Dados mesclados com chaves canônicas
 */
function mesclarPorAlias(dados) {
  const merged = {};
  
  for (const [chaveRaw, valor] of Object.entries(dados || {})) {
    const chave = canonicalizarCampo(chaveRaw);
    
    // Só considera se existe no mapeamento canônico
    if (PLACEHOLDERS_CANONICOS[chave]) {
      if (valor != null && valor.toString().trim() !== "") {
        // Prioriza o primeiro valor não-vazio encontrado
        if (!merged[chave]) {
          merged[chave] = valor;
        }
      }
    }
  }
  
  return merged;
}

/**
 * Ordem de campos para exibição (baseada no Python)
 */
const CAMPOS_ORDEM = [
  // Cabeçalho
  "CONTRATO", "DATA",
  
  // Responsável
  "NOME COMPLETO", "NASC RESP", "CPF", "RG RESPONSAVEL", "TELEFONE",
  "ENDEREÇO COMPLETO", "N CS", "BAIRRO", "CEP", "CID/EST",
  
  // Aluno
  "NOME DO ALUNO", "NASC ALUNO", "CPF DO ALUNO", "RG ALUNO",
  
  // Curso
  "PROFISSIONALIZANTE", "CARGA HORÁRIA",
  
  // Valores
  "VALOR TOTAL", "PARCELA", "DESCONTO", "NUMERO DE PARCELAS"
];

/**
 * Ordena campos conforme a ordem padrão
 * @param {Object} dados - Dados para ordenar
 * @returns {Object} Dados ordenados
 */
function ordenarCampos(dados) {
  const ordenado = {};
  
  // Primeiro, adiciona campos na ordem definida
  for (const campo of CAMPOS_ORDEM) {
    if (dados[campo] !== undefined) {
      ordenado[campo] = dados[campo];
    }
  }
  
  // Depois, adiciona campos restantes
  for (const [chave, valor] of Object.entries(dados)) {
    if (!ordenado.hasOwnProperty(chave)) {
      ordenado[chave] = valor;
    }
  }
  
  return ordenado;
}

/**
 * Sanitiza nome de arquivo (baseado no Python)
 * @param {string} texto - Texto para sanitizar
 * @returns {string} Nome de arquivo seguro
 */
function sanitizarNomeArquivo(texto) {
  return (texto || "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[\\/:*?"<>|]/g, "")
    .slice(0, 120);
}

// ==========================================================================
// EXPORTAÇÕES
// ==========================================================================

// Exportar para escopo global se não há sistema de módulos
if (typeof module === 'undefined') {
  // Exportação principal organizada
  window.ContractUtils = {
    // Formatação e normalização
    titleCase,
    onlyDigits,
    normalizarEspacos,
    normalizarSiglas,
    
    // Máscaras
    maskCPF,
    maskPhone,
    maskCEP,
    maskDate,
    
    // Monetário
    parseBRL,
    fmtBRL,
    
    // DOM
    $,
    $$,
    get,
    set,
    
    // Validações avançadas
    isValidCPF,
    isValidDate,
    isValidPhone,
    validarCampo,
    validarCampos,
    
    // Sistema de aliases
    canonicalizarCampo,
    mesclarPorAlias,
    ordenarCampos,
    sanitizarNomeArquivo,
    
    // Constantes
    ALIASES,
    PLACEHOLDERS_CANONICOS,
    CAMPOS_ORDEM
  };
  
  // Apenas aliases essenciais para compatibilidade (evitar duplicação)
  window.$ = $;
  window.$$ = $$;
  window.get = get;
  window.set = set;
  window.parseBRL = parseBRL;
  window.fmtBRL = fmtBRL;
  
  // Manter apenas estas constantes globais
  window.PLACEHOLDERS_CANONICOS = PLACEHOLDERS_CANONICOS;
}

console.log('✅ Utils carregado com sucesso');

// ===================== APPEND-ONLY: CalcBus + helpers =====================

/** Tooltip de sugestão ao lado do input (desaparece sozinho) */
window.showCalcHint = function showCalcHint(inputEl, text, ms = 1600) {
  if (!inputEl) return;
  const tip = document.createElement('div');
  tip.textContent = text;
  tip.style.cssText = `
    position:absolute; z-index:9999; font:12px/1.3 ui-sans-serif, system-ui;
    background:#0b1635; color:#e8ecff; border:1px solid #2a3569; border-radius:8px;
    padding:6px 8px; box-shadow:0 8px 24px rgba(0,0,0,.25); pointer-events:none; opacity:.98;
  `;
  document.body.appendChild(tip);
  const r = inputEl.getBoundingClientRect();
  tip.style.left = `${window.scrollX + r.right + 8}px`;
  tip.style.top  = `${window.scrollY + r.top - 4}px`;
  setTimeout(()=> tip.remove(), ms);
};

/** Marca um campo como "manual/lock" quando o usuário digita (usado pelo cálculo para não sobrescrever) */
window.markManualOnInput = function markManualOnInput(selectorList) {
  (selectorList || []).forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    if (el.__manualBound) return;
    el.__manualBound = true;
    el.addEventListener('input', () => { el.dataset.locked = "1"; emitCalc("campoTravado", { id: sel }); });
  });
};

// ===================== APPEND-ONLY: LMS PLACEHOLDER MAP (final revisado) =====================
window.PLACEHOLDER_MAP = Object.assign(window.PLACEHOLDER_MAP || {}, {
  // Campos principais
  "lms_carga_horaria": "carga",
  "lms_pagamento": "forma",

  // Variantes toleradas (para compatibilidade de templates)
  "lms_forma_pagamento": "forma",
  "lms_pagto": "forma",

  // Campos da capa/financeiros adicionais
  "lms_inscricao": "avista",
  "lms_inscrição": "avista",
  "lms_numero_parcela": "nParcelas",
  "lms_valor_parcela": "parcela",
  "lms_valor_curso": "total",
  "lms_curso": "curso"
});
