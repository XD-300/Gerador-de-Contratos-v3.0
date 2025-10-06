/* ==========================================================================
   GERADOR DE CONTRATOS - CÁLCULOS FINANCEIROS
   Versão compatível - sem métodos privados
   ========================================================================== */

class ContractCalculations {
  static forceRecalculate() { 
    this.recalculate(false); 
  }

  /**
   * Registra qual campo foi modificado por último
   */
  static setLastModified(fieldId) {
    this.lastModifiedField = fieldId;
    console.log('🎯 Último campo modificado:', fieldId);
  }

  /**
   * Recalcula valores conforme a forma de pagamento.
   * quiet=true: só escreve se o campo estiver vazio (modo auto-cálculo)
   */
  static recalculate(quiet = true) {
    try {
      console.log('🔄 Iniciando recálculo, quiet:', quiet);
      
      // auto-cálculo desligado?
      const auto = document.querySelector("#auto");
      if (auto && !auto.checked && quiet) {
        console.log('❌ Auto-cálculo desligado');
        return;
      }

      // sanitização
      let n = this._getNumero("#nParcelas");
      this._sanitizeDia("#diaVenc");

      const forma = (get("#forma") || "").trim();
      console.log('📝 Forma de pagamento:', forma);

      // valores monetários
      const total      = parseBRL(get("#total"));
      const avista     = parseBRL(get("#avista"));
      const parcCartao = parseBRL(get("#parcCartao"));
      const entrada    = parseBRL(get("#entrada"));
      const parcBoleto = parseBRL(get("#parcBoleto"));
      const parcela    = parseBRL(get("#parcela"));
      const desconto   = parseBRL(get("#desconto"));

      console.log('💰 Valores atuais:', {
        total, avista, parcCartao, entrada, parcBoleto, parcela, desconto, n
      });

      // Rotas por forma de pagamento
      if (forma === "À vista")  return this._calcAVistaInteligente(total, avista, quiet);
      if (forma === "Cartão")   return this._calcCartaoInteligente(total, parcela, n, desconto, quiet);
      if (forma === "Boleto")   return this._calcBoletoInteligente(total, entrada, parcela, n, desconto, quiet);
      
      console.log('⚠️ Forma de pagamento não reconhecida:', forma);
    } catch (e) {
      console.error('❌ Erro no recálculo:', e);
    }
  }

  /**
   * Cálculos para pagamento À vista
   */
  static _calcAVistaInteligente(total, avista, quiet) {
    console.log('💰 Calculando À Vista - total:', total, 'avista:', avista);
    
    // Se total preenchido mas à vista vazio, copia total para à vista
    if (total > 0 && avista === 0) {
      this._setCond("#avista", total, quiet);
    }
    // Se à vista preenchido mas total vazio, copia à vista para total
    else if (avista > 0 && total === 0) {
      this._setCond("#total", avista, quiet);
    }
  }

  /**
   * Cálculos para pagamento com Cartão
   */
  static _calcCartaoInteligente(total, parcela, n, desconto, quiet) {
    console.log('💳 Calculando Cartão - total:', total, 'parcela:', parcela, 'n:', n);
    
    // Cálculo básico: total = parcela * n
    if (total > 0 && parcela === 0 && n > 0) {
      console.log('→ Calculando parcela: total/n');
      this._setCond("#parcela", this._round2(total / n), quiet);
    } else if (parcela > 0 && total === 0 && n > 0) {
      console.log('→ Calculando total: parcela*n');
      this._setCond("#total", this._round2(parcela * n), quiet);
    } else if (total > 0 && n === 0 && parcela === 0) {
      console.log('→ Sugerindo 12 parcelas');
      this._setNumero("#nParcelas", 12, quiet);
      this._setCond("#parcela", this._round2(total / 12), quiet);
    }
  }

  /**
   * Cálculos para pagamento com Boleto
   */
  static _calcBoletoInteligente(total, entrada, parcela, n, desconto, quiet) {
    console.log('📄 Calculando Boleto - total:', total, 'entrada:', entrada, 'parcela:', parcela, 'n:', n);
    
    // Valor financiado = total - entrada
    const financiado = total - entrada;
    
    if (total > 0 && entrada >= 0 && parcela === 0 && n > 0) {
      // Calcular valor da parcela
      const valorParcela = financiado / n;
      this._setCond("#parcela", this._round2(valorParcela), quiet);
    } else if (total > 0 && entrada >= 0 && parcela > 0 && n === 0) {
      // Calcular número de parcelas
      const numParcelas = Math.ceil(financiado / parcela);
      this._setNumero("#nParcelas", numParcelas, quiet);
    }
  }

  /**
   * Define valor monetário em um campo se estiver vazio ou forçar
   */
  static _setCond(selector, valor, quiet) {
    const el = document.querySelector(selector);
    if (!el) {
      console.log('❌ Elemento não encontrado:', selector);
      return false;
    }
    
    const atual = parseBRL(el.value);
    const novo = this._round2(valor);
    
    console.log(`🎯 setCond ${selector}: atual=${atual}, novo=${novo}, quiet=${quiet}`);
    
    // Se quiet=true, só preenche se estiver vazio
    if (quiet && atual > 0) {
      console.log('→ Campo já preenchido, pulando');
      return false;
    }
    
    if (Math.abs(atual - novo) > 0.01) {
      el.value = fmtBRL(novo);
      console.log(`✅ Campo ${selector} atualizado para: ${el.value}`);
      return true;
    }
    
    return false;
  }

  /**
   * Define número em um campo
   */
  static _setNumero(selector, valor, quiet) {
    const el = document.querySelector(selector);
    if (!el) return false;
    
    const atual = parseInt(el.value) || 0;
    
    if (quiet && atual > 0) return false;
    
    if (atual !== valor) {
      el.value = valor;
      console.log(`✅ Campo ${selector} atualizado para: ${valor}`);
      return true;
    }
    
    return false;
  }

  /**
   * Obtém número de um campo
   */
  static _getNumero(selector) {
    const el = document.querySelector(selector);
    if (!el) return 0;
    return parseInt(el.value) || 0;
  }

  /**
   * Sanitiza dia do vencimento
   */
  static _sanitizeDia(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    
    let dia = parseInt(el.value) || 0;
    if (dia < 1) dia = 1;
    if (dia > 28) dia = 28;
    
    if (parseInt(el.value) !== dia) {
      el.value = dia;
    }
  }

  /**
   * Arredonda para 2 casas decimais
   */
  static _round2(n) {
    return Math.round((n || 0) * 100) / 100;
  }
}

// Exportar para o contexto global
if (typeof window !== 'undefined') {
  window.ContractCalculations = ContractCalculations;
  window.recalc = ContractCalculations.recalculate.bind(ContractCalculations);
  
  // Função de teste para debug
  window.testarCalculo = function() {
    console.log('🧪 TESTANDO SISTEMA DE CÁLCULO');
    
    // Verificar se elementos existem
    const forma = document.querySelector('#forma');
    const total = document.querySelector('#total');
    const parcelas = document.querySelector('#nParcelas');
    const parcela = document.querySelector('#parcela');
    
    if (!forma || !total || !parcelas || !parcela) {
      console.log('❌ Elementos não encontrados');
      return;
    }
    
    // Simular forma de pagamento cartão
    forma.value = 'Cartão';
    total.value = 'R$ 1.200,00';
    parcelas.value = '12';
    parcela.value = ''; // Limpar para forçar cálculo
    
    console.log('📋 Configurado: Cartão, Total=R$1.200, Parcelas=12');
    
    // Força recálculo
    ContractCalculations.recalculate(false);
    
    console.log('🔍 Resultado esperado: Parcela = R$ 100,00');
    console.log('🔍 Resultado obtido:', parcela.value);
  };
}

console.log("✅ Calculations compatível carregado com sucesso");