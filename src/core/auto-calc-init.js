/* ==========================================================================
   INICIALIZADOR DO SISTEMA DE CÁLCULO AUTOMÁTICO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM carregado, inicializando cálculo automático...');
  
  // Aguardar que todos os scripts carreguem
  setTimeout(() => {
    if (typeof AutomaticCalculations !== 'undefined') {
      AutomaticCalculations.init();
      
      // Configurar botão de recálculo manual
      const btnRecalcular = document.getElementById('btnCalcular');
      if (btnRecalcular) {
        btnRecalcular.addEventListener('click', () => {
          AutomaticCalculations.forceRecalculate();
        });
        console.log('✅ Botão de recálculo configurado');
      }
      
      console.log('✅ Sistema de cálculo automático ativo');
    } else {
      console.error('❌ AutomaticCalculations não encontrado');
    }
  }, 500);
});