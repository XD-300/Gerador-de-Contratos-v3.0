/* ==========================================================================
   INICIALIZADOR DO SISTEMA DE CÁLCULO AUTOMÁTICO
   Responsável por inicializar o motor de cálculos quando o DOM estiver pronto
   ========================================================================== */

class AutoCalcInit {
  static initialized = false;

  /**
   * Inicializa o sistema completo de cálculo automático
   */
  static init() {
    if (this.initialized) {
      console.log('⚠️ Sistema de cálculo já inicializado');
      return;
    }

    console.log('🔧 Inicializando sistema de cálculo automático...');

    // Verificar dependências
    if (typeof AutomaticCalculations === 'undefined') {
      console.error('❌ AutomaticCalculations não encontrado! Verifique se engine.js foi carregado.');
      return;
    }

    // Inicializar o motor de cálculo
    AutomaticCalculations.init();

    // Configurar botão de recálculo manual
    this.setupManualRecalcButton();

    // Configurar eventos de visibilidade dos campos
    this.setupFieldVisibility();

    this.initialized = true;
    console.log('✅ Sistema de cálculo automático totalmente inicializado');
  }

  /**
   * Configura o botão de recálculo manual
   */
  static setupManualRecalcButton() {
    const btnRecalcular = document.getElementById('btnCalcular');
    if (btnRecalcular) {
      btnRecalcular.addEventListener('click', () => {
        console.log('🔄 Recálculo manual acionado');
        AutomaticCalculations.forceRecalculate();
      });
      console.log('✅ Botão de recálculo manual configurado');
    } else {
      console.log('⚠️ Botão de recálculo não encontrado');
    }
  }

  /**
   * Configura a visibilidade dos campos baseada na forma de pagamento
   */
  static setupFieldVisibility() {
    const formaSelect = document.getElementById('forma');
    if (formaSelect) {
      // Atualizar visibilidade inicial
      this.updateFieldVisibility(formaSelect.value);

      // Escutar mudanças na forma de pagamento
      formaSelect.addEventListener('change', (e) => {
        this.updateFieldVisibility(e.target.value);
      });

      console.log('✅ Sistema de visibilidade de campos configurado');
    }
  }

  /**
   * Atualiza a visibilidade dos campos baseado na forma de pagamento
   */
  static updateFieldVisibility(forma) {
    // Usar sistema data-show como no main.js
    document.querySelectorAll('[data-show]').forEach(element => {
      const showFor = element.getAttribute('data-show');
      let visible = false;
      
      // Suporta múltiplos valores separados por vírgula (ex: "cartao,boleto")
      const formasPermitidas = showFor.split(',').map(f => f.trim());
      
      if (formasPermitidas.includes('cartao') && forma === 'Cartão') visible = true;
      if (formasPermitidas.includes('boleto') && forma === 'Boleto') visible = true;
      if (formasPermitidas.includes('avista') && forma === 'À vista') visible = true;
      
      element.style.display = visible ? 'block' : 'none';
    });
      fieldMappings[formaKey].forEach(fieldId => {
        const container = document.querySelector(`[data-show*="${fieldId}"]`)?.parentElement ||
                         document.getElementById(fieldId)?.parentElement;
        if (container) {
          container.style.display = 'block';
        }
      });
    }

    // Campo total sempre visível
    const totalContainer = document.getElementById('total')?.parentElement;
    if (totalContainer) {
      totalContainer.style.display = 'block';
    }

    console.log(`👁️ Campos atualizados para forma: ${forma}`);
  }

  /**
   * Função de diagnóstico do sistema
   */
  static diagnostic() {
    console.log('🔍 === DIAGNÓSTICO DO SISTEMA DE CÁLCULO ===');

    // Verificar dependências
    console.log('📦 Dependências:');
    console.log(`  - AutomaticCalculations: ${typeof AutomaticCalculations !== 'undefined' ? '✅' : '❌'}`);

    // Verificar elementos do DOM
    console.log('🎯 Elementos DOM:');
    const elements = ['forma', 'total', 'avista', 'parcela', 'nParcelas', 'entrada', 'desconto', 'auto'];
    elements.forEach(id => {
      const el = document.getElementById(id);
      console.log(`  - #${id}: ${el ? '✅' : '❌'}`);
    });

    // Verificar botões
    console.log('🔘 Botões:');
    const btnRecalc = document.getElementById('btnCalcular');
    console.log(`  - Recalcular: ${btnRecalc ? '✅' : '❌'}`);

    // Status do sistema
    console.log('⚙️ Status:');
    console.log(`  - Inicializado: ${this.initialized ? '✅' : '❌'}`);

    console.log('✅ Diagnóstico concluído');
  }
}

// Auto-inicializar quando DOM carregar
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM carregado, preparando cálculo automático...');
  
  // Aguardar carregamento completo dos scripts
  setTimeout(() => {
    AutoCalcInit.init();
  }, 500);
});

// Exportar para contexto global para debug
window.AutoCalcInit = AutoCalcInit;

console.log('✅ Inicializador de cálculo automático carregado');