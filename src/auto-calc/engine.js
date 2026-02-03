/* ==========================================================================
   GERADOR DE CONTRATOS - SISTEMA DE CÁLCULO AUTOMÁTICO
   Sistema inteligente que calcula automaticamente valores financeiros
   ========================================================================== */

class AutomaticCalculations {
  static lastModified = null;
  static isCalculating = false;

  /* ----------------- NORMALIZAÇÃO DA FORMA DE PAGAMENTO ----------------- */

  /**
   * Normaliza a forma de pagamento para tokens: avista | cartao | boleto
   * Aceita tanto o texto bonito quanto o token bruto.
   */
  static normalizeFormaPagamento(valor) {
    const s = (valor || '').toString().trim().toLowerCase();

    if (!s) return '';

    // tokens já normalizados
    if (['avista', 'cartao', 'boleto'].includes(s)) return s;

    // À vista
    if (s.includes('vista')) return 'avista';

    // Cartão
    if (s.includes('cart')) return 'cartao';

    // Boleto
    if (s.includes('bol')) return 'boleto';

    return '';
  }

  /* --------------------------- INICIALIZAÇÃO ---------------------------- */

  /**
   * Inicializa o sistema de cálculo automático
   */
  static init() {
    console.log('🚀 Inicializando sistema de cálculo automático');
    this.setupEventListeners();
    this.setupFormChangeListener();
    console.log('✅ Sistema de cálculo automático inicializado');
  }

  /**
   * Configura os event listeners para todos os campos financeiros
   */
  static setupEventListeners() {
    const fields = [
      'total', 'avista', 'parcela', 'entrada',
      'nParcelas', 'desconto', 'diaVenc'
    ];

    fields.forEach(fieldId => {
      const element = document.getElementById(fieldId);
      if (element) {
        // Evento de input (tempo real)
        element.addEventListener('input', (e) => {
          this.lastModified = fieldId;
          console.log(`📝 Campo modificado: ${fieldId} = "${e.target.value}"`);
          this.calculate();
        });

        // Evento de blur (ao sair do campo)
        element.addEventListener('blur', () => {
          this.calculate();
        });

        console.log(`✅ Eventos configurados para campo: ${fieldId}`);
      }
    });
  }

  /**
   * Configura listener para mudanças na forma de pagamento
   */
  static setupFormChangeListener() {
    const formaElement = document.getElementById('forma');
    if (formaElement) {
      formaElement.addEventListener('change', () => {
        const raw   = formaElement.value || '';
        const forma = this.normalizeFormaPagamento(raw);
        console.log(`💳 Forma de pagamento alterada (normalizada): ${forma} (raw="${raw}")`);
        this.calculate();
      });
    }
  }

  /* ------------------------- FUNÇÃO PRINCIPAL --------------------------- */

  /**
   * Função principal de cálculo
   */
  static calculate() {
    if (this.isCalculating) return;

    try {
      this.isCalculating = true;

      const autoCheck = document.getElementById('auto');
      if (!autoCheck || !autoCheck.checked) {
        console.log('⏸️ Auto-cálculo desativado');
        return;
      }

      const formaRaw = this.getValue('forma');
      const forma    = this.normalizeFormaPagamento(formaRaw);
      console.log(`🔄 Calculando para forma (normalizada): ${forma} (raw="${formaRaw}")`);

      switch (forma) {
        case 'avista':
          this.calculateAvista();
          break;
        case 'cartao':
          this.calculateCartao();
          break;
        case 'boleto':
          this.calculateBoleto();
          break;
        default:
          console.log('⚠️ Forma de pagamento não selecionada / inválida:', formaRaw);
      }
    } catch (error) {
      console.error('❌ Erro no cálculo:', error);
    } finally {
      this.isCalculating = false;
    }
  }

  /* ------------------------ MODOS DE PAGAMENTO -------------------------- */

  /**
   * Cálculo para pagamento À vista
   */
  static calculateAvista() {
    const total  = this.parseNumber('total');
    const avista = this.parseNumber('avista');

    if (total > 0 && avista === 0) {
      this.setValue('avista', total);
      console.log(`💰 À vista calculado: R$ ${total.toFixed(2)}`);
    } else if (avista > 0 && total === 0) {
      this.setValue('total', avista);
      console.log(`💰 Total calculado: R$ ${avista.toFixed(2)}`);
    }
  }

  /**
   * Cálculo para pagamento no Cartão
   */
  static calculateCartao() {
    const total     = this.parseNumber('total');
    const parcela   = this.parseNumber('parcela');
    const nParcelas = parseInt(this.getValue('nParcelas')) || 0;

    console.log(`💳 Cartão - Total: ${total}, Parcela: ${parcela}, Parcelas: ${nParcelas}`);

    if (total > 0 && nParcelas > 0 && parcela === 0) {
      // Calcular valor da parcela
      const valorParcela = total / nParcelas;
      this.setValue('parcela', valorParcela);
      console.log(`💳 Parcela calculada: R$ ${valorParcela.toFixed(2)}`);
    } else if (parcela > 0 && nParcelas > 0 && total === 0) {
      // Calcular total
      const valorTotal = parcela * nParcelas;
      this.setValue('total', valorTotal);
      console.log(`💳 Total calculado: R$ ${valorTotal.toFixed(2)}`);
    } else if (total > 0 && parcela > 0 && nParcelas === 0) {
      // Calcular número de parcelas
      const numParcelas = Math.round(total / parcela);
      document.getElementById('nParcelas').value = numParcelas;
      console.log(`💳 Parcelas calculadas: ${numParcelas}x`);
    }
  }

  /**
   * Cálculo para pagamento no Boleto
   */
  static calculateBoleto() {
        const totalInput      = document.getElementById('total');
        const nParcelasInput  = document.getElementById('nParcelas');

        // Lê valores brutos
        let total      = this.parseNumber('total');
        let entrada    = this.parseNumber('entrada');
        let parcela    = this.parseNumber('parcela');
        let nParcelas  = parseInt(this.getValue('nParcelas'), 10) || 0;

        // Validação / normalização da entrada
        if (entrada < 0) {
          entrada = 0;
          this.setValue('entrada', 0);
          console.warn('⚠️ Entrada negativa ajustada para zero.');
        }

        // Validação / normalização de número de parcelas
        if (!Number.isInteger(nParcelas) || nParcelas < 1) {
          nParcelas = 1;
          nParcelasInput.value = 1;
          nParcelasInput?.classList.add('invalid');
          console.error('❌ Número de parcelas deve ser inteiro positivo. Ajustado para 1.');
        } else {
          nParcelasInput.value = nParcelas;
          nParcelasInput?.classList.remove('invalid');
          nParcelasInput?.classList.add('valid');
        }

        // Agora decidimos se o TOTAL é obrigatório ou será calculado
        // Se total <= 0 e NÃO temos dados suficientes para calcular (parcela e nParcelas),
        // então é erro. Caso contrário, deixamos seguir para o cálculo do total.
        if (total <= 0 && !(parcela > 0 && Number.isInteger(nParcelas) && nParcelas >= 1)) {
          totalInput?.classList.add('invalid');
          console.error('❌ Total deve ser maior que zero ou será calculado a partir de parcela x número de parcelas.');
          return;
        } else {
          totalInput?.classList.remove('invalid');
        }

        const valorFinanciado = total > 0 ? (total - entrada) : 0;
        console.log(`📄 Boleto - Total: ${total}, Entrada: ${entrada}, Financiado: ${valorFinanciado}, Parcelas: ${nParcelas}, Parcela: ${parcela}`);

        // 1) Cálculo do valor da parcela (quando já temos total e nParcelas)
        if (parcela === 0 && valorFinanciado > 0 && nParcelas > 0) {
          const valorParcela = Math.round((valorFinanciado / nParcelas) * 100) / 100;
          this.setValue('parcela', valorParcela);
          console.log(`📄 Parcela calculada: R$ ${valorParcela.toFixed(2)}`);
        }

        // 2) Cálculo do número de parcelas (quando temos total, entrada e valor da parcela)
        else if (parcela > 0 && valorFinanciado > 0 && nParcelas === 1) {
          const numParcelas = Math.max(1, Math.ceil(valorFinanciado / parcela));
          nParcelasInput.value = numParcelas;
          nParcelasInput.classList.add('valid');
          console.log(`📄 Parcelas calculadas: ${numParcelas}`);
        }

        // 3) Cálculo do total (quando o total está em branco, mas temos entrada, parcela e nParcelas)
        else if (total === 0 && entrada >= 0 && parcela > 0 && Number.isInteger(nParcelas) && nParcelas >= 1) {
          const valorTotal = entrada + (parcela * nParcelas);
          const arredondado = Math.round(valorTotal * 100) / 100;
          this.setValue('total', arredondado);
          totalInput?.classList.remove('invalid');
          totalInput?.classList.add('valid');
          console.log(`📄 Total calculado: R$ ${valorTotal.toFixed(2)}`);
        }
  }

  /* ------------------------ HELPERS DE CAMPOS --------------------------- */

  /**
   * Obtém valor de um campo
   */
  static getValue(fieldId) {
    const element = document.getElementById(fieldId);
    return element ? element.value : '';
  }

  /**
   * Converte valor monetário para número
   */
  static parseNumber(fieldId) {
    const value = this.getValue(fieldId);
    if (!value) return 0;

    // Remove formatação brasileira
    const cleaned = value.replace(/[R$\s\.]/g, '').replace(',', '.');
    const number  = parseFloat(cleaned);
    return isNaN(number) ? 0 : number;
  }

  /**
   * Define valor em um campo com formatação
   */
  static setValue(fieldId, value) {
    const element = document.getElementById(fieldId);
    if (!element) return;

    const formatted = this.formatCurrency(value);
    element.value = formatted;
    element.classList.add('calculated');

    // Remove classe após animação
    setTimeout(() => element.classList.remove('calculated'), 1000);
  }

  /**
   * Formata número para moeda brasileira
   */
  static formatCurrency(value) {
    if (value === 0) return '';
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }

  /**
   * Força recálculo manual
   */
  static forceRecalculate() {
    console.log('🔄 Recálculo manual forçado');
    this.calculate();
  }
}

// Exportar para contexto global
window.AutomaticCalculations = AutomaticCalculations;

// Função de teste global
window.testarCalculoAutomatico = function() {
  console.log('🧪 === TESTE DO SISTEMA DE CÁLCULO ===');

  // Configurar dados de teste
  document.getElementById('forma').value      = 'cartao';       // usa token
  document.getElementById('total').value      = 'R$ 1.200,00';
  document.getElementById('nParcelas').value  = '12';
  document.getElementById('parcela').value    = '';

  console.log('📋 Dados configurados: Cartão, R$ 1.200,00, 12 parcelas');

  AutomaticCalculations.lastModified = 'total';
  AutomaticCalculations.calculate();

  console.log('🔍 Resultado:', document.getElementById('parcela').value);
  console.log('✅ Teste concluído');
};

// --- SHIM DE COMPATIBILIDADE COM ContractCalculations (usado pelo main.js) ---
window.ContractCalculations = window.ContractCalculations || {
  recalculate(lastEdited) {
    if (window.AutomaticCalculations) {
      window.AutomaticCalculations.forceRecalculate();
    }
  }
};

console.log('✅ Sistema de cálculo automático carregado');
