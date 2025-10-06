/* ==========================================================================
   GERADOR DE CONTRATOS - CÁLCULOS FINANCEIROS
   Versão compatível - sem métodos privados
   ========================================================================== */

// ===== helpers numéricos consistentes com utils.js =====
const TOL = 0.01;
const _parse = (s) => {
  s = (s || "").trim(); if (!s) return 0;
  s = s.replace(/R\$|\s|\./g, "").replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
};
const _fmt = (v) => {
  v = Math.round((v || 0) * 100) / 100;
  if (v <= 0) return "";
  return v < 1 ? v.toFixed(2).replace(".", ",") : `R$ ${v.toFixed(2).replace(".", ",")}`;
};
/** só escreve se não for "locked" pelo usuário, ou se quiet=false */
function _setMoneyCond(id, valor, quiet) {
  const el = document.querySelector(id); if (!el) return false;
  if (el.dataset.locked === "1" && quiet) return false; // respeita lock no modo auto
  const novo = _fmt(valor);
  const atual = (el.value || "").trim();
  if (!atual) { el.value = novo; return true; }
  const atualNum = _parse(atual);
  if (Math.abs(atualNum - valor) > TOL) { el.value = novo; return true; }
  return false;
}
function _sanitizeIntIn(el, min, max) {
  if (!el) return 0;
  const d = (el.value || "").replace(/\D+/g, "");
  const n = d ? Math.max(min, Math.min(+d, max)) : 0;
  if (n) el.value = String(n);
  return n;
}
function _sanitizeDia(el) {
  if (!el) return;
  const d = (el.value || "").replace(/\D+/g, "");
  if (!d) return;
  const v = Math.max(1, Math.min(+d, 28));
  el.value = String(v).padStart(2, "0");
}

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
    // respeita auto-calc
    const auto = document.querySelector("#auto");
    if (auto && !auto.checked && quiet) return;

    const forma = (get("#forma") || "").trim();

    const elN   = document.querySelector("#nParcelas");
    const elDia = document.querySelector("#diaVenc");
    const n = _sanitizeIntIn(elN, 1, 36);
    _sanitizeDia(elDia);

    // valores
  const total      = _parse(get("#total"));
  const avista     = _parse(get("#avista"));
  const parcela    = _parse(get("#parcela")); // Campo unificado para cartao/boleto
  const entrada    = _parse(get("#entrada"));

    // À vista: manter simetria total ↔ avista
    if (forma === "À vista") {
      if (total > 0) {
        const changed = _setMoneyCond("#avista", total, quiet);
        if (changed) emitCalc("valorAtualizado", {campo:"#avista", origem:"auto", formula:"à vista = total"});
        return;
      }
      if (avista > 0 && total === 0) {
        const changed = _setMoneyCond("#total", avista, quiet);
        if (changed) emitCalc("valorAtualizado", {campo:"#total", origem:"auto", formula:"total = à vista"});
        return;
      }
      return;
    }

    // Cartão: TOTAL = parcela * n
    if (forma === "Cartão") {
      if (n < 1) return;

      // se usuário travou a parcela, sugira total
      if (parcela > 0 && (document.querySelector("#parcela")?.dataset.locked === "1")) {
        const sugerido = Math.round(parcela * n * 100) / 100;
        if (!_setMoneyCond("#total", sugerido, true)) {
          // não escrevi pois estava lockado → apenas sugiro
          showCalcHint(document.querySelector("#total"), `Sugestão: Total = ${_fmt(sugerido)} ( ${n} × parcela )`);
          emitCalc("sugestao", {campo:"#total", valor:sugerido, de:`${n}×parcela`});
        } else {
          emitCalc("valorAtualizado", {campo:"#total", origem:"auto", formula:`${n}×parcela`});
        }
        return;
      }

      // caso geral
      if (parcela > 0 && total > 0) {
        const esperado = Math.round(parcela * n * 100) / 100;
        if (Math.abs(total - esperado) > TOL) {
          const nova = Math.round((total / n) * 100) / 100;
          const changed = _setMoneyCond("#parcela", nova, false);
          if (changed) emitCalc("valorAtualizado", {campo:"#parcela", origem:"auto", formula:"total/n"});
        }
        return;
      }
      if (parcela > 0 && total === 0) {
        const val = Math.round(parcela * n * 100) / 100;
        const changed = _setMoneyCond("#total", val, quiet);
        if (changed) emitCalc("valorAtualizado", {campo:"#total", origem:"auto", formula:`${n}×parcela`});
        return;
      }
  if (total > 0 && parcela === 0) {
        const p = Math.round((total / n) * 100) / 100;
  const changed = _setMoneyCond("#parcela", p, quiet);
  if (changed) emitCalc("valorAtualizado", {campo:"#parcela", origem:"auto", formula:"total/n"});
      }
      return;
    }

    // Boleto: TOTAL = ENTRADA + PARC * n
    if (forma === "Boleto") {
      if (n < 1) return;

  const temTotal = total > 0, temEnt = entrada > 0, temParc = parcela > 0;

      // Campo de parcela travado → sugerir entrada/total
  if (temParc && document.querySelector("#parcela")?.dataset.locked === "1") {
        if (temTotal && !temEnt) {
          const ent = Math.max(total - parcela * n, 0);
          if (!_setMoneyCond("#entrada", ent, true)) {
            showCalcHint(document.querySelector("#entrada"), `Sugestão: Entrada = ${_fmt(ent)} ( total - n×parcela )`);
            emitCalc("sugestao", {campo:"#entrada", valor:ent, de:"total - n×parcela"});
          } else {
            emitCalc("valorAtualizado", {campo:"#entrada", origem:"auto", formula:"total - n×parcela"});
          }
          return;
        }
        if (temEnt && !temTotal) {
          const tot = Math.round((entrada + parcela * n) * 100) / 100;
          if (!_setMoneyCond("#total", tot, true)) {
            showCalcHint(document.querySelector("#total"), `Sugestão: Total = ${_fmt(tot)} ( entrada + n×parcela )`);
            emitCalc("sugestao", {campo:"#total", valor:tot, de:"entrada + n×parcela"});
          } else {
            emitCalc("valorAtualizado", {campo:"#total", origem:"auto", formula:"entrada + n×parcela"});
          }
          return;
        }
      }

      if (temEnt && temParc && !temTotal) {
  const val = Math.round((entrada + parcela * n) * 100) / 100;
        const changed = _setMoneyCond("#total", val, quiet);
        if (changed) emitCalc("valorAtualizado", {campo:"#total", origem:"auto", formula:"entrada + n×parcela"});
        return;
      }
      if (temTotal && temEnt && !temParc) {
        const rest = Math.max(total - entrada, 0);
        const p = Math.round((rest / n) * 100) / 100;
  const changed = _setMoneyCond("#parcela", p, quiet);
  if (changed) emitCalc("valorAtualizado", {campo:"#parcela", origem:"auto", formula:"(total-entrada)/n"});
        return;
      }
      if (temTotal && temParc && !temEnt) {
  const ent = Math.max(total - parcela * n, 0);
        const changed = _setMoneyCond("#entrada", ent, quiet);
        if (changed) emitCalc("valorAtualizado", {campo:"#entrada", origem:"auto", formula:"total - n×parcela"});
        return;
      }
      if (temTotal && temEnt && temParc) {
  const esperado = Math.round((entrada + parcela * n) * 100) / 100;
        if (Math.abs(total - esperado) > TOL) {
          const nova = Math.round(((total - entrada) / n) * 100) / 100;
          const changed = _setMoneyCond("#parcela", nova, false);
          if (changed) emitCalc("valorAtualizado", {campo:"#parcela", origem:"auto", formula:"(total-entrada)/n"});
        }
        _setMoneyCond("#entrada", entrada, quiet);
      }
      return;
    }
  }

  static calculateDiscount() {
    const total   = _parse(get("#total"));
    const avista  = _parse(get("#avista"));
    let desconto  = _parse(get("#desconto"));

    let base = total;
    if (desconto <= 0 && total > 0 && avista > 0 && avista < total) {
      desconto = Math.max(total - avista, 0);
      base = avista;
      emitCalc("descontoInferido", {de:"avista", desconto});
    }

    const percentual = total > 0 ? +((desconto / total) * 100).toFixed(2) : 0;
    return { percentual, valor: base, desconto };
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
   * Cálculos para pagamento com Cartão (sem desconto)
   */
  static _calcCartaoInteligente(total, parcela, n, desconto, quiet) {
    console.log('💳 Calculando Cartão - total:', total, 'parcela:', parcela, 'n:', n, '(desconto ignorado)');
    
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