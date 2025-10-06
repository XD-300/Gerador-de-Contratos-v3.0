/* ==========================================================================
   GERADOR DE CONTRATOS - EXPORTAÇÕES
   Funcionalidades para exportar dados em diferentes formatos
   ========================================================================== */

/**
 * Classe responsável pelas exportações de contratos
 */
class ContractExports {
  
  /**
   * Coleta todos os dados do formulário com normalização e ordenação
   * @returns {Object} Dados estruturados do contrato
   */
  static collectData() {
    // Dados brutos do formulário
    const dadosBrutos = {
      // Dados básicos
      "CONTRATO": get('#contrato'),
      "DATA": get('#data'),
      
      // Responsável financeiro
      "NOME COMPLETO": get('#nomeResp'),
      "NASC RESP": get('#nascResp'),
      "CPF": get('#cpfResp'),
      "RG RESPONSAVEL": get('#rgResp'),
      "TELEFONE": get('#telResp'),
      
      // Endereço
      "ENDEREÇO COMPLETO": get('#endereco'),
      "N CS": get('#numero'),
      "BAIRRO": get('#bairro'),
      "CEP": get('#cep'),
      "CID/EST": get('#cidadeUf'),
      
      // Dados do aluno
      "NOME DO ALUNO": get('#nomeAluno'),
      "NASC ALUNO": get('#nascAluno'),
      "CPF DO ALUNO": get('#cpfAluno'),
      "RG ALUNO": get('#rgAluno'),
      "SEXO": get('#sexoAluno'),
      "RA": get('#raAluno'),
      
      // Curso
      "PROFISSIONALIZANTE": get('#curso'),
      "CARGA HORÁRIA": get('#carga'),
      
      // Valores financeiros
      "VALOR TOTAL": get('#total'),
      "VALOR À VISTA": get('#avista'),
      "DESCONTO": get('#desconto'),
      "PARCELA": get('#parcela'),
      "NÚMERO DE PARCELAS": get('#nParcelas'),
      "VALOR PARCELA CARTÃO": get('#parcCartao'),
      "VALOR ENTRADA": get('#entrada'),
      "VALOR PARCELA BOLETO": get('#parcBoleto'),
      "DIA VENCIMENTO": get('#diaVenc')
    };
    
    // Aplica normalização por aliases
    const dadosNormalizados = mesclarPorAlias(dadosBrutos);
    
    // Ordena campos conforme padrão
    const dadosOrdenados = ordenarCampos(dadosNormalizados);
    
    // Adiciona metadados
    dadosOrdenados._meta = {
      modelo: get('#modelo'),
      forma: get('#forma'),
      geradoEm: new Date().toISOString(),
      versao: '2.1-Python-Compatible',
      placeholders: PLACEHOLDERS_CANONICOS
    };
    
    return dadosOrdenados;
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
      a.download = `contrato_${dados['CONTRATO'] || 'dados'}.json`;
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
   * @param {string} modelo - Nome do modelo selecionado
   * @returns {string} - Caminho para o arquivo de template
   */
  static _getTemplatePathFromModel(modelo) {
    const templateMap = {
      'Contrato_EJA': 'templates/Contrato_EJA.docx',
      'Contrato_OM': 'templates/Contrato_OM.docx',
      'CONTRATO_OM_DK': 'templates/CONTRATO_OM_DK.docx',
      'Contrato_TEC': 'templates/Contrato_TEC.docx'
    };
    
    return templateMap[modelo] || null;
  }

  /**
   * Carrega template automaticamente baseado no modelo selecionado
   * @param {string} modelo - Nome do modelo selecionado
   * @returns {Promise<File|null>} - Arquivo de template ou null se não encontrado
   */
  static async _loadTemplateFromModel(modelo) {
    try {
      const templatePath = this._getTemplatePathFromModel(modelo);
      if (!templatePath) {
        console.warn(`❌ Nenhum template encontrado para o modelo: ${modelo}`);
        return null;
      }

      console.log(`🔄 Tentando carregar template: ${templatePath}`);

      // Tenta carregar o arquivo da pasta templates
      const response = await fetch(templatePath);
      if (!response.ok) {
        console.warn(`⚠️ Template não encontrado: ${templatePath} (Status: ${response.status})`);
        
        // Se é erro 404, o arquivo não existe
        if (response.status === 404) {
          throw new Error(`Arquivo de template não encontrado: ${templatePath}\n\nVerifique se o arquivo existe na pasta templates/`);
        }
        
        return null;
      }

      const blob = await response.blob();
      const fileName = templatePath.split('/').pop();
      
      // Converte blob para File object
      const file = new File([blob], fileName, {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });

      console.log(`✅ Template carregado automaticamente: ${fileName}`);
      return file;
    } catch (error) {
      console.error(`❌ Erro ao carregar template para ${modelo}:`, error);
      
      // Se é um erro de CORS ou protocolo file://, mostra mensagem específica
      if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        throw new Error(`❌ Erro de acesso ao arquivo!\n\n` +
                       `SOLUÇÃO:\n` +
                       `1. Sirva o projeto via servidor web (não abra index.html diretamente)\n` +
                       `2. Ou use o upload manual de template\n\n` +
                       `Erro técnico: ${error.message}`);
      }
      
      throw error;
    }
  }

  /**
   * Mostra instruções para upload manual quando o carregamento automático falha
   * @param {string} modelo - Nome do modelo selecionado
   */
  static _showManualUploadInstructions(modelo) {
    const expectedPath = this._getTemplatePathFromModel(modelo);
    const fileName = expectedPath ? expectedPath.split('/').pop() : 'template.docx';
    
    alert(`📋 INSTRUÇÃO PARA UPLOAD MANUAL\n\n` +
          `Para o modelo "${modelo}", você precisa:\n\n` +
          `1. Localizar seu arquivo: ${fileName}\n` +
          `2. Usar o "Sistema de Templates DOCX" no topo da página\n` +
          `3. Fazer upload do arquivo\n` +
          `4. Clicar novamente em "Gerar DOCX"\n\n` +
          `✅ O sistema lembrará do template carregado!`);
  }

  /**
   * Preenche template DOCX com dados do formulário
   */
  static async preencherTemplateDOCX(templateFile = null) {
    try {
      console.log('🎯 Iniciando geração de DOCX...');
      
      // Se não foi fornecido um template, tenta carregar automaticamente
      if (!templateFile) {
        const modeloSelecionado = get('#modelo');
        console.log(`📋 Modelo selecionado: ${modeloSelecionado}`);
        
        if (modeloSelecionado) {
          console.log(`🔄 Carregando template automaticamente para: ${modeloSelecionado}`);
          try {
            templateFile = await this._loadTemplateFromModel(modeloSelecionado);
          } catch (loadError) {
            // Se falhar o carregamento automático, oferece alternativa
            console.error('❌ Falha no carregamento automático:', loadError);
            
            const useManual = confirm(`⚠️ ${loadError.message}\n\n` +
                                    `Deseja fazer upload manual do template?`);
            
            if (useManual) {
              this._showManualUploadInstructions(modeloSelecionado);
              return;
            } else {
              return; // Usuário cancelou
            }
          }
        }
        
        if (!templateFile) {
          alert('❌ Nenhum template encontrado!\n\n' +
                'OPÇÕES:\n' +
                '1. Coloque o arquivo .docx na pasta "templates/" com o nome correto\n' +
                '2. Ou use o sistema de upload manual no topo da página\n\n' +
                `Nome esperado: ${this._getTemplatePathFromModel(get('#modelo'))}`);
          return;
        }
      }
      
      console.log('🔄 Processando template:', templateFile.name);
      
      // Carrega dados do formulário
      const dados = this.collectData();
      
      // Verifica se as bibliotecas estão disponíveis
      if (!window.PizZip || !window.Docxtemplater) {
        throw new Error('Bibliotecas PizZip ou Docxtemplater não estão carregadas');
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
  
  /**
   * Preenche template DOCX usando Docxtemplater (preserva formatação original)
   */
  static _prepararDadosTemplate(dados) {
    // Pega valores do formulário
    const formData = window.get || {};
    
    // Mapeia os dados para os placeholders do template
    const templateData = {
      // Campos básicos
      CONTRATO: formData.contrato || '',
      CPF: formData.cpf || '',
      NOME: formData.nome || '',
      ENDERECO: formData.endereco || '',
      TELEFONE: formData.telefone || '',
      EMAIL: formData.email || '',
      VALOR_TOTAL: formData.valorTotal || '',
      PARCELAS: formData.parcelas || '',
      
      // Data atual
      DATA_ATUAL: new Date().toLocaleDateString('pt-BR'),
      
      // Controle de blocos condicionais
      BLOCO_AVISTA: formData.formaPagamento === 'avista',
      BLOCO_CARTAO: formData.formaPagamento === 'cartao', 
      BLOCO_BOLETO: formData.formaPagamento === 'boleto'
    };
    
    // Remove campos vazios
    Object.keys(templateData).forEach(key => {
      if (templateData[key] === '' || templateData[key] === null || templateData[key] === undefined) {
        delete templateData[key];
      }
    });
    
    return templateData;
  }

  // ===== [1] ALIASES PADRÃO (complete/ajuste só se precisar) =====
  static _expandDataAliases(d) {
    const out = { ...d };

    // Metadados úteis
    out["MODELO"] = d?._meta?.modelo || "";
    out["FORMA_PAGAMENTO"] = d?._meta?.forma || "";
    out["DATA_GERACAO"] = new Date().toLocaleString("pt-BR");
    out["VERSAO"] = "2.1-Python-Compatible";

    // Variações comuns (acentos, nomes próximos)
    const a = {
      "NÚMERO DO CPF": d["CPF"],
      "NUMERO DO CPF": d["CPF"],
      "RG RESPONSÁVEL": d["RG RESPONSAVEL"],
      "RG": d["RG RESPONSAVEL"],
      "CIDADE/UF": d["CID/EST"],
      "CIDADE UF": d["CID/EST"],
      "NÚMERO": d["N CS"], "NUMERO": d["N CS"], "Nº": d["N CS"],
      "VALOR TOTAL DO CURSO": d["VALOR TOTAL"],
      "VALOR A VISTA": d["VALOR À VISTA"],
      "NUMERO DE PARCELAS": d["NÚMERO DE PARCELAS"],
      "PARCELA CARTAO": d["VALOR PARCELA CARTÃO"],
      "PARCELA BOLETO": d["VALOR PARCELA BOLETO"],
      "DATA INICIAL": d["DATA"], // se existir no template
      "PREVISAO TERMINO": d["PREVISAO TERMINO"] || ""
    };
    for (const [k,v] of Object.entries(a)) out[k] = v ?? "";

    // Blocos por forma (se o template usar)
    const forma = out["FORMA_PAGAMENTO"];
    out["BLOCO_AVISTA"] = forma === "À vista" ? `Valor à vista: ${d["VALOR À VISTA"]||""}` : "";
    out["BLOCO_CARTAO"] = forma === "Cartão" ? `${d["NÚMERO DE PARCELAS"]||""} × ${d["VALOR PARCELA CARTÃO"]||""}` : "";
    out["BLOCO_BOLETO"] = forma === "Boleto"
      ? `Entrada: ${d["VALOR ENTRADA"]||""} | ${d["NÚMERO DE PARCELAS"]||""} × ${d["VALOR PARCELA BOLETO"]||""} (venc. dia ${d["DIA VENCIMENTO"]||""})`
      : "";

    return out;
  }

  // ===== [2] DIAGNÓSTICO DE TAGS FALTANTES =====
  static _logMissingTags(doc, data) {
    try {
      const full = doc.getFullTags?.(); // { tags: [...], usedTags: [...] } em versões recentes
      const tags = full?.tags || full?.usedTags || [];
      const dataKeys = new Set(Object.keys(data));
      const faltantes = tags.filter(t => !dataKeys.has(t));
      if (faltantes.length) {
        console.group("🔎 Placeholders do template sem valor");
        console.table(faltantes.map(tag => ({ tag })));
        console.info("Dica: renomeie no .docx para algum desses nomes ou adicione um alias no _expandDataAliases().");
        console.groupEnd();
      } else {
        console.log("✅ Todas as tags do template têm valor.");
      }
    } catch {}
  }

  // ===== [3] GERAÇÃO DO DOCX COM PROTEÇÃO E DIAGNÓSTICO =====
  static async _preencherComDocxtemplater(arrayBuffer, dados, nomeArquivo) {
    try {
      console.log('🔄 Iniciando preenchimento com Docxtemplater...');
      
      // Aguarda bibliotecas estarem prontas
      if (!window.templateLibrariesReady) {
        console.log('⏳ Aguardando bibliotecas carregarem...');
        
        // Aguarda até 10 segundos pelo carregamento das bibliotecas
        const maxWait = 10000; // 10 segundos
        const startTime = Date.now();
        
        while (!window.templateLibrariesReady && (Date.now() - startTime) < maxWait) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      // Verifica se as bibliotecas estão carregadas
      if (!window.PizZip) {
        throw new Error('Biblioteca PizZip não está carregada. Verifique a conexão com a internet.');
      }
      
      if (!window.Docxtemplater) {
        throw new Error('Biblioteca Docxtemplater não está carregada. Verifique a conexão com a internet.');
      }
      
      console.log('✅ Bibliotecas PizZip e Docxtemplater verificadas e prontas');
      

      // --- [FIX] Junta placeholders quebrados entre <w:t> ... </w:t> ---
      function fixBrokenTagsInDocx(zip) {
        const file = 'word/document.xml';
        let xml = zip.file(file).asText();

        // junta {{ que ficaram separados por runs/tags XML
        xml = xml.replace(/\{(?:\s|<[^>]+>)*\{/g, '{{');   // { ... {  -> {{
        xml = xml.replace(/\}(?:\s|<[^>]+>)*\}/g, '}}');   // } ... }  -> }}

        // remove qualquer tag XML no MEIO do placeholder
        xml = xml.replace(/{{(?:\s|<[^>]+>)+/g, '{{');
        xml = xml.replace(/(?:\s|<[^>]+>)+}}/g, '}}');

        // grava de volta no zip
        zip.file(file, xml);
        return zip;
      }

      // 1) Cria instância do PizZip com o template
      const zip = new window.PizZip(arrayBuffer);

      // ✅ repara os placeholders quebrados ANTES de processar
      fixBrokenTagsInDocx(zip);

      // 2) Instancia Docxtemplater com nullGetter (evita quebra em undefined)
      const doc = new window.Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: '{{', end: '}}' },
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
        console.error("❌ Erro no Docxtemplater:", e.name || e);
        const errs = (e.properties?.errors || []).map(er => ({
          tag: er.properties?.id,
          explanation: er.properties?.explanation,
        }));
        if (errs.length) {
          console.group("Detalhes dos erros");
          console.table(errs);
          console.groupEnd();
          alert("Falha ao preencher template: Multi error\n\nAbra o Console (F12) e veja a tabela de 'tags' sem valor.\nRenomeie as tags no DOCX ou inclua aliases em _expandDataAliases().");
        } else {
          alert("Falha ao preencher template. Detalhes no Console.");
        }
        return;
      }
      
      console.log('✅ Template renderizado com sucesso');
      
      // 5) Gera o arquivo final
      const buffer = doc.getZip().generate({ type: 'blob' });
      
      // Faz download do arquivo
      const url = URL.createObjectURL(buffer);
      const nomePreenchido = nomeArquivo.replace(/\.docx$/i, '_preenchido.docx');
      
      const a = document.createElement('a');
      a.href = url;
      a.download = nomePreenchido;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Limpa URL após delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
      
      console.log('✅ Download iniciado:', nomePreenchido);
      
      // Mostra resumo
      this._mostrarResumoPreenchimento(data, nomePreenchido);
      
    } catch (error) {
      console.error('❌ Erro geral no processamento:', error);
      throw new Error(`Falha ao preencher template: ${error.message}`);
    }
  }
  
  /**
   * Mostra resumo do preenchimento
   */
  static _mostrarResumoPreenchimento(templateData, nomeArquivo) {
    const campos = Object.keys(templateData).length;
    
    alert(`✅ Template preenchido com sucesso!

📁 Arquivo: ${nomeArquivo}
📋 Campos preenchidos: ${campos}
💾 Download iniciado automaticamente

O arquivo mantém a formatação original do template Word.`);
  }
  
  /**
   * Gera mapeamento de placeholders baseado no sistema Python
   */
  static _gerarMapeamentoPlaceholders(dados) {
    const mapeamento = {};
    
    // Usa os placeholders canônicos do sistema Python
    for (const [campo, placeholder] of Object.entries(PLACEHOLDERS_CANONICOS)) {
      const valor = dados[campo] || '';
      mapeamento[placeholder] = valor;
    }
    
    // Adiciona campos extras que podem existir
    const camposExtras = {
      '{{MODELO}}': dados._meta?.modelo || '',
      '{{FORMA_PAGAMENTO}}': dados._meta?.forma || '',
      '{{DATA_GERACAO}}': new Date().toLocaleDateString('pt-BR'),
      '{{VERSAO}}': dados._meta?.versao || '2.1'
    };
    
    Object.assign(mapeamento, camposExtras);
    
    return mapeamento;
  }
  
  /**
   * Mostra instruções de como usar template
   */
  static _mostrarInstrucaoTemplate(placeholders) {
    const instrucoes = `
📋 COMO USAR TEMPLATE DOCX:

1. Crie seu template Word com os placeholders:
${Object.keys(placeholders).map(p => `   • ${p}`).join('\n')}

2. Salve como .docx

3. Use Word/LibreOffice para:
   - Localizar e substituir cada placeholder
   - Ou use ferramenta de mala direta

DADOS PARA SUBSTITUIÇÃO:
${Object.entries(placeholders)
  .filter(([k, v]) => v.trim() !== '')
  .map(([k, v]) => `${k} → "${v}"`)
  .join('\n')}
    `;
    
    console.log(instrucoes);
    
    // Cria arquivo texto com instruções
    const blob = new Blob([instrucoes], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'instrucoes_template.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Gera e baixa documento DOCX
   */
  static async exportDOCX() {
    // Redireciona para o sistema de templates
    alert(`⚠️ FUNÇÃO DESABILITADA!

Agora você deve usar o Sistema de Templates DOCX:

1. 📋 Carregue um template .docx personalizado
2. 📝 Use "Preencher Template" ou "Baixar Template Preenchido"
3. ✅ Receba seu documento com dados preenchidos

Os templates oferecem muito mais flexibilidade e personalização!`);
    
    console.log('⚠️ exportDOCX() desabilitada - use sistema de templates');
    return;
    
    try {
      const docxLib = window.docx;
      
      if (!docxLib) {
        throw new Error('Biblioteca docx não carregada');
      }
      
      const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } = docxLib;
      const d = this.collectData();
      
      // Criar documento
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Título principal
            new Paragraph({
              children: [
                new TextRun({
                  text: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS EDUCACIONAIS",
                  bold: true,
                  size: 32,
                }),
              ],
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
            }),
            
            // Espaço
            new Paragraph({ text: "" }),
            
            // Informações básicas
            new Paragraph({
              children: [
                new TextRun({ text: "Contrato Nº: ", bold: true }),
                new TextRun({ text: d['CONTRATO'] || 'N/A' }),
                new TextRun({ text: "    Data: ", bold: true }),
                new TextRun({ text: d['DATA'] || 'N/A' }),
              ],
            }),
            
            // Seções do documento
            ...this._createDOCXSections(d)
          ],
        }],
      });
      
      // Gerar e baixar
      const buffer = await docxLib.Packer.toBlob(doc);
      const url = URL.createObjectURL(buffer);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Contrato_${d['CONTRATO'] || 'documento'}.docx`;
      a.click();
      
      URL.revokeObjectURL(url);
      
      console.log('✅ DOCX gerado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao gerar DOCX:', error);
      alert('Erro ao gerar documento Word. Verifique se todos os campos estão preenchidos.');
    }
  }
  

  
  /**
   * Cria seções do documento DOCX
   * @param {Object} d - Dados coletados
   * @returns {Array} Array de parágrafos DOCX
   * @private
   */
  static _createDOCXSections(d) {
    const { Paragraph, TextRun, HeadingLevel } = window.docx;
    const sections = [];
    
    // Espaçamento
    sections.push(new Paragraph({ text: "" }));
    
    // Responsável Financeiro
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: "DADOS DO RESPONSÁVEL FINANCEIRO", bold: true, size: 24 })],
        heading: HeadingLevel.HEADING_1,
      })
    );
    
    if (d['NOME COMPLETO']) {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: "Nome: ", bold: true }),
          new TextRun({ text: d['NOME COMPLETO'] }),
        ],
      }));
    }
    
    if (d['CPF'] || d['RG RESPONSAVEL']) {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: "CPF: ", bold: true }),
          new TextRun({ text: d['CPF'] || 'N/A' }),
          new TextRun({ text: "    RG: ", bold: true }),
          new TextRun({ text: d['RG RESPONSAVEL'] || 'N/A' }),
        ],
      }));
    }
    
    // Mais seções...
    // (Implementação completa seria muito longa, mantendo estrutura base)
    
    return sections;
  }


  
  /**
   * Preenche formulário com dados de exemplo
   */
  static fillExample() {
    try {
      // Configurações básicas
      set('#modelo', 'Contrato_EJA');
      set('#forma', 'Cartão');
      
      // Atualizar UI da forma
      if (window.updateFormaUI) {
        window.updateFormaUI();
      }
      
      // Dados básicos
      set('#data', maskDate('01022026'));
      set('#contrato', '001/2026');
      
      // Responsável
      set('#nomeResp', titleCase('maria de souza almeida'));
      set('#nascResp', maskDate('05091986'));
      set('#cpfResp', maskCPF('39015451706'));
      set('#rgResp', '1234567');
      set('#telResp', maskPhone('94988887777'));
      
      // Endereço
      set('#endereco', titleCase('rua bernardo sayao'));
      set('#numero', '189');
      set('#bairro', titleCase('centro'));
      set('#cep', maskCEP('68140000'));
      set('#cidadeUf', titleCase('uruara/pa'));
      
      // Aluno
      set('#nomeAluno', titleCase('joao vitor almeida'));
      set('#nascAluno', maskDate('12102012'));
      set('#cpfAluno', maskCPF('12312312312'));
      set('#rgAluno', '7778889');
      set('#raAluno', 'RA2024001');
      
      // Curso
      set('#curso', 'Técnico em Enfermagem');
      set('#carga', '1200h');
      
      // Financeiro
      set('#nParcelas', '12');
      set('#parcCartao', fmtBRL(199.90));
      set('#total', '');
      
      // Recalcular
      if (window.ContractCalculations) {
        ContractCalculations.recalculate(false);
      }
      
      console.log('✅ Exemplo preenchido com sucesso');
    } catch (error) {
      console.error('❌ Erro ao preencher exemplo:', error);
      alert('Erro ao preencher dados de exemplo.');
    }
  }
}

// ==========================================================================
// EXPORTAÇÕES
// ==========================================================================

// Exportar para escopo global
if (typeof module === 'undefined') {
  window.ContractExports = ContractExports;
  
  // Aliases para manter compatibilidade
  window.coletar = ContractExports.collectData.bind(ContractExports);
}

console.log('✅ Exports carregado com sucesso');

// == APPEND-ONLY: exportDOCXComTemplate ==
if (typeof exportDOCXComTemplate === "undefined") {
  /**
   * Preenche um template .docx com {{PLACEHOLDERS}} e baixa o arquivo.
   * - templateUrl: caminho relativo (ex.: "templates/CONTRATO_OM_DK.docx") ou URL
   * - dados: objeto com as chaves exatamente como no template (com acentos/espaços)
   */
  async function exportDOCXComTemplate(dados, templateUrl, outName = "Contrato_preenchido.docx") {
    // 1) Garante Docxtemplater + PizZip (sem mudar o que já existe)
    let Docxtemplater = (typeof window !== "undefined" && window.docxtemplater) ? window.docxtemplater : null;
    let PizZip = (typeof window !== "undefined" && window.PizZip) ? window.PizZip : null;
    if (!Docxtemplater || !PizZip) {
      // fallback: importa do CDN (requer http/https; não funciona em file://)
      ({ default: Docxtemplater } = await import("https://cdn.jsdelivr.net/npm/docxtemplater@3.44.0/build/docxtemplater.js"));
      ({ default: PizZip } = await import("https://cdn.jsdelivr.net/npm/pizzip@3.1.7/dist/pizzip.min.js"));
    }

    // 2) Função para expandir aliases
    function expandDataAliases(d) {
      const out = { ...d };

      // extras
      out["MODELO"] = d?._meta?.modelo || "";
      out["FORMA_PAGAMENTO"] = d?._meta?.forma || "";
      out["DATA_GERACAO"] = new Date().toLocaleString("pt-BR");
      out["VERSAO"] = "2.1-Python-Compatible";

      // aliases frequentes
      const a = {
        "NÚMERO DO CPF": d["CPF"],
        "NUMERO DO CPF": d["CPF"],

        "RG RESPONSÁVEL": d["RG RESPONSAVEL"],
        "RG": d["RG RESPONSAVEL"],

        "CIDADE/UF": d["CID/EST"],
        "CIDADE UF": d["CID/EST"],

        "NÚMERO": d["N CS"],
        "NUMERO": d["N CS"],
        "Nº": d["N CS"],

        "VALOR TOTAL DO CURSO": d["VALOR TOTAL"],
        "VALOR A VISTA": d["VALOR À VISTA"],

        "NUMERO DE PARCELAS": d["NÚMERO DE PARCELAS"],
        "PARCELA CARTAO": d["VALOR PARCELA CARTÃO"],
        "PARCELA BOLETO": d["VALOR PARCELA BOLETO"],

        // se o template tiver estes
        "DATA INICIAL": d["DATA"],
        "PREVISAO TERMINO": d["PREVISAO TERMINO"] || ""
      };

      for (const [k, v] of Object.entries(a)) out[k] = v ?? "";

      // blocos por forma (texto pronto)
      const forma = out["FORMA_PAGAMENTO"];
      out["BLOCO_AVISTA"] = forma === "À vista" ? `Valor à vista: ${d["VALOR À VISTA"]||""}` : "";
      out["BLOCO_CARTAO"] = forma === "Cartão" ? `${d["NÚMERO DE PARCELAS"]||""} × ${d["VALOR PARCELA CARTÃO"]||""}` : "";
      out["BLOCO_BOLETO"] = forma === "Boleto" ? `Entrada: ${d["VALOR ENTRADA"]||""} | ${d["NÚMERO DE PARCELAS"]||""} × ${d["VALOR PARCELA BOLETO"]||""} (venc. dia ${d["DIA VENCIMENTO"]||""})` : "";

      return out;
    }

    // 3) Carrega o template e renderiza
    const resp = await fetch(templateUrl);              // precisa rodar via http/https
    const ab = await resp.arrayBuffer();
    
    // APPEND-ONLY: garantir alias e presença
    if (window.docxtemplater && !window.Docxtemplater) {
      window.Docxtemplater = window.docxtemplater;
    }
    if (!(window.PizZip && (window.Docxtemplater || window.docxtemplater))) {
      throw new Error('Bibliotecas PizZip ou Docxtemplater não estão carregadas');
    }
    
    const zip = new PizZip(ab);
    const doc = new window.Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      nullGetter() { return ""; }
    });
    
    const data = expandDataAliases(dados);
    doc.setData(data);
    
    try { 
      doc.render(); 
    } catch (e) {
      console.error("Docxtemplater error:", e);
      if (e.properties?.errors) {
        console.table(e.properties.errors.map(er => ({
          tag: er.properties?.id,
          explanation: er.properties?.explanation
        })));
      }
      alert("Falha ao preencher template: Multi error\nVeja o console para as tags faltantes.");
      return;
    }

    // 4) Baixa o arquivo
    const blob = doc.getZip().generate({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = outName;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // Exportar para escopo global
  if (typeof window !== "undefined") {
    window.exportDOCXComTemplate = exportDOCXComTemplate;
  }
}