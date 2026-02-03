/* ==========================================================================
   GERADOR DE CONTRATOS - APLICAÇÃO PRINCIPAL
   Inicialização e coordenação dos módulos
   ========================================================================== */


// APPEND-ONLY: garante PizZip/Docxtemplater vindos dos ARQUIVOS LOCAIS (index.html)
// Não faz mais nenhum import via CDN
(function ensureTemplateLibsLocal() {
  const temPizZip        = !!window.PizZip;
  const temDocxtemplater = !!(window.Docxtemplater || window.docxtemplater);

  if (!temDocxtemplater && window.docxtemplater) {
    // normaliza nome caso a lib exponha "docxtemplater" em minúsculo
    window.Docxtemplater = window.docxtemplater;
  }

  if (temPizZip && (window.Docxtemplater || window.docxtemplater)) {
    window.templateLibrariesReady = true;
    console.log("✅ Docxtemplater/PizZip prontos (versão local)");
  } else {
    window.templateLibrariesReady = false;
    console.warn("❌ Bibliotecas de template PizZip/Docxtemplater NÃO foram carregadas.");
    console.warn("   Verifique as tags <script src=\"src/export/libs/pizzip.min.js\">");
    console.warn("   e <script src=\"src/export/libs/docxtemplater.js\"> no index.html");
  }
})();

// Shim de compatibilidade para o Docxtemplater global
(function () {
  if (window.docxtemplater && !window.Docxtemplater) {
    window.Docxtemplater = window.docxtemplater;
  }
  // Marca como pronto se PizZip + Docxtemplater existirem
  if (window.PizZip && (window.Docxtemplater || window.docxtemplater)) {
    window.templateLibrariesReady = true;
    window.dispatchEvent(new Event('templateLibrariesLoaded'));
  }
})();

// Fallback para normalizarEspacos se não estiver disponível no utils.js
window.normalizarEspacos = window.normalizarEspacos || (s => String(s||'').replace(/\s+/g,' ').trim());

/**
 * Classe principal da aplicação
 */
class ContractApp {
  
  // Variável estática para armazenar o template carregado via upload
  static templateFile = null;
  
  /**
   * Inicializa a aplicação
   */
  static init() {
    console.log('🚀 Inicializando Gerador de Contratos v2.0');
    
    // Aguarda DOM carregar
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this._setupApp());
    } else {
      this._setupApp();
    }
  }
  
  /**
   * Configura a aplicação após DOM carregado
   * @private
   */
  static _setupApp() {
    try {
      // Verificar se templates estão prontos
      if (this._checkDependencies()) {
        this._onTemplatesReady();
        this._initializeApp();
      } else {
        console.log('⏳ Aguardando PizZip/Docxtemplater do loader…');
        window.addEventListener('templateLibrariesLoaded', () => {
          this._onTemplatesReady();
          this._initializeApp();
        }, { once: true });
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar aplicação:', error);
      this._showError('Erro ao inicializar aplicação. Recarregue a página.');
    }
  }

  /**
   * Inicializa componentes da aplicação
   * @private
   */
  static _initializeApp() {
    try {
      // Configurar máscaras de input
      this._setupMasks();
      
      // Configurar formatação automática
      this._setupFormatting();
      
      // Configurar lógica de interface
      this._setupUI();
      
      // Configurar eventos de cálculo
      this._setupCalculations();
      
      // Configurar eventos de exportação
      this._setupExports();
      
      // Configurar atalhos de teclado
      this._setupKeyboardShortcuts();
      
      console.log('✅ Aplicação inicializada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao inicializar componentes:', error);
      this._showError('Erro ao inicializar componentes. Recarregue a página.');
    }
  }
  
  /**
   * Verifica se todas as dependências estão carregadas
   * @private
   * @returns {boolean} true se dependências principais estão OK
   */
  static _checkDependencies() {
    const ok = !!(window.PizZip && (window.Docxtemplater || window.docxtemplater));
    if (ok && !window.Docxtemplater && window.docxtemplater) {
      window.Docxtemplater = window.docxtemplater; // normaliza
    }
    return ok;
  }

  /**
   * Configura dependências principais após templates prontos
   * @private
   */
  static _onTemplatesReady() {
    // Verifica dependências principais (sem docx)
    const deps = [
      { name: 'ContractUtils',          obj: window.ContractUtils },
      { name: 'ContractCalculations',   obj: window.ContractCalculations },
      { name: 'ContractExports',        obj: window.ContractExports },
    ];

    const missing = [];
    deps.forEach(d => {
      if (!d.obj) {
        console.error(`❌ Dependência ${d.name} não encontrada`);
        missing.push(d.name);
      } else {
        console.log(`✅ ${d.name} carregado`);
      }
    });

    // Confirma que templates estão OK
    if (window.PizZip && (window.Docxtemplater || window.docxtemplater)) {
      console.log('✅ PizZip carregado');
      console.log('✅ Docxtemplater carregado');
    }

    // Avisar sobre dependências críticas faltando
    if (missing.length > 0) {
      alert(
        `⚠️ Bibliotecas não carregadas: ${missing.join(', ')}\n\n` +
        `Algumas funcionalidades podem não funcionar.`
      );
    }

    console.log('✅ Verificação de dependências concluída');
  }
  
  /**
   * Configura máscaras automáticas nos inputs
   * @private
   */
  static _setupMasks() {
    const masks = [
      ["#cpfResp", maskCPF], 
      ["#cpfAluno", maskCPF],
      ["#telResp", maskPhone], 
      ["#cep", maskCEP],
      ["#data", maskDate], 
      ["#nascResp", maskDate], 
      ["#nascAluno", maskDate],
    ];
    
    masks.forEach(([selector, maskFn]) => {
      const element = $(selector);
      if (!element) return;
      
      element.addEventListener("input", (e) => {
        e.target.value = maskFn(e.target.value);
      });
    });
    
    console.log('✅ Máscaras configuradas');
  }
  
  /**
   * Configura formatação automática de texto com sistema avançado
   * @private
   */
  static _setupFormatting() {
    // Title Case para nomes e endereços (com normalização de siglas)
    const titleCaseFields = [
      "#nomeResp", "#nomeAluno", 
      "#endereco", "#bairro", "#cidadeUf", "#curso"
    ];
    
    titleCaseFields.forEach(selector => {
      const element = $(selector);
      if (!element) return;
      
      element.addEventListener("blur", (e) => {
        const original = e.target.value;
        const normalizado = normalizarEspacos(original);
        const formatado = titleCase(normalizado);
        e.target.value = formatado;
      });
    });
    
    // Formatação monetária
    const moneyFields = [
      "#total", "#avista", "#desconto", "#parcela",
      "#parcCartao", "#entrada", "#parcBoleto"
    ];
    
    moneyFields.forEach(selector => {
      const element = $(selector);
      if (!element) return;
      
      element.addEventListener("blur", (e) => {
        const value = parseBRL(e.target.value);
        e.target.value = fmtBRL(value);
      });
    });
    
    // Configurar validação visual em tempo real
    this.applyLiveValidation();
    
    console.log('✅ Formatação automática avançada configurada');
  }
  
  /**
   * Configura lógica da interface
   * @private
   */
  static _setupUI() {
    // Controle de visibilidade por forma de pagamento
    const formaSelect = $("#forma");
    if (formaSelect) {
      formaSelect.addEventListener('change', () => {
        // ✅ Use a função do init.js em vez da função local removida
        if (window.updateFormaUI) {
          window.updateFormaUI();
        } else if (window.AutoCalcInit && window.AutoCalcInit.updateFieldVisibility) {
          // Fallback para a nova função
          const forma = get("#forma");
          window.AutoCalcInit.updateFieldVisibility(forma);
        }
        
        if (window.AutomaticCalculations) {
          AutomaticCalculations.forceRecalculate();
        }
      });
    }
    
    // Toggle do auto-cálculo
    const autoCheckbox = $("#auto");
    if (autoCheckbox) {
      autoCheckbox.addEventListener('change', (e) => {
        const status = $("#pill-status");
        if (status) {
          status.textContent = e.target.checked 
            ? "Ligado" 
            : "Desligado";
        }
      });
    }
    
    // Inicializar estado da UI usando init.js
    if (window.updateFormaUI) {
      window.updateFormaUI();
    }
    
    console.log('✅ Interface configurada');
  }
  
  /**
   * Debounce para otimizar eventos
   * @private
   */
  static _debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Configura eventos relacionados aos cálculos
   * @private
   */
  static _setupCalculations() {
    console.log('🔧 === CONFIGURANDO EVENTOS DE CÁLCULO ===');
    
    // Verificar se ContractCalculations existe
    if (typeof ContractCalculations === 'undefined') {
      console.error('❌ ContractCalculations não disponível! Eventos não configurados.');
      return;
    }
    console.log('✅ ContractCalculations disponível');
    
    const calcFields = [
      "#total", "#avista", "#parcela", "#parcCartao", 
      "#entrada", "#parcBoleto", "#nParcelas", "#desconto"
    ];
    
    // Debounce para evitar múltiplos cálculos rápidos
    const debouncedRecalc = this._debounce(() => {
      console.log('🔄 Executando cálculo debounced');
      if (window.AutomaticCalculations) {
        AutomaticCalculations.forceRecalculate();
      }
    }, 300);
    
    let eventosConfigurados = 0;
    
    calcFields.forEach(selector => {
      const element = $(selector);
      if (!element) {
        console.log('❌ Campo não encontrado:', selector);
        return;
      }
      
      console.log('✅ Configurando eventos otimizados para:', selector);
      
      // Event listeners otimizados com debounce 
      element.addEventListener('input', (e) => {
        console.log('📝 Input detectado em:', selector, '- Valor:', e.target.value);
        debouncedRecalc();
      });
      
      element.addEventListener('blur', (e) => {
        console.log('👁️ Blur detectado em:', selector, '- Valor:', e.target.value);
        // Blur executa imediatamente (sem debounce)
        if (window.AutomaticCalculations) {
          AutomaticCalculations.forceRecalculate();
        }
      });
      
      eventosConfigurados++;
    });
    
    console.log(`✅ ${eventosConfigurados} campos com eventos otimizados configurados`);
    
    // Botão de recálculo manual - NOVO MOTOR (init.js gerencia automaticamente)
    console.log('� Botão #btnCalcular será gerenciado pelo init.js do novo motor');
    console.log('ℹ️ Caso o botão não funcione, verifique se init.js está carregado');
    
    console.log('✅ Sistema de cálculos configurado completo');
    // ==== AutoCalc UX logs (append-only) ====
    CalcBus.addEventListener('valorAtualizado', (e) => logCalc(`🟦 ${e.detail.campo} = ${e.detail.novo}`));
    CalcBus.addEventListener('valorEditado',   (e) => logCalc(`✍️  ${e.detail.campo} (user): ${e.detail.valor}`));
    CalcBus.addEventListener('parcelamentoSugerido', (e) => logCalc(`💡 Parc.: ${e.detail.n}x de ${fmtBRL(e.detail.valor)}`));
    CalcBus.addEventListener('hist:undo', (e) => logCalc(`↩️ undo ${e.detail.sel}`));
    CalcBus.addEventListener('hist:redo', (e) => logCalc(`↪️ redo ${e.detail.sel}`));
    CalcBus.addEventListener('erroCalculo', (e) => logCalc(`⛔ ${e.detail.tipo}`));
  }
  
  /**
   * Configura eventos de exportação
   * @private
   */
  static _setupExports() {
    // Remove qualquer listener anterior para evitar duplicação
    const btnDocx = $("#btnDocx");
    if (btnDocx) {
      // Clona e substitui o botão para remover listeners antigos
      const newBtn = btnDocx.cloneNode(true);
      btnDocx.parentNode.replaceChild(newBtn, btnDocx);
    }

    // Botão DOCX - versão robusta
    const docxBtn = $("#btnDocx");
    if (docxBtn) {
      docxBtn.addEventListener('click', async (evt) => {
        if (window.__DOCX_CLICK_LOCK__) return;
        window.__DOCX_CLICK_LOCK__ = true;
        try {
          console.log('🔽 Botão DOCX clicado - PROCESSANDO...');
          if (!window.ContractExports?.preencherTemplateDOCX) {
            alert('Módulo de exportação ainda não disponível. Verifique se "exports.js" carregou sem erros.');
            return;
          }
          await ContractExports.preencherTemplateDOCX(ContractApp.templateFile);
          evt.stopImmediatePropagation();
        } catch (error) {
          console.error('❌ Erro no botão DOCX:', error);
          alert(`Erro ao processar template: ${error.message}`);
        } finally {
          setTimeout(()=>{ window.__DOCX_CLICK_LOCK__ = false; }, 0);
        }
      });
    }

    // Botão exemplo - robusto
    const exampleBtn = $("#btnExemplo");
    if (exampleBtn) {
      exampleBtn.addEventListener('click', () => {
        if (window.ContractExports?.fillExample) {
          ContractExports.fillExample();
        } else {
          alert('Módulo de exportação não disponível no momento.');
        }
      });
    }

    // Sistema de Templates
    this._setupTemplateSystem();
    
    // Sistema de monitoramento do modelo selecionado
    this._setupModeloMonitoring();
    
    console.log('✅ Sistema de exportação e templates configurado');
  }

  /**
   * Configura monitoramento do modelo selecionado para indicar template ativo
   * @private
   */
  static _setupModeloMonitoring() {
    const modeloSelect = $("#modelo");
    const templateStatus = $("#templateStatus");
    const templateName = $("#templateName");
    
    if (!modeloSelect || !templateStatus || !templateName) return;

    // Função para atualizar indicador de template
    const updateTemplateIndicator = async () => {
      const modelo = modeloSelect.value;
      
      // Acessa a função através do ContractExports
      if (!window.ContractExports || !ContractExports._getTemplatePathFromModel) {
        console.warn('⚠️ ContractExports não está disponível ainda');
        return;
      }
      
      const templatePath = ContractExports._getTemplatePathFromModel(modelo);
      
      if (templatePath) {
        try {
          // Verifica se o template existe fazendo uma requisição HEAD
          const response = await fetch(templatePath, { method: 'HEAD' });
          if (response.ok) {
            const fileName = templatePath.split('/').pop();
            templateName.textContent = fileName;
            templateStatus.style.display = 'block';
            templateStatus.style.color = '#22c55e'; // verde para sucesso
            console.log(`✅ Template disponível: ${fileName}`);
          } else {
            throw new Error('Template não encontrado');
          }
        } catch (error) {
          templateName.textContent = 'não encontrado';
          templateStatus.style.display = 'block';
          templateStatus.style.color = '#ef4444'; // vermelho para erro
          console.warn(`⚠️ Template não encontrado para ${modelo}`);
        }
      } else {
        templateStatus.style.display = 'none';
      }
    };

    // Monitora mudanças no modelo
    modeloSelect.addEventListener('change', updateTemplateIndicator);
    
    // Atualiza indicador inicial
    updateTemplateIndicator();
  }
  
  /**
   * Configura sistema de templates DOCX
   * @private
   */
  static _setupTemplateSystem() {
    
    // Upload de template
    const templateUpload = $("#templateUpload");
    if (templateUpload) {
      templateUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          ContractApp.templateFile = file;
          
          // Atualiza interface
          $("#templateInfo").style.display = 'block';
          $("#templateNome").textContent = file.name;
          $("#btnPreencherTemplate").disabled = false;
          
          // Habilita o botão de download do template preenchido
          const btnDocx = $("#btnDocx");
          if (btnDocx) {
            btnDocx.disabled = false;
            btnDocx.title = 'Ctrl+D - Baixar template preenchido';
          }
          
          console.log('📋 Template carregado:', file.name);
        } else {
          alert('Por favor, selecione um arquivo .docx válido');
          e.target.value = '';
          
          // Mantém botão habilitado (sistema automático disponível)
          const btnDocx = $("#btnDocx");
          if (btnDocx) {
            btnDocx.title = 'Ctrl+D - Gerar DOCX (sistema automático ativo)';
          }
        }
      });
    }
    
    // Botão preencher template
    const btnPreencherTemplate = $("#btnPreencherTemplate");
    if (btnPreencherTemplate) {
      btnPreencherTemplate.addEventListener('click', () => {
        if (ContractApp.templateFile) {
          ContractExports.preencherTemplateDOCX(ContractApp.templateFile);
        } else {
          alert('⚠️ Primeiro carregue um template .docx');
        }
      });
    }
    
    // Botão baixar template exemplo
    const btnBaixarTemplate = $("#btnBaixarTemplate");
    if (btnBaixarTemplate) {
      btnBaixarTemplate.addEventListener('click', this._criarTemplateExemplo.bind(this));
    }
    
    // Botão ver placeholders
    const btnVerPlaceholders = $("#btnVerPlaceholders");
    if (btnVerPlaceholders) {
      btnVerPlaceholders.addEventListener('click', this._mostrarPlaceholders.bind(this));
    }
    
    // Botão testar bibliotecas
    const btnTestarBibliotecas = $("#btnTestarBibliotecas");
    if (btnTestarBibliotecas) {
      btnTestarBibliotecas.addEventListener('click', this._testarBibliotecas.bind(this));
    }
    
    // Inicializa botão DOCX como habilitado (sistema automático)
    const btnDocx = $("#btnDocx");
    if (btnDocx) {
      btnDocx.disabled = false;
      btnDocx.title = 'Ctrl+D - Gerar documento DOCX automaticamente';
      console.log('✅ Botão DOCX habilitado - Sistema automático ativo');
    } else {
      console.error('❌ Botão DOCX não encontrado!');
    }
    
    console.log('✅ Sistema de templates configurado');
  }
  
  /**
   * Cria template de exemplo para download
   * @private
   */
  static async _criarTemplateExemplo() {
    try {
      const { Document, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType } = window.docx;
      
      if (!Document) {
        throw new Error('Biblioteca docx não carregada');
      }
      
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Cabeçalho
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
            
            new Paragraph({ text: "" }),
            
            // Informações básicas
            new Paragraph({
              children: [
                new TextRun({ text: "Contrato Nº: ", bold: true }),
                new TextRun({ text: "{{CONTRATO}}" }),
                new TextRun({ text: "    Data: ", bold: true }),
                new TextRun({ text: "{{DATA}}" }),
              ],
            }),
            
            new Paragraph({ text: "" }),
            
            // Responsável
            new Paragraph({
              children: [new TextRun({ text: "DADOS DO RESPONSÁVEL FINANCEIRO", bold: true, size: 24 })],
              heading: HeadingLevel.HEADING_1,
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Nome: ", bold: true }),
                new TextRun({ text: "{{NOME COMPLETO}}" }),
              ],
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "CPF: ", bold: true }),
                new TextRun({ text: "{{NÚMERO DO CPF}}" }),
                new TextRun({ text: "    RG: ", bold: true }),
                new TextRun({ text: "{{RG RESPONSAVEL}}" }),
              ],
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Telefone: ", bold: true }),
                new TextRun({ text: "{{TELEFONE}}" }),
              ],
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Endereço: ", bold: true }),
                new TextRun({ text: "{{ENDEREÇO COMPLETO}}, Nº {{N CS}} - {{BAIRRO}} - CEP: {{CEP}} - {{CID/EST}}" }),
              ],
            }),
            
            new Paragraph({ text: "" }),
            
            // Aluno
            new Paragraph({
              children: [new TextRun({ text: "DADOS DO ALUNO", bold: true, size: 24 })],
              heading: HeadingLevel.HEADING_1,
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Nome do Aluno: ", bold: true }),
                new TextRun({ text: "{{NOME DO ALUNO}}" }),
              ],
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "CPF: ", bold: true }),
                new TextRun({ text: "{{CPF DO ALUNO}}" }),
                new TextRun({ text: "    RG: ", bold: true }),
                new TextRun({ text: "{{RG ALUNO}}" }),
              ],
            }),
            
            new Paragraph({ text: "" }),
            
            // Curso
            new Paragraph({
              children: [new TextRun({ text: "INFORMAÇÕES DO CURSO", bold: true, size: 24 })],
              heading: HeadingLevel.HEADING_1,
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Curso: ", bold: true }),
                new TextRun({ text: "{{PROFISSIONALIZANTE}}" }),
              ],
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Carga Horária: ", bold: true }),
                new TextRun({ text: "{{CARGA HORÁRIA}}" }),
              ],
            }),
            
            new Paragraph({ text: "" }),
            
            // Valores
            new Paragraph({
              children: [new TextRun({ text: "INFORMAÇÕES FINANCEIRAS", bold: true, size: 24 })],
              heading: HeadingLevel.HEADING_1,
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Valor Total: ", bold: true }),
                new TextRun({ text: "{{VALOR TOTAL}}" }),
              ],
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Forma de Pagamento: ", bold: true }),
                new TextRun({ text: "{{FORMA_PAGAMENTO}}" }),
              ],
            }),
            
            new Paragraph({ text: "" }),
            
            // Rodapé
            new Paragraph({
              children: [
                new TextRun({
                  text: "Documento gerado automaticamente pelo Gerador de Contratos v{{VERSAO}} em {{DATA_GERACAO}}",
                  italics: true,
                  size: 20,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        }],
      });
      
      // Gerar e baixar
      const buffer = await window.docx.Packer.toBlob(doc);
      const url = URL.createObjectURL(buffer);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Template_Contrato_Exemplo.docx';
      a.click();
      
      URL.revokeObjectURL(url);
      
      console.log('✅ Template exemplo gerado');
      
      // Mostra instrução
      alert(`📋 Template exemplo baixado!

COMO USAR:
1. Abra o arquivo Template_Contrato_Exemplo.docx
2. Personalize o conteúdo conforme necessário
3. Mantenha os placeholders {{CAMPO}} onde quer que os dados sejam inseridos
4. Salve e faça upload aqui para preenchimento automático

O sistema substituirá automaticamente todos os {{PLACEHOLDERS}} pelos dados do formulário.`);
      
    } catch (error) {
      console.error('❌ Erro ao criar template exemplo:', error);
      alert('Erro ao gerar template exemplo. Verifique se a biblioteca está carregada.');
    }
  }
  
  /**
   * Mostra lista de placeholders disponíveis
   * @private
   */
  static _mostrarPlaceholders() {
    const placeholders = Object.keys(PLACEHOLDERS_CANONICOS).sort();
    const extras = ['{{MODELO}}', '{{FORMA_PAGAMENTO}}', '{{DATA_GERACAO}}', '{{VERSAO}}'];
    
    const lista = `📋 PLACEHOLDERS DISPONÍVEIS PARA TEMPLATES:

DADOS BÁSICOS:
${placeholders.filter(p => ['CONTRATO', 'DATA'].includes(p)).map(p => `• {{${p}}}`).join('\n')}

RESPONSÁVEL FINANCEIRO:
${placeholders.filter(p => p.includes('NOME COMPLETO') || p.includes('CPF') || p.includes('RG RESPONSAVEL') || p.includes('TELEFONE')).map(p => `• {{${p}}}`).join('\n')}

ENDEREÇO:
${placeholders.filter(p => p.includes('ENDEREÇO') || p.includes('BAIRRO') || p.includes('CEP') || p.includes('CID')).map(p => `• {{${p}}}`).join('\n')}

DADOS DO ALUNO:
${placeholders.filter(p => p.includes('ALUNO')).map(p => `• {{${p}}}`).join('\n')}

CURSO:
${placeholders.filter(p => p.includes('PROFISSIONALIZANTE') || p.includes('CARGA')).map(p => `• {{${p}}}`).join('\n')}

VALORES:
${placeholders.filter(p => p.includes('VALOR') || p.includes('PARCELA') || p.includes('DESCONTO')).map(p => `• {{${p}}}`).join('\n')}

EXTRAS:
${extras.join('\n')}

INSTRUÇÕES:
1. Use estes placeholders exatamente como mostrado (com chaves duplas)
2. O sistema substituirá automaticamente pelos dados do formulário
3. Placeholders não encontrados permanecerão vazios
4. Teste com o template exemplo primeiro`;
    
    console.log(lista);
    
    // Cria arquivo texto
    const blob = new Blob([lista], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Lista_Placeholders.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    // Também mostra em popup
    alert(`${lista.substring(0, 500)}...

📄 Lista completa salva em 'Lista_Placeholders.txt'`);
  }
  
  /**
   * Configura atalhos de teclado
   * @private
   */
  static _setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + D = Gerar DOCX
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        const btnDocx = $("#btnDocx");
        if (btnDocx) btnDocx.click();
      }
      
      // F5 = Preencher exemplo (sem recarregar página)
      if (e.key === 'F5' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        ContractExports.fillExample();
      }
      
      // F9 = Recalcular
      if (e.key === 'F9') {
        e.preventDefault();
        ContractCalculations.forceRecalculate();
      }
    });
    
    console.log('✅ Atalhos de teclado configurados');
    console.log('⌨️  Atalhos disponíveis:');
    console.log('   Ctrl+D: Gerar DOCX');
    console.log('   F5: Preencher exemplo');
    console.log('   F9: Recalcular');
  }
  
  /**
   * Atualiza visibilidade dos campos baseado na forma de pagamento
   * FUNÇÃO REMOVIDA - Duplicada no init.js onde o novo motor gerencia automaticamente
   * O novo sistema de auto-calc já controla a visibilidade automaticamente
   */
  // updateFormaUI() removida - funcionalidade transferida para o motor auto-calc
  
  /**
   * Mostra erro para o usuário
   * @param {string} message - Mensagem de erro
   * @private
   */
  static _showError(message) {
    // Criar notificação de erro
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 300px;
      font-size: 14px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remover após 5 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }
  
  /**
   * Valida formulário completo usando sistema avançado baseado no Python
   * @returns {Object} Resultado da validação
   */
  static validateForm() {
    // Coleta todos os dados do formulário
    const dados = ContractExports.collectData();
    
    // Remove metadados para validação
    const { _meta, ...camposParaValidar } = dados;
    
    // Usa o sistema de validação avançado
    const resultadoValidacao = validarCampos(camposParaValidar);
    
    // Validações específicas obrigatórias
    const camposObrigatorios = [
      "NOME COMPLETO",
      "CPF", 
      "NOME DO ALUNO",
      "PROFISSIONALIZANTE",
      "VALOR TOTAL",
      "DATA"
    ];
    
    const errosObrigatorios = [];
    for (const campo of camposObrigatorios) {
      const valor = dados[campo];
      if (!valor || valor.toString().trim() === "") {
        errosObrigatorios.push(`${campo} é obrigatório`);
      }
    }
    
    // Validações financeiras específicas
    const calcValidation = ContractCalculations.validateValues();
    
    // Combina todos os erros
    const todosErros = [
      ...errosObrigatorios,
      ...resultadoValidacao.erros,
      ...(calcValidation.isValid ? [] : calcValidation.errors)
    ];
    
    return {
      isValid: todosErros.length === 0,
      errors: todosErros,
      warnings: resultadoValidacao.warnings || [],
      validacao: resultadoValidacao
    };
  }
  
  /**
   * Aplica validação visual nos campos em tempo real
   */
  static applyLiveValidation() {
    // Aplica validação visual a TODOS os campos de input do formulário
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(element => {
      element.addEventListener('blur', (e) => {
        const fieldName = this._getFieldNameFromId(e.target.id);
        const value = e.target.value;
        // Remove classes anteriores
        e.target.classList.remove('valid', 'invalid');
        // Aplica validação
        if (value.trim() !== "") {
          const isValid = validarCampo(fieldName, value);
          e.target.classList.add(isValid ? 'valid' : 'invalid');
        }
      });
    });
  }
  
  /**
   * Converte ID do input para nome do campo
   * @private
   */
  static _getFieldNameFromId(id) {
    const mapping = {
      'nomeResp': 'NOME COMPLETO',
      'nomeAluno': 'NOME DO ALUNO',
      'cpfResp': 'CPF',
      'cpfAluno': 'CPF DO ALUNO',
      'nascResp': 'NASC RESP',
      'nascAluno': 'NASC ALUNO',
      'rgResp': 'RG RESPONSAVEL',
      'rgAluno': 'RG ALUNO',
      'telResp': 'TELEFONE',
      'endereco': 'ENDEREÇO COMPLETO',
      'bairro': 'BAIRRO',
      'cep': 'CEP',
      'cidadeUf': 'CID/EST',
      'curso': 'PROFISSIONALIZANTE',
      'carga': 'CARGA HORÁRIA',
      'total': 'VALOR TOTAL',
      'avista': 'VALOR À VISTA'
    };
    
    return mapping[id] || id.toUpperCase();
  }

  /**
   * Testa se as bibliotecas de template estão funcionando
   * @private
   */
  static _testarBibliotecas() {
    const results = {
      pizzip: typeof window.PizZip !== 'undefined',
      docxtemplater: typeof window.Docxtemplater !== 'undefined',
      ready: window.templateLibrariesReady || false
    };

    let message = '🧪 TESTE DE BIBLIOTECAS\n\n';
    message += `📦 PizZip: ${results.pizzip ? '✅ Carregado' : '❌ Não encontrado'}\n`;
    message += `📦 Docxtemplater: ${results.docxtemplater ? '✅ Carregado' : '❌ Não encontrado'}\n`;
    message += `🔄 Status: ${results.ready ? '✅ Pronto para usar' : '⏳ Ainda carregando'}\n\n`;

    if (results.pizzip && results.docxtemplater) {
      try { new window.PizZip(); message += '🎉 Teste básico: ✅ SUCESSO\n\n'; }
      catch (error) { message += `❌ Teste básico falhou: ${error.message}\n\n`; }
    } else {
      message += '⚠️ Algumas bibliotecas não carregaram.\n';
      message += 'Verifique se os arquivos locais foram incluídos no index.html:\n';
      message += ' - src/export/libs/pizzip.min.js\n';
      message += ' - src/export/libs/docxtemplater.js\n';
    }
    alert(message);
  }
}

// ==========================================================================
// FUNÇÕES GLOBAIS PARA COMPATIBILIDADE
// ==========================================================================

// Manter compatibilidade com código existente
// window.updateFormaUI = ContractApp.updateFormaUI.bind(ContractApp); // COMENTADO - função duplicada removida
window.recalc = () => {
  if (window.AutomaticCalculations) {
    AutomaticCalculations.forceRecalculate();
  }
};
window.coletar = function() {
    if (typeof ContractExports !== 'undefined' && ContractExports.collectData) {
        return ContractExports.collectData.apply(ContractExports, arguments);
    } else {
        console.warn('⚠️ ContractExports não está disponível ainda');
        // Fallback: implement basic data collection
        if (typeof ContractApp !== 'undefined' && ContractApp._collectDataFallback) {
            return ContractApp._collectDataFallback.apply(ContractApp, arguments);
        } else {
            console.warn('⚠️ ContractApp._collectDataFallback também não está disponível');
            return {};
        }
    }
};

// Aliases das funções utilitárias
window.titleCase = titleCase;
window.maskCPF = maskCPF;
window.maskPhone = maskPhone;
window.maskCEP = maskCEP;
window.maskDate = maskDate;
window.parseBRL = parseBRL;
window.fmtBRL = fmtBRL;
window.$ = $;
window.$$ = $$;
window.get = get;
window.set = set;
window.onlyDigits = onlyDigits;
window.isValidCPF = isValidCPF;

// ==========================================================================
// INICIALIZAÇÃO
// ==========================================================================

// Verificar se está rodando via file:// e avisar sobre limitações
if (window.location.protocol === 'file:') {
  console.warn('⚠️ EXECUTANDO VIA ARQUIVO LOCAL (file://)');
  console.warn('📋 Para funcionalidade completa, execute via servidor web:');
  console.warn('   python -m http.server 8000');
  console.warn('   Depois acesse: http://localhost:8000');
  
  // Adicionar aviso visual na página após carregamento
  setTimeout(() => {
    const header = document.querySelector('header');
    if (header) {
      const warning = document.createElement('div');
      warning.style.cssText = `
        background: linear-gradient(45deg, #f59e0b, #d97706);
        color: white;
        padding: 8px 16px;
        margin: 8px 0;
        border-radius: 8px;
        font-size: 12px;
        text-align: center;
        border: 1px solid #92400e;
      `;
      warning.innerHTML = '⚠️ <strong>Modo Local:</strong> Para templates automáticos, execute via servidor web | <strong>Alternativa:</strong> Use upload manual';
      header.appendChild(warning);
    }
  }, 1000);
}

// Função global comentada - agora usando método da classe ContractApp._testarBibliotecas()
/*
function testarBibliotecas() {
  const results = {
    pizzip: typeof window.PizZip !== 'undefined',
    docxtemplater: typeof window.Docxtemplater !== 'undefined',
    ready: window.templateLibrariesReady || false
  };
  
  let message = '🧪 TESTE DE BIBLIOTECAS\n\n';
  message += `📦 PizZip: ${results.pizzip ? '✅ Carregado' : '❌ Não encontrado'}\n`;
  message += `📦 Docxtemplater: ${results.docxtemplater ? '✅ Carregado' : '❌ Não encontrado'}\n`;
  message += `🔄 Status: ${results.ready ? '✅ Pronto para usar' : '⏳ Ainda carregando'}\n\n`;
  
  if (results.pizzip && results.docxtemplater) {
    try {
      const testZip = new window.PizZip();
      message += '🎉 Teste básico: ✅ SUCESSO\n\n';
      message += 'O sistema está funcionando corretamente!\n';
      message += 'Você pode usar templates DOCX normalmente.';
    } catch (error) {
      message += `❌ Teste básico falhou: ${error.message}\n\n`;
      message += 'Recarregue a página e tente novamente.';
    }
  } else {
    message += '⚠️ Algumas bibliotecas não carregaram.\n';
    message += 'Verifique sua conexão com a internet\n';
    message += 'e recarregue a página.';
  }
  
  alert(message);
}
*/

// Auto-inicializar quando script for carregado
ContractApp.init();

console.log('✅ Main carregado com sucesso');

// Sistema de debug global para diagnosticar problemas
window.debugSistema = function() {
  console.log('🚀 === DEBUG COMPLETO DO SISTEMA ===');
  
  // 1. Verificar se todos os módulos estão carregados
  console.log('📦 Módulos carregados:');
  console.log('  - ContractApp:', typeof ContractApp);
  console.log('  - ContractCalculations:', typeof ContractCalculations);
  console.log('  - utils (get, parseBRL, fmtBRL):', typeof get, typeof parseBRL, typeof fmtBRL);
  
  // 2. Verificar elementos do DOM
  console.log('🎯 Elementos do DOM:');
  const elementos = [
    '#forma', '#total', '#avista', '#parcela', 
    '#parcCartao', '#entrada', '#parcBoleto', 
    '#nParcelas', '#desconto', '#auto'
  ];
  
  elementos.forEach(selector => {
    const el = document.querySelector(selector);
    console.log(`  ${selector}: ${el ? '✅ ENCONTRADO' : '❌ NÃO ENCONTRADO'}`);
    if (el) {
      console.log(`    Valor atual: "${el.value}"`);
      console.log(`    Eventos: ${el.getEventListeners ? 'SIM' : 'NÃO DISPONÍVEL'}` );
    }
  });
  
  // 3. Testar função de utilitários
  console.log('🛠️ Testando utilitários:');
  try {
    console.log('  get("#total"):', get("#total"));
    console.log('  parseBRL("R$ 1.200,00"):', parseBRL("R$ 1.200,00"));
    console.log('  fmtBRL(1200):', fmtBRL(1200));
  } catch (e) {
    console.log('  ❌ Erro nos utilitários:', e);
  }
  
  // 4. Testar cálculo manual
  console.log('🧮 Teste de cálculo manual:');
  try {
    // Configurar valores de teste
    const formaEl = document.querySelector('#forma');
    const totalEl = document.querySelector('#total');
    const parcelasEl = document.querySelector('#nParcelas');
    
    if (formaEl && totalEl && parcelasEl) {
      formaEl.value = 'Cartão';
      totalEl.value = 'R$ 1.200,00';
      parcelasEl.value = '12';
      
      console.log('  Valores configurados - Forma: Cartão, Total: R$ 1.200,00, Parcelas: 12');
      
      // Executar cálculo com novo motor
      if (window.AutomaticCalculations) {
        AutomaticCalculations.forceRecalculate();
      }
      
      const resultado = document.querySelector('#parcela').value;
      console.log('  Resultado obtido:', resultado);
      console.log('  Esperado: R$ 100,00');
    }
  } catch (e) {
    console.log('  ❌ Erro no teste de cálculo:', e);
  }
  
  console.log('✅ Debug completo finalizado');
};