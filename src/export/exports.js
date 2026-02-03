// Função utilitária para download de DOCX com auditoria e liberação de URL
function downloadDocx(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'Contrato_preenchido.docx';
  document.body.appendChild(a);
  a.click();
  a.remove();
  // revoga depois para liberar memória (evita race em alguns browsers)
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  // 🔔 auditoria/relatório: marca o momento exato do "oferecer download"
  window.dispatchEvent(new CustomEvent('docx:downloaded', {
    detail: { filename: a.download }
  }));
}

/* ==========================================================================
   GERADOR DE CONTRATOS - EXPORTAÇÕES
   Funcionalidades para exportar dados em diferentes formatos
   ========================================================================== */

/**
 * Classe responsável pelas exportações de contratos
 */
class ContractExports {

  /**
   * Preenche o formulário com dados de exemplo
   */
  static fillExample() {
    // Dados e mapeamento conforme docs/dados_exemplo_atualizados.md
    const exemplo = {
      modelo: 'CONTRATO_DE_PRESTACAO_DE_SERVICO',
      forma: 'cartao',
      data: '13/10/2025',
      nomeResp: 'Maria de Souza Almeida',
      nascResp: '05/09/1986',
      cpfResp: '055.232.992-43',
      rgResp: '1234567',
      telResp: '(94) 98888-7777',
      endereco: 'Rua Bernardo Sayão',
      numero: '189',
      bairro: 'Centro',
      cep: '68140-000',
      cidadeUf: 'Uruará/PA',
      nomeAluno: 'João Vitor Almeida',
      nascAluno: '12/10/2012',
      sexoAluno: '',
      rgAluno: '7778889',
      cpfAluno: '123.123.123-12',
      raAluno: '',
      curso: 'Técnico em Enfermagem',
      carga: '1200h',
      contrato: '001/2026',
      avista: '',
      entrada: 'R$ 100,00',
      nParcelas: '10',
      parcela: 'R$ 100,00',
      diaVenc: '10',
      desconto: 'R$ 20,00',
      total: 'R$ 1.000,00'
    };
    Object.entries(exemplo).forEach(([id, valor]) => {
      const el = document.getElementById(id);
      if (el) el.value = valor;
    });
    // (sem alerta)
  }

  /**
   * Coleta os dados do formulário atual e mapeia para os placeholders do DOCX
   * @returns {Object} Dados estruturados do contrato (chaves = nomes dos placeholders)
   */
  static collectData() {
    const val = (id) => (document.getElementById(id)?.value ?? '').trim();

    // --- Endereço base (responsável) ---
    const endereco = val('endereco');
    const numero   = val('numero');
    const bairro   = val('bairro');
    const cep      = val('cep');
    const cidadeUf = val('cidadeUf');

      let cidade = '';
      let uf     = '';

    if (cidadeUf) {
      // aceita "Cidade/UF" ou "Cidade - UF"
      const parts = cidadeUf.split(/[-/]/).map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        cidade = parts[0];
          uf     = parts[parts.length - 1].toUpperCase(); // força UF maiúsculo
      }
    }

    // --- Forma de pagamento: converte código → descrição ---
    const formaCode = val('forma'); // avista | cartao | boleto
    let formaDesc = '';
    switch (formaCode) {
      case 'avista':
        formaDesc = 'À vista';
        break;
      case 'cartao':
        formaDesc = 'Cartão de Crédito';
        break;
      case 'boleto':
        formaDesc = 'Boleto Bancário';
        break;
      default:
        formaDesc = formaCode; // fallback bruto
    }

    const dados = {
      // ------------------------------
      // Identificação
      // ------------------------------
      cod_aluno:    val('raAluno') || val('cpfAluno') || '', // usando RA como código do aluno
      cod_contrato: val('contrato'),

      // ------------------------------
      // Financeiro (mapeando campos atuais)
      // ------------------------------
      // Taxa de inscrição: melhor aproximação é usar a ENTRADA (quando existir)
      lms_inscricao:       val('entrada') || '',
      lms_numero_parcela:  val('nParcelas'),
      lms_pagamento:       formaDesc,
      lms_valor_parcela:   val('parcela'),
      lms_venc:            val('diaVenc'),
      lms_valor_curso:     val('total'),
      lms_curso:           val('curso'),
      lms_carga_horaria:   val('carga'),

      // ------------------------------
      // Aluno (Contratante)
      // ------------------------------
      lms_nome_aluno:      val('nomeAluno'),
      lms_cpf_aluno:       val('cpfAluno'),
      lms_endereco_aluno:  endereco
        ? `${endereco}${numero ? ', ' + numero : ''}${bairro ? ' - ' + bairro : ''}`
        : '',
      lms_cidade_aluno:    cidade,
      lms_estado_aluno:    uf,
      lms_cep_aluno:       cep,
      lms_nasc_aluno:      val('nascAluno'),
      // Não há campo de telefone do aluno no HTML → usamos o do responsável
      lms_telefone_aluno:  val('telResp'),
      lms_rg_aluno:        val('rgAluno'),

      // ------------------------------
      // Representante Legal (Responsável financeiro)
      // ------------------------------
      lms_nome_responsavel:     val('nomeResp'),
      lms_cpf_responsavel:      val('cpfResp'),
      lms_endereco_responsavel: endereco
        ? `${endereco}${numero ? ', ' + numero : ''}${bairro ? ' - ' + bairro : ''}`
        : '',
      lms_cidade_responsavel:   cidade,
      lms_cep_responsavel:      cep,
      lms_nasc_responsavel:     val('nascResp'),
      lms_telefone_responsavel: val('telResp'),
      lms_rg_responsavel:       val('rgResp'),

      // ------------------------------
      // Foro / assinatura
      // ------------------------------
        lms_cidade_uf: (cidade && uf) ? `${cidade} - ${uf}` : cidadeUf ? cidadeUf.replace(/([A-Za-zÀ-ú'\- ]+)\/(\w{2})$/, (m, c, u) => `${c}/${u.toUpperCase()}`) : '',
      lms_data:      val('data')
    };

    // Metadados (opcional, mas útil se você quiser debugar)
    dados._meta = {
      modelo:   'CONTRATO_DE_PRESTACAO_DE_SERVICO',
      geradoEm: new Date().toISOString(),
      versao:   '3.0-LMS-ONLY'
    };

    return dados;
  }

  /**
   * Exporta dados como arquivo JSON
   */
  static exportJSON() {
    try {
      const dados = this.collectData();
      const json = JSON.stringify(dados, null, 2);

      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `contrato_${dados.cod_contrato || 'dados'}.json`;
      a.click();

      URL.revokeObjectURL(url);

      console.log('✅ JSON exportado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao exportar JSON:', error);
      alert('Erro ao gerar arquivo JSON. Verifique os dados e tente novamente.');
    }
  }

  /**
   * Mapeia o modelo selecionado para o arquivo de template correspondente
   * (mantido para compatibilidade; hoje sempre devolve o mesmo template)
   */
  static _getTemplatePathFromModel(modelo) {
    return 'templates/CONTRATO_DE_PRESTACAO_DE_SERVICO.docx';
  }

  /**
   * (Opcional) Carrega template automaticamente baseado no modelo selecionado.
   * Não é mais o caminho principal: o fluxo preferido é via <input type="file" id="templateUpload">.
   */
  static async _loadTemplateFromModel(modelo) {
    try {
      const templatePath = this._getTemplatePathFromModel(modelo);
      if (!templatePath) {
        console.warn(`❌ Nenhum template encontrado para o modelo: ${modelo}`);
        return null;
      }

      console.log(`🔄 Tentando carregar template: ${templatePath}`);

      // Se estiver rodando via HTTP/HTTPS, podemos tentar fetch como fallback
      if (location.protocol === 'http:' || location.protocol === 'https:') {
        const response = await fetch(templatePath);
        if (!response.ok) {
          console.warn(`⚠️ Template não encontrado: ${templatePath} (Status: ${response.status})`);
          return null;
        }
        const blob = await response.blob();
        const fileName = templatePath.split('/').pop();
        const file = new File([blob], fileName, {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
        console.log(`✅ Template carregado automaticamente: ${fileName}`);
        return file;
      }

      // Se estiver em file://, orienta a usar o upload manual
      console.warn('⚠️ Ambiente file:// detectado. Use o campo "Template de Contrato" para selecionar o arquivo .docx manualmente.');
      return null;
    } catch (error) {
      console.error(`❌ Erro ao carregar template para ${modelo}:`, error);
      return null;
    }
  }

  /**
   * Preenche template DOCX com dados do formulário
   * @param {File} templateFile - Arquivo de template (opcional)
   */
  static async preencherTemplateDOCX(templateFile = null) {
    try {
      // 1) Caminho principal OFFLINE: usar o que o usuário escolheu em #templateUpload
      if (!templateFile) {
        const input = document.getElementById('templateUpload');
        if (input && input.files && input.files.length > 0) {
          templateFile = input.files[0];
        }
      }

      // 2) Fallback opcional: tentar carregar o template fixo via fetch (quando em http/https)
      if (!templateFile) {
        templateFile = await this._loadTemplateFromModel('CONTRATO_DE_PRESTACAO_DE_SERVICO');
      }

      // 3) Se ainda não tiver template, aborta com mensagem amigável
      if (!templateFile) {
        alert('Selecione um arquivo de template (.docx) antes de gerar o contrato.');
        return;
      }

      console.log('🔄 Processando template:', templateFile.name);

      // Carrega dados do formulário
      const dados = this.collectData();

      // Verifica se as bibliotecas estão disponíveis (offline/local)
      const hasPizZip = !!window.PizZip;
      const DocxCtor = window.Docxtemplater || window.docxtemplater;

      if (!hasPizZip || !DocxCtor) {
        throw new Error('Bibliotecas PizZip ou Docxtemplater não estão carregadas. Verifique as <script> locais no index.html.');
      }

      // Lê o arquivo template
      const arrayBuffer = await templateFile.arrayBuffer();

      // Usa Docxtemplater para preencher o template preservando formatação
      await this._preencherComDocxtemplater(arrayBuffer, dados, templateFile.name);

    } catch (error) {
      console.error('❌ Erro ao preencher template:', error);
      alert(`Erro ao processar template: ${error.message}\n\nVerifique se o arquivo está correto.`);
    }
  }

  // ===== [1] ALIASES PADRÃO (versão enxuta, focada no DOCX atual) =====
  // Versão estática da classe ContractExports
  static _expandDataAliases(d) {
    if (!d || typeof d !== 'object') return {};

    const out = { ...(d || {}) };

    if (d._meta) {
      out.MODELO       = d._meta.modelo || '';
      out.DATA_GERACAO = new Date().toLocaleString('pt-BR');
      out.VERSAO       = d._meta.versao || '3.0-LMS-ONLY';
    }

    // o DOCX atual já usa cod_aluno, lms_* etc.
    return out;
  }

  // ===== [2] DIAGNÓSTICO DE TAGS FALTANTES =====
  static _logMissingTags(doc, data) {
    try {
      let tags = [];
      if (typeof doc.getFullTags === 'function') {
        const full = doc.getFullTags();
        tags = full?.tags || full?.usedTags || [];
      } else if (typeof doc.getTags === 'function') {
        tags = doc.getTags(); // versões mais antigas
      }
      if (!tags || !tags.length) return;

      const faltantes = tags.filter(t => !Object.prototype.hasOwnProperty.call(data, t));
      if (faltantes.length) {
        console.group('🔎 Placeholders do template sem valor');
        console.table(faltantes.map(tag => ({ tag })));
        console.info('Dica: ver se existem placeholders no DOCX que não estão sendo preenchidos por collectData().');
        console.groupEnd();
      } else {
        console.log('✅ Todas as tags do template têm valor.');
      }
    } catch {
      // silencioso
    }
  }

  // ===== [3] GERAÇÃO DO DOCX COM PROTEÇÃO E DIAGNÓSTICO =====
  static async _preencherComDocxtemplater(arrayBuffer, dados, nomeArquivo) {
    try {
      console.log('🔄 Iniciando preenchimento com Docxtemplater...');

      if (!window.PizZip) {
        throw new Error('Biblioteca PizZip não está carregada.');
      }

      const DocxCtor = window.Docxtemplater || window.docxtemplater;
      if (!DocxCtor) {
        throw new Error('Biblioteca Docxtemplater não está carregada.');
      }

      // --- [FIX] Junta placeholders quebrados entre <w:t> ... </w:t> ---
      function fixBrokenTagsInDocx(zip, delim = ['[', ']']) {
        const file = 'word/document.xml';
        let xml = zip.file(file).asText();

        function normalizeForDelims(text, start, end) {
          const esc = s => s.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
          const s = esc(start), e = esc(end);

          const between = '(?:\\s|<[^>]+>)*';
          const openPattern  = new RegExp(`${s}${between}${s}`, 'g'); // [ ... [
          const closePattern = new RegExp(`${e}${between}${e}`, 'g'); // ] ... ]

          text = text.replace(openPattern, start + start);
          text = text.replace(closePattern, end + end);

          const openFrag  = new RegExp(`${s}${between}`, 'g');
          const closeFrag = new RegExp(`${between}${e}`, 'g');
          text = text.replace(openFrag, start);
          text = text.replace(closeFrag, end);

          return text;
        }

        xml = normalizeForDelims(xml, delim[0], delim[1]);
        xml = normalizeForDelims(xml, '{', '}');

        zip.file(file, xml);
        return zip;
      }

      // 1) Cria instância do PizZip com o template
      const zip = new window.PizZip(arrayBuffer);

      // ✅ repara placeholders quebrados de acordo com os delimitadores configurados
      fixBrokenTagsInDocx(zip, ['[', ']']);

      // 2) Instancia Docxtemplater com nullGetter (evita quebra em undefined)
      const doc = new DocxCtor(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: '[', end: ']' },
        nullGetter: () => '' // se faltar algum dado, deixa vazio
      });

      // 3) Data + aliases
      const data = this._expandDataAliases(dados);
      doc.setData(data);

      // 3.1) Diagnóstico de tags antes do render
      this._logMissingTags(doc, data);

      console.log('🔄 Renderizando template...');

      // 4) Render com captura de erros múltiplos
      try {
        doc.render();
      } catch (e) {
        console.error('❌ Erro no Docxtemplater:', e.name || e);
        const errs = (e.properties?.errors || []).map(er => ({
          tag: er.properties?.id,
          explanation: er.properties?.explanation,
        }));
        if (errs.length) {
          console.group('Detalhes dos erros');
          console.table(errs);
          console.groupEnd();
          alert('Falha ao preencher template: Multi error\n\nAbra o Console (F12) e veja a tabela de "tags" sem valor.\nAjuste os placeholders no DOCX ou o collectData().');
        } else {
          alert('Falha ao preencher template. Detalhes no Console.');
        }
        return;
      }

      console.log('✅ Template renderizado com sucesso');

      // 5) Gera o arquivo final

      // Obtém nome do template real, se possível
      let templateFileName = '';
      const templateInput = document.getElementById('templateUpload');
      if (templateInput && templateInput.files && templateInput.files[0]) {
        templateFileName = templateInput.files[0].name.replace(/\.docx$/i, '');
      } else {
        templateFileName = nomeArquivo.replace(/\.docx$/i, '');
      }

      // Renderiza e gera o blob
      const blob = doc.getZip().generate({ type: 'blob' });

      // 🔔 Evento: arquivo efetivamente gerado
      // Obtém o nome do aluno para usar no nome do arquivo
      let nomeAluno = '';
      const nomeAlunoInput = document.getElementById('nomeAluno');
      if (nomeAlunoInput && nomeAlunoInput.value) {
        nomeAluno = nomeAlunoInput.value.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      }
      const filename = (nomeAluno ? nomeAluno : (templateFileName || 'Contrato')) + '_preenchido.docx';
      window.dispatchEvent(new CustomEvent('docx:generated', {
        detail: { filename, size: blob.size }
      }));

      // Baixa e registra o download
      downloadDocx(blob, filename);
      console.log('✅ Download iniciado:', filename);

      // Mostra resumo
      this._mostrarResumoPreenchimento(data, filename);

    } catch (error) {
      console.error('❌ Erro geral no processamento:', error);
      throw new Error(`Falha ao preencher template: ${error.message}`);
    }
  }

  /**
   * Mostra resumo do preenchimento
   */
  static _mostrarResumoPreenchimento(templateData, nomeArquivo) {
    // Notificação removida conforme solicitado
    // (Função mantida para compatibilidade, mas sem alert)
  }
}

// ==========================================================================
// EXPORTAÇÕES
// ==========================================================================

// Exportar para escopo global
if (typeof module === 'undefined') {
  window.ContractExports = ContractExports;

  // Aliases para manter compatibilidade (caso algo ainda chame window.coletar)
  window.coletar = ContractExports.collectData.bind(ContractExports);
}

console.log('✅ Exports carregado com sucesso');
// Fim de src/export/exports.js