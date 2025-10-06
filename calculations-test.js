console.log('🧪 Teste básico de calculations.js');

// Teste mínimo da classe ContractCalculations
class ContractCalculations {
  static recalculate() {
    console.log('✅ Método recalculate executado');
  }
}

// Exportar para o contexto global
window.ContractCalculations = ContractCalculations;

// Função de teste global
window.testarCalculo = function() {
  console.log('🧪 FUNÇÃO TESTAR CALCULO EXECUTADA');
  console.log('✅ Função testarCalculo está funcionando');
  
  // Testar elementos básicos
  const forma = document.querySelector('#forma');
  const total = document.querySelector('#total');
  
  if (forma && total) {
    forma.value = 'Cartão';
    total.value = 'R$ 1.200,00';
    console.log('✅ Valores configurados');
  } else {
    console.log('❌ Elementos não encontrados');
  }
};

console.log('✅ Calculations básico carregado');