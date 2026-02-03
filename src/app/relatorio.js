// relatorio.js - Utilitário de relatório de diagnóstico/exportação para SPA
// Versão corrigida e unificada

class Relatorio {
  constructor(titulo) {
    this.titulo = titulo;
    this.etapas = [];
    this.envInfo = null;
    this.anexos = [];
    this.metrics = {};
    this.status = 'iniciado';
    this.errors = [];
    this.result = null;
    this._start = performance.now();
  }
  
  static create(titulo) { 
    return new Relatorio(titulo); 
  }
  
  env(fn) { 
    this.envInfo = (typeof fn === 'function' ? fn() : fn); 
    return this; 
  }
  
  check(nome, ok, info) {
    this.etapas.push({ tipo: 'check', nome, ok, info });
    return this;
  }
  
  attach(nome, obj) {
    this.anexos.push({ nome, obj });
    return this;
  }
  
  metric(nome, valor, unidade) {
    this.metrics[nome] = unidade ? `${valor} ${unidade}` : valor;
    return this;
  }
  
  ok(msg) {
    this.etapas.push({ tipo: 'ok', msg });
    return this;
  }
  
  error(e) {
    this.errors.push(e);
    this.etapas.push({ tipo: 'erro', erro: e });
    return this;
  }
  
  async run(nome, fn) {
    const t0 = performance.now();
    try {
      await fn();
      this.etapas.push({ 
        tipo: 'run', 
        nome, 
        ok: true, 
        tempo: Math.round(performance.now() - t0) 
      });
    } catch (e) {
      this.etapas.push({ 
        tipo: 'run', 
        nome, 
        ok: false, 
        erro: e, 
        tempo: Math.round(performance.now() - t0) 
      });
      this.errors.push(e);
      throw e;
    }
    return this;
  }
  
  end(status) {
    this.status = status;
    this.result = {
      titulo: this.titulo,
      status: this.status,
      env: this.envInfo,
      etapas: this.etapas,
      anexos: this.anexos,
      metrics: this.metrics,
      errors: this.errors,
      tempo_total: Math.round(performance.now() - this._start)
    };
    return this;
  }
  
  toConsole() {
    const r = this.result || this.end(this.status).result;
    console.groupCollapsed(
      `%c${r.titulo} [%c${r.status}%c]`, 
      'font-weight:bold', 
      r.status === 'concluido' ? 'color:green' : 'color:red', 
      'color:inherit'
    );
    
    if (r.env) console.log('🌐 Ambiente:', r.env);
    
    r.etapas.forEach(e => {
      if (e.tipo === 'check') {
        console.log(
          `✔️ Check: %c${e.nome}%c: %c${e.ok ? 'OK' : 'FAIL'}`, 
          'font-weight:bold', 
          '', 
          `color:${e.ok ? 'green' : 'red'}`,
          e.info || ''
        );
      }
      if (e.tipo === 'run') {
        console.log(
          `▶️ Etapa: %c${e.nome}%c: %c${e.ok ? 'OK' : 'FAIL'}%c (${e.tempo}ms)`, 
          'font-weight:bold', 
          '', 
          `color:${e.ok ? 'green' : 'red'}`, 
          '',
          e.erro || ''
        );
      }
      if (e.tipo === 'ok') console.log('✅', e.msg);
      if (e.tipo === 'erro') console.error('❌', e.erro);
    });
    
    if (r.metrics && Object.keys(r.metrics).length) {
      console.log('📏 Métricas:', r.metrics);
    }
    
    if (r.anexos && r.anexos.length) {
      r.anexos.forEach(a => console.log('📎', a.nome, a.obj));
    }
    
    if (r.errors && r.errors.length) {
      console.error('🛑 Erros:', r.errors);
    }
    
    console.log('⏱️ Tempo total:', r.tempo_total + 'ms');
    console.groupEnd();
    return this;
  }
  
  downloadTXT(nome) {
    const r = this.result || this.end(this.status).result;
    let txt = `Relatório: ${r.titulo}\nStatus: ${r.status}\n`;
    
    if (r.env) txt += `\nAmbiente: ${JSON.stringify(r.env, null, 2)}\n`;
    
    r.etapas.forEach(e => {
      if (e.tipo === 'check') {
        txt += `✔️ Check: ${e.nome}: ${e.ok ? 'OK' : 'FAIL'} ${e.info || ''}\n`;
      }
      if (e.tipo === 'run') {
        txt += `▶️ Etapa: ${e.nome}: ${e.ok ? 'OK' : 'FAIL'} (${e.tempo}ms) ${e.erro || ''}\n`;
      }
      if (e.tipo === 'ok') txt += `✅ ${e.msg}\n`;
      if (e.tipo === 'erro') txt += `❌ ${e.erro}\n`;
    });
    
    if (r.metrics && Object.keys(r.metrics).length) {
      txt += '\nMétricas:\n' + JSON.stringify(r.metrics, null, 2) + '\n';
    }
    
    if (r.anexos && r.anexos.length) {
      r.anexos.forEach(a => txt += `📎 ${a.nome}: ${JSON.stringify(a.obj, null, 2)}\n`);
    }
    
    if (r.errors && r.errors.length) {
      txt += '\n🛑 Erros:\n' + r.errors.map(e => e.toString()).join('\n') + '\n';
    }
    
    txt += `\n⏱️ Tempo total: ${r.tempo_total}ms\n`;
    
    const blob = new Blob([txt], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nome || 'relatorio.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 100);
    return this;
  }
  
  downloadJSON(nome) {
    const r = this.result || this.end(this.status).result;
    const blob = new Blob([JSON.stringify(r, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nome || 'relatorio.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 100);
    return this;
  }
}

// Exportação para uso global
if (typeof window !== 'undefined') {
  window.Relatorio = Relatorio;
}

// Para Node.js (se necessário)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Relatorio;
}