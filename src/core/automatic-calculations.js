/* ==========================================================================
   GERADOR DE CONTRATOS - SISTEMA DE CÁLCULO AUTOMÁTICO
   Sistema inteligente que calcula automaticamente valores financeiros
   ========================================================================== */

class AutomaticCalculations {
  static lastModified = null;
  static isCalculating = false;

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
        console.log(`💳 Forma de pagamento alterada: ${formaElement.value}`);
        this.calculate();
      });
    }
  }

  /**
   * Função principal de cálculo
   */
  static calculate() {
    if (this.isCalculating) return;
    
    try {
      this.isCalculating = true;
      
      // Verificar se auto-cálculo está ativo
      const autoCheck = document.getElementById('auto');
      if (!autoCheck || !autoCheck.checked) {
        console.log('⏸️ Auto-cálculo desativado');
        return;
      }

      const forma = this.getValue('forma');
      console.log(`🔄 Calculando para forma: ${forma}`);

      switch (forma) {
        case 'À vista':
          this.calculateAvista();
          break;
        case 'Cartão':
          this.calculateCartao();
          break;
        case 'Boleto':
          this.calculateBoleto();
          break;
        default:
          console.log('⚠️ Forma de pagamento não selecionada');
      }
    } catch (error) {
      console.error('❌ Erro no cálculo:', error);
    } finally {
      this.isCalculating = false;
    }
  }

  /**
   * Cálculo para pagamento À vista
   */
  static calculateAvista() {
    const total = this.parseNumber('total');
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
    const total = this.parseNumber('total');
    const parcela = this.parseNumber('parcela');
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
    const total = this.parseNumber('total');
    const entrada = this.parseNumber('entrada');
    const parcela = this.parseNumber('parcela');
    const nParcelas = parseInt(this.getValue('nParcelas')) || 0;

    const valorFinanciado = total - entrada;
    console.log(`📄 Boleto - Total: ${total}, Entrada: ${entrada}, Financiado: ${valorFinanciado}`);

    if (total > 0 && entrada >= 0 && nParcelas > 0 && parcela === 0) {
      // Calcular valor da parcela
      const valorParcela = valorFinanciado / nParcelas;
      this.setValue('parcela', valorParcela);
      console.log(`📄 Parcela calculada: R$ ${valorParcela.toFixed(2)}`);
    } else if (total > 0 && entrada >= 0 && parcela > 0 && nParcelas === 0) {
      // Calcular número de parcelas
      const numParcelas = Math.ceil(valorFinanciado / parcela);
      document.getElementById('nParcelas').value = numParcelas;
      console.log(`📄 Parcelas calculadas: ${numParcelas}x`);
    } else if (entrada >= 0 && parcela > 0 && nParcelas > 0 && total === 0) {
      // Calcular total
      const valorTotal = entrada + (parcela * nParcelas);
      this.setValue('total', valorTotal);
      console.log(`📄 Total calculado: R$ ${valorTotal.toFixed(2)}`);
    }
  }

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
    const number = parseFloat(cleaned);
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
  document.getElementById('forma').value = 'Cartão';
  document.getElementById('total').value = 'R$ 1.200,00';
  document.getElementById('nParcelas').value = '12';
  document.getElementById('parcela').value = '';
  
  console.log('📋 Dados configurados: Cartão, R$ 1.200,00, 12 parcelas');
  
  // Simular modificação do campo
  AutomaticCalculations.lastModified = 'total';
  AutomaticCalculations.calculate();
  
  console.log('🔍 Resultado:', document.getElementById('parcela').value);
  console.log('✅ Teste concluído');
};

console.log('✅ Sistema de cálculo automático carregado');