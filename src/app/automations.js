/* ==========================================================================
   GERADOR DE CONTRATOS – AUTOMAÇÕES (v2.4)
   Pedidos do Guilherme (2025-10-07):
   - Autoformato: CPF, Data, Telefone, CEP, Moeda
   - Normalização de nome
   - AutoScroll/Foco no 1º inválido ao exportar
   - Notificações de sucesso (salvou/gerou DOCX)
   - AutoSwitch de blocos por forma (À vista / Cartão / Boleto)
   - Sugestão de correção: CPF com 10 dígitos
   - CEP → Cidade/UF automático
   - Remover: idade automática, dia vencimento padrão, desconto 5%, cidade padrão, sync cloud
   ========================================================================== */

(function () {
  class SystemAutomations {
    static _initialized = false;
    static _saveTimer = null;
    static _SAVE_DELAY = 1200; // debounce do autosave
    static _notifyQueue = [];
    static _notifyActive = false;
    static _saveWrapped = false;

    // Fallbacks caso utils.js não esteja disponível (evita quebrar)
    static _parseBRL = (window.parseBRL || ((s) => {
      s = (String(s || "")).trim().replace(/R\$|\s|\./g, "").replace(",", ".");
      const n = Number(s);
      return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
    }));

    static _fmtBRL = (window.fmtBRL || ((n) => {
      n = Math.round((n || 0) * 100) / 100;
      if (n <= 0) return "";
      const val = n.toFixed(2).replace(".", ",");
      return n < 1 ? String(val) : `R$ ${val}`;
    }));

    static _maskCPF = (window.maskCPF || (v => {
      const d = String(v || "").replace(/\D+/g, "").slice(0, 11);
      if (d.length <= 3) return d;
      if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
      if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
      return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
    }));

    static _maskPhone = (window.maskPhone || (v => {
      const d = String(v || "").replace(/\D+/g, "").slice(0, 11);
      if (d.length <= 2) return d;
      if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
      if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
      return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    }));

    static _maskCEP = (window.maskCEP || (v => {
      const d = String(v || "").replace(/\D+/g, "").slice(0, 8);
      return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`;
    }));

    static _maskDate = (window.maskDate || (v => {
      const d = String(v || "").replace(/\D+/g, "").slice(0, 8);
      if (d.length <= 2) return d;
      if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
      return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
    }));

    static _titleCase = (window.titleCase || (s => {
      s = String(s || "").replace(/\s+/g, " ").trim();
      const SIGLAS = new Set(["CPF", "RG", "UF", "RA", "CEP", "CNH", "CS"]);
      const exc = new Set(["da", "de", "do", "das", "dos", "e"]);
      const words = s.toLowerCase().split(" ");
      return words.map((w, i) => {
        if (SIGLAS.has(w.toUpperCase())) return w.toUpperCase();
        if (i > 0 && exc.has(w)) return w;
        return w.charAt(0).toUpperCase() + w.slice(1);
      }).join(" ");
    }));

    static init() {
      if (this._initialized) return;
      this._initialized = true;
      console.log("🚀 Automations v2.4…");

      this.setupAutoSaveDebounced();
      this.setupFormatAutoCorrection();
      this.setupNameNormalization();
      this.setupExportGuard();
      this.setupSuccessHooks();
      this.setupFormaBlocks();
      this.setupGlobalErrorHandling();

      console.log("✅ Automations v2.4 prontas");
    }

    /* -------------------------------------------------------------------
       AutoCorreção de Formato (delegada)
       - CPF (#cpfResp, #cpfAluno)
       - Data (#data, #nascResp, #nascAluno)
       - Telefone (#telResp)
       - CEP (#cep) + auto Cidade/UF
       - Moeda (#total, #avista, #desconto, #parcela, #parcCartao, #entrada, #parcBoleto)
       ------------------------------------------------------------------- */
    static setupFormatAutoCorrection() {
      const moneyFields = new Set([
        "#total", "#avista", "#desconto", "#parcela",
        "#parcCartao", "#entrada", "#parcBoleto"
      ]);
      const cpfFields = new Set(["#cpfResp", "#cpfAluno"]);
      const dateFields = new Set(["#data", "#nascResp", "#nascAluno"]);
      const telFields = new Set(["#telResp"]);
      const cepFields = new Set(["#cep"]);

      // INPUT → aplica máscaras em tempo real
      document.addEventListener("input", (e) => {
        const el = e.target;
        if (!(el && el.matches("input,textarea,select"))) return;
        const idSel = el.id ? `#${el.id}` : "";

        try {
          if (cpfFields.has(idSel)) {
            el.value = this._maskCPF(el.value);
          } else if (dateFields.has(idSel)) {
            el.value = this._maskDate(el.value);
          } else if (telFields.has(idSel)) {
            el.value = this._maskPhone(el.value);
          } else if (cepFields.has(idSel)) {
            el.value = this._maskCEP(el.value);
          } else if (moneyFields.has(idSel)) {
            // apenas filtra caracteres; formata no BLUR para não atrapalhar digitação
            const raw = String(el.value || "").replace(/[^\d,\.R$\s]/g, "");
            el.value = raw;
          }
        } catch { /* silencioso para não travar fluxo */ }
      });

      // BLUR → normaliza formatos finais
      document.addEventListener("blur", (e) => {
        const el = e.target;
        if (!(el && el.matches("input,textarea,select"))) return;
        const idSel = el.id ? `#${el.id}` : "";

        try {
          if (cpfFields.has(idSel)) {
            const digits = String(el.value || "").replace(/\D+/g, "");
            if (digits.length === 10) {
              this.showErrorNotification("CPF incompleto: faltando 1 dígito.");
            }
            el.value = this._maskCPF(el.value);
          } else if (dateFields.has(idSel)) {
            el.value = this._maskDate(el.value);
          } else if (telFields.has(idSel)) {
            el.value = this._maskPhone(el.value);
          } else if (cepFields.has(idSel)) {
            el.value = this._maskCEP(el.value);
            this._autoFillCidadeUF(el.value); // ✨ preenche Cidade/UF
          } else if (moneyFields.has(idSel)) {
            const n = this._parseBRL(el.value);
            el.value = this._fmtBRL(n);
          } else if (idSel === "#cidadeUf") {
            // Normaliza para 'Cidade/UF' (ex: Aaaaaa/AA), UF sempre maiúsculo
            let val = String(el.value || "").trim();
            let [cidade, uf] = val.split("/");
            cidade = cidade ? this._titleCase(cidade.trim()) : "";
            uf = uf ? uf.trim().toUpperCase().slice(0, 2) : "";
            if (cidade && uf) {
              el.value = `${cidade}/${uf}`;
            } else if (cidade) {
              el.value = cidade;
            } else {
              el.value = "";
            }
          }
        } catch { /* evita quebrar UX por erro de máscara */ }
      }, true);

      console.log("✅ AutoCorreção de Formato configurada");
    }

    /* -------------------------------------------------------------------
       Normalização de nome (Title Case com preposições corretas)
       Aplica em: #nomeResp, #nomeAluno
       ------------------------------------------------------------------- */
    static setupNameNormalization() {
      const nameFields = new Set(["#nomeResp", "#nomeAluno"]);
      document.addEventListener("blur", (e) => {
        const el = e.target;
        if (!(el && el.matches("input,textarea"))) return;
        const idSel = el.id ? `#${el.id}` : "";
        if (!nameFields.has(idSel)) return;

        const original = String(el.value || "");
        const normalized = this._titleCase(original);
        if (normalized !== original) {
          el.value = normalized;
          el.classList.add("calculated");
          setTimeout(() => el.classList.remove("calculated"), 700);
        }
      }, true);

      console.log("✅ Normalização de nome configurada");
    }

    /* -------------------------------------------------------------------
       Guard de exportação: foca 1º campo inválido e impede export
       ------------------------------------------------------------------- */
    static setupExportGuard() {
      // Permite sobrescrever a lista via window.AUTOMATIONS_REQUIRED_FIELDS
      const defaultRequired = [
        { sel: "#contrato", label: "Contrato" },
        { sel: "#nomeResp", label: "Nome do Responsável" },
        { sel: "#cpfResp", label: "CPF do Responsável", validator: this.validateCPF, msg: "CPF inválido" },
        { sel: "#endereco", label: "Endereço" },
        { sel: "#curso", label: "Curso" },
        { sel: "#total", label: "Valor Total", validator: v => this._parseBRL(v) > 0, msg: "Informe um valor" },
        { sel: "#forma", label: "Forma de Pagamento" },
        { sel: "#modelo", label: "Modelo de Contrato" }
      ];

      const required = Array.isArray(window.AUTOMATIONS_REQUIRED_FIELDS)
        ? window.AUTOMATIONS_REQUIRED_FIELDS
        : defaultRequired;

      const validateAll = () => {
        for (const r of required) {
          const el = document.querySelector(r.sel);
          if (!el) continue;

          const v = (el.value || "").trim();
          let ok = !!v;
          if (ok && typeof r.validator === "function") ok = !!r.validator(v);

          el.classList.remove("valid", "invalid");
          el.classList.add(ok ? "valid" : "invalid");

          if (!ok) {
            this._focusWithScroll(el);
            const msg = r.msg || `${r.label} é obrigatório`;
            this._ensureErrorMsg(el, msg);
            this.showErrorNotification(msg);
            return false;
          }
        }
        return true;
      };

      // Intercepta o clique do DOCX **antes** da lógica padrão
      document.addEventListener("click", (e) => {
        const btn = e.target && e.target.closest && e.target.closest("#btnDocx");
        if (!btn) return;
        const ok = validateAll();
        if (!ok) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }, true);

      console.log("✅ Guard de exportação configurado");
    }

    static _focusWithScroll(el) {
      try { el.scrollIntoView({ behavior: "smooth", block: "center" }); } catch {}
      try { el.focus({ preventScroll: true }); } catch {}
    }

    static _ensureErrorMsg(el, text) {
      let err = el.parentElement?.querySelector?.(".error-message");
      if (!err) {
        err = document.createElement("div");
        err.className = "error-message";
        el.parentElement?.appendChild?.(err);
      }
      err.textContent = text;
    }

    /* -------------------------------------------------------------------
       Notificações de sucesso: após salvar e após gerar DOCX
       ------------------------------------------------------------------- */
    static setupSuccessHooks() {
      let lastSaveToast = 0;
      const successSave = () => {
        const now = Date.now();
        if (now - lastSaveToast > 5000) {
          this.showSuccessNotification("💾 Dados salvos automaticamente");
          lastSaveToast = now;
        }
      };

      // Wrap do saveFormData para disparar toast (apenas 1x)
      if (!this._saveWrapped) {
        const origSave = this.saveFormData.bind(this);
        this.saveFormData = () => { origSave(); successSave(); };
        this._saveWrapped = true;
      }

      // Hook no ContractExports.preencherTemplateDOCX para sucesso
      const tryHook = () => {
        if (window.ContractExports &&
            typeof ContractExports.preencherTemplateDOCX === "function" &&
            !ContractExports.__wrappedSuccess) {

          const orig = ContractExports.preencherTemplateDOCX.bind(ContractExports);
          ContractExports.preencherTemplateDOCX = async (...args) => {
            const res = await orig(...args);
            this.showSuccessNotification("✅ Contrato gerado com sucesso");
            return res;
          };
          ContractExports.__wrappedSuccess = true;
          console.log("✅ Hook de sucesso no preencherTemplateDOCX ativo");
        }
      };

      tryHook();
      setTimeout(tryHook, 1000);
    }

    /* -------------------------------------------------------------------
       AutoSwitch de blocos por forma (UI visual)
       Suporta:
       - IDs: #blocoAvista, #blocoCartao, #blocoBoleto
       - Ou elementos com [data-forma="À vista|Cartão|Boleto"]
       ------------------------------------------------------------------- */
    static setupFormaBlocks() {
      const forma = document.querySelector("#forma");
      const update = () => {
        const val = (forma?.value || "").trim();
        const blocks = [
          { sel: "#blocoAvista", want: "À vista" },
          { sel: "#blocoCartao", want: "Cartão" },
          { sel: "#blocoBoleto", want: "Boleto" },
        ];

        blocks.forEach(b => {
          const el = document.querySelector(b.sel);
          if (el) el.style.display = (val === b.want) ? "" : "none";
        });

        document.querySelectorAll("[data-forma]").forEach(el => {
          const want = el.getAttribute("data-forma");
          el.style.display = (want === val) ? "" : "none";
        });
      };

      if (forma) {
        forma.addEventListener("change", update);
        update();
      }

      console.log("✅ AutoSwitch de blocos por forma configurado");
    }

    /* -------------------------------------------------------------------
       AutoSave com debounce (localStorage)
       ------------------------------------------------------------------- */
    static setupAutoSaveDebounced() {
      const handler = () => {
        clearTimeout(this._saveTimer);
        this._saveTimer = setTimeout(() => this.saveFormData(), this._SAVE_DELAY);
      };
      document.addEventListener("input", (e) => {
        const el = e.target;
        if (el && el.matches("input,select,textarea")) handler();
      });
      window.addEventListener("beforeunload", () => {
        try { this.saveFormData(); } catch {}
      });
      console.log("✅ AutoSave (debounce) configurado");
    }

    static saveFormData() {
      try {
        const data = {};
        document.querySelectorAll("input,select,textarea").forEach(el => {
          if (el.id) data[el.id] = el.value ?? "";
        });
        localStorage.setItem("gerador_contratos_backup", JSON.stringify(data));
        console.log("💾 Dados salvos");
      } catch (err) {
        console.warn("⚠️ Falha ao salvar dados:", err);
      }
    }

    /* -------------------- Validações auxiliares ------------------------ */
    static validateCPF(cpf) {
      cpf = String(cpf || "").replace(/\D+/g, "");
      if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

      let sum = 0;
      for (let i = 0; i < 9; i++) sum += +cpf[i] * (10 - i);
      let rest = 11 - (sum % 11);
      const d1 = rest >= 10 ? 0 : rest;
      if (d1 !== +cpf[9]) return false;

      sum = 0;
      for (let i = 0; i < 10; i++) sum += +cpf[i] * (11 - i);
      rest = 11 - (sum % 11);
      const d2 = rest >= 10 ? 0 : rest;
      return d2 === +cpf[10];
    }

    /* --------------------- Auto preenchimento Cidade/UF pelo CEP ------- */
    /* --------------------- Auto preenchimento Cidade/UF pelo CEP ------- */
    static _autoFillCidadeUF(rawCEP) {
      try {
        const digits = String(rawCEP || "").replace(/\D+/g, "");
        if (digits.length !== 8) return; // só tenta se tiver 8 dígitos

        const cidadeUfInput = document.querySelector("#cidadeUf");
        if (!cidadeUfInput) return;
        if ((cidadeUfInput.value || "").trim()) return; // não sobrescreve se já tiver valor

        // 🔧 MODO OFFLINE:
        // - Se quiser desligar totalmente o ViaCEP, defina:
        //   window.AUTOMATIONS_DISABLE_VIACEP = true;
        // - Se o navegador estiver offline, também não tenta buscar.
        if (window.AUTOMATIONS_DISABLE_VIACEP) {
          console.log("🌐 ViaCEP desativado por configuração (AUTOMATIONS_DISABLE_VIACEP=true)");
          return;
        }
        if (typeof navigator !== "undefined" && navigator && navigator.onLine === false) {
          console.log("🌐 Offline: pulando chamada ao ViaCEP");
          return;
        }

        fetch(`https://viacep.com.br/ws/${digits}/json/`)
          .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
          .then((data) => {
            if (!data || data.erro) return;
            const cidade = data.localidade || "";
            let uf = data.uf || "";
            uf = uf.toUpperCase(); // reforça maiúscula
            if (!cidade || !uf) return;

            const formattedCidade = this._titleCase(cidade);
            cidadeUfInput.value = `${formattedCidade}/${uf}`;
            // dispara input e blur para garantir validação
            cidadeUfInput.dispatchEvent(new Event("input", { bubbles: true }));
            cidadeUfInput.dispatchEvent(new Event("blur", { bubbles: true }));
          })
          .catch((err) => {
            console.warn("⚠️ Falha ao buscar CEP no ViaCEP:", err);
          });
      } catch (err) {
        console.warn("⚠️ Erro ao tentar auto preencher cidade/UF:", err);
      }
    }

    /* --------------------- Notificações (erro/sucesso) ---------------- */
    static showErrorNotification(message) {
      this._enqueueToast(String(message || "Erro"), false);
    }

    static showSuccessNotification(message) {
      this._enqueueToast(String(message || "Sucesso"), true);
    }

    static _enqueueToast(text, success) {
      this._notifyQueue.push({ text, success });
      if (!this._notifyActive) this._flushNotifications();
    }

    static async _flushNotifications() {
      if (this._notifyActive) return;
      this._notifyActive = true;
      while (this._notifyQueue.length) {
        const n = this._notifyQueue.shift();
        await this._showToast(n.text, n.success);
      }
      this._notifyActive = false;
    }

    static _showToast(text, success) {
      return new Promise((resolve) => {
        const box = document.createElement("div");
        box.style.cssText = `
          position:fixed; top:20px; right:20px; z-index:10000; 
          max-width:340px; padding:12px 14px; border-radius:10px;
          box-shadow:0 10px 30px rgba(0,0,0,.25);
          display:flex; gap:8px; align-items:flex-start;
          color:#fff; background:${success ? "#16a34a" : "#ef4444"};
          animation: slideInRight .25s ease-out;
        `;
        box.innerHTML = `<div style="font-weight:700">${success ? "Sucesso" : "Erro"}</div><div style="flex:1">${text}</div>`;
        document.body.appendChild(box);
        setTimeout(() => {
          box.style.opacity = "0";
          box.style.transform = "translateX(20px)";
          setTimeout(() => { box.remove(); resolve(); }, 220);
        }, 4200);
      });
    }

    /* --------------------- Erros globais ------------------------------ */
    static setupGlobalErrorHandling() {
      window.addEventListener("error", (e) => {
        const msg = (e?.error?.message) || (e?.message) || "Erro desconhecido";
        console.error("❌ Erro capturado:", e?.error || e);
        this.showErrorNotification(`Ocorreu um erro no sistema: ${msg}`);
      });

      // checagem de libs de template (não interrompe fluxo)
      setTimeout(() => {
        if (typeof window.PizZip === "undefined" || typeof window.Docxtemplater === "undefined") {
          console.warn("⚠️ PizZip/Docxtemplater não carregados ainda.");
        }
      }, 2500);
    }
  }

  // Boot seguro
  const boot = () => SystemAutomations.init();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (window.requestIdleCallback) requestIdleCallback(boot, { timeout: 800 });
      else setTimeout(boot, 0);
    });
  } else {
    boot();
  }

  window.SystemAutomations = SystemAutomations;
})();
