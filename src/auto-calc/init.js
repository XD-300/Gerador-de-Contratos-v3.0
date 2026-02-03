/* ==========================================================================
   INICIALIZADOR DO SISTEMA DE CÁLCULO AUTOMÁTICO
   Responsável por inicializar o motor de cálculos quando o DOM estiver pronto
   ========================================================================== */

// Verificação para evitar conflito com updateFormaUI duplicada
if (typeof window.updateFormaUI !== 'undefined') {
  console.warn('⚠️ updateFormaUI já existe. Removendo duplicação do main.js...');
  console.log('ℹ️ A versão do init.js (updateFieldVisibility) será a principal');
}

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
    if (typeof window.AutomaticCalculations === 'undefined') {
      console.error('❌ AutomaticCalculations não encontrado! Verifique se engine.js foi carregado.');
      return;
    }

    // Inicializar o motor de cálculo
    try {
      window.AutomaticCalculations.init();
    } catch (e) {
      console.error('❌ Falha ao iniciar AutomaticCalculations:', e);
    }

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
        try {
          window.AutomaticCalculations.forceRecalculate();
        } catch (e) {
          console.error('❌ Falha no recálculo manual:', e);
        }
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
    if (!formaSelect) return;

    // Atualizar visibilidade inicial
    this.updateFieldVisibility(formaSelect.value);

    // Escutar mudanças na forma de pagamento
    formaSelect.addEventListener('change', (e) => {
      this.updateFieldVisibility(e.target.value);
    });

    console.log('✅ Sistema de visibilidade de campos configurado');
  }

  /**
   * Atualiza a visibilidade dos campos baseado na forma de pagamento
   * Usa o atributo data-show nos containers dos campos:
   *  - "avista"      → À vista
   *  - "cartao"      → Cartão
   *  - "boleto"      → Boleto
   *  - pode ter múltiplos: "cartao,boleto"
   * 
   * Esta é a versão principal que substitui updateFormaUI do main.js
   */
  static updateFieldVisibility(forma) {
    // Usa função get() se disponível, senão fallback para getElementById
    const getElement = window.get || ((selector) => document.querySelector(selector));
    const getAllElements = window.$$ || ((selector) => document.querySelectorAll(selector));
    
    // Se forma não foi passada, pegar do elemento #forma
    if (!forma) {
      const formaEl = getElement('#forma');
      forma = formaEl ? formaEl.value : '';
    }

    // Aplica regra de visibilidade usando a mesma lógica do main.js
    getAllElements('[data-show]').forEach((element) => {
      const showFor = element.getAttribute('data-show');
      let visible = false;
      
      // Suporta múltiplos valores separados por vírgula (ex: "cartao,boleto")
      const formasPermitidas = showFor.split(',').map(f => f.trim());
      
      if (formasPermitidas.includes('cartao') && forma === 'cartao') visible = true;
      if (formasPermitidas.includes('boleto') && forma === 'boleto') visible = true;
      if (formasPermitidas.includes('avista') && forma === 'avista') visible = true;
      
      // Usar 'block' quando visível para manter compatibilidade com a versão original
      element.style.display = visible ? 'block' : 'none';
    });

    // Garante que o container do #total esteja sempre visível
    const totalEl = getElement('#total');
    if (totalEl && totalEl.parentElement) {
      totalEl.parentElement.style.display = 'block';
    }

    console.log(`👁️ Campos atualizados para forma: ${forma} (versão principal do init.js)`);
  }

  /**
   * Função de diagnóstico do sistema
   */
  static diagnostic() {
    console.log('🔍 === DIAGNÓSTICO DO SISTEMA DE CÁLCULO ===');

    // Verificar dependências
    console.log('📦 Dependências:');
    console.log(`  - AutomaticCalculations: ${typeof window.AutomaticCalculations !== 'undefined' ? '✅' : '❌'}`);

    // Verificar elementos do DOM
    console.log('🎯 Elementos DOM:');
    const elements = ['forma', 'total', 'avista', 'parcela', 'nParcelas', 'entrada', 'desconto', 'auto'];
    elements.forEach((id) => {
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
document.addEventListener('DOMContentLoaded', function () {
  console.log('📄 DOM carregado, preparando cálculo automático...');
  // pequeno atraso para garantir que engine.js já definiu AutomaticCalculations
  setTimeout(() => {
    try {
      AutoCalcInit.init();
    } catch (e) {
      console.error('❌ Falha na inicialização do AutoCalcInit:', e);
    }
  }, 200);
});

// Exportar para contexto global para debug
window.AutoCalcInit = AutoCalcInit;

// Função updateFormaUI como alias para compatibilidade com código legado
const updateFormaUI = function () {
  console.log('🔄 updateFormaUI chamada (compatibilidade) - redirecionando para updateFieldVisibility');
  try {
    const formaSelect = document.getElementById('forma');
    if (formaSelect) {
      AutoCalcInit.updateFieldVisibility(formaSelect.value);
    } else {
      console.warn('⚠️ Elemento #forma não encontrado para updateFormaUI');
    }
  } catch (error) {
    console.error('❌ Erro em updateFormaUI:', error);
    // Fallback básico em caso de erro
    const forma = document.getElementById('forma')?.value;
    if (forma) {
      AutoCalcInit.updateFieldVisibility(forma);
    }
  }
}

// Versão melhorada e principal que substitui updateFormaUI
window.updateFormaUI = updateFormaUI;
window.updateFieldVisibility = AutoCalcInit.updateFieldVisibility.bind(AutoCalcInit);

console.log('✅ Inicializador de cálculo automático carregado');
