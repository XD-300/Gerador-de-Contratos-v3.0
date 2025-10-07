/* ==========================================================================
   MELHORIAS DE AUTOMAÇÃO - SISTEMA COMPLEMENTAR
   Automações adicionais para completar o sistema
   ========================================================================== */

class SystemAutomations {
  static init() {
    console.log('🚀 Inicializando automações complementares...');
    
    this.setupAutoValidation();
    this.setupAutoSave();
    this.setupSmartDefaults();
    this.setupAdvancedCalculations();
    this.setupErrorHandling();
    
    console.log('✅ Automações complementares inicializadas');
  }

  /**
   * Sistema de validação automática
   */
  static setupAutoValidation() {
    // Validação em tempo real para CPF
    const cpfFields = ['#cpfResp', '#cpfAluno'];
    cpfFields.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.addEventListener('blur', (e) => {
          const isValid = this.validateCPF(e.target.value);
          this.showValidationFeedback(element, isValid, 'CPF inválido');
        });
      }
    });

    // Validação de email (se houver campo)
    const emailField = document.querySelector('#email');
    if (emailField) {
      emailField.addEventListener('blur', (e) => {
        const isValid = this.validateEmail(e.target.value);
        this.showValidationFeedback(emailField, isValid, 'Email inválido');
      });
    }

    // Validação de datas
    const dateFields = ['#nascResp', '#nascAluno', '#data'];
    dateFields.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.addEventListener('blur', (e) => {
          const isValid = this.validateDate(e.target.value);
          this.showValidationFeedback(element, isValid, 'Data inválida');
        });
      }
    });

    console.log('✅ Validação automática configurada');
  }

  /**
   * Sistema de salvamento automático
   */
  static setupAutoSave() {
    let autoSaveTimeout;
    
    // Selecionar todos os inputs do formulário
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        // Limpar timeout anterior
        clearTimeout(autoSaveTimeout);
        
        // Configurar novo salvamento em 2 segundos
        autoSaveTimeout = setTimeout(() => {
          this.saveFormData();
        }, 2000);
      });
    });

    // Salvar ao sair da página
    window.addEventListener('beforeunload', () => {
      this.saveFormData();
    });

    console.log('✅ Salvamento automático configurado');
  }

  /**
   * Sistema de valores padrão inteligentes
   */
  static setupSmartDefaults() {
    // Auto-gerar número do contrato
    const contratoField = document.querySelector('#contrato');
    if (contratoField && !contratoField.value) {
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 999) + 1;
      contratoField.value = `${String(random).padStart(3, '0')}/${year}`;
      console.log('📝 Número do contrato gerado automaticamente');
    }

    // Auto-preencher dia de vencimento padrão (5)
    const diaVencField = document.querySelector('#diaVenc');
    if (diaVencField && !diaVencField.value) {
      diaVencField.value = '5';
    }

    // Auto-selecionar modelo mais comum
    const modeloField = document.querySelector('#modelo');
    if (modeloField && !modeloField.value) {
      modeloField.value = 'Contrato_EJA';
    }

    console.log('✅ Valores padrão inteligentes configurados');
  }

  /**
   * Cálculos avançados adicionais
   */
  static setupAdvancedCalculations() {
    // Cálculo de idade automático
    const nascRespField = document.querySelector('#nascResp');
    if (nascRespField) {
      nascRespField.addEventListener('blur', () => {
        const age = this.calculateAge(nascRespField.value);
        if (age > 0) {
          console.log(`👤 Idade do responsável: ${age} anos`);
        }
      });
    }

    // Cálculo de desconto automático (5% para pagamento à vista)
    const formaField = document.querySelector('#forma');
    if (formaField) {
      formaField.addEventListener('change', () => {
        if (formaField.value === 'À vista') {
          this.applyDiscountForCashPayment();
        }
      });
    }

    console.log('✅ Cálculos avançados configurados');
  }

  /**
   * Sistema de tratamento de erros
   */
  static setupErrorHandling() {
    // Capturar erros de JavaScript
    window.addEventListener('error', (e) => {
      console.error('❌ Erro capturado:', e.error);
      this.showErrorNotification('Ocorreu um erro no sistema. Verifique os dados e tente novamente.');
    });

    // Verificar bibliotecas essenciais
    setTimeout(() => {
      if (typeof PizZip === 'undefined' || typeof Docxtemplater === 'undefined') {
        this.showErrorNotification('⚠️ Bibliotecas de template não carregaram. Algumas funcionalidades podem não funcionar.');
      }
    }, 3000);

    console.log('✅ Tratamento de erros configurado');
  }

  // === MÉTODOS AUXILIARES ===

  /**
   * Valida CPF brasileiro
   */
  static validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let check = 11 - (sum % 11);
    if (check === 10 || check === 11) check = 0;
    if (check !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    check = 11 - (sum % 11);
    if (check === 10 || check === 11) check = 0;
    
    return check === parseInt(cpf.charAt(10));
  }

  /**
   * Valida email
   */
  static validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Valida data brasileira
   */
  static validateDate(dateStr) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateStr.match(regex);
    
    if (!match) return false;
    
    const day = parseInt(match[1]);
    const month = parseInt(match[2]);
    const year = parseInt(match[3]);
    
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
  }

  /**
   * Calcula idade
   */
  static calculateAge(birthDate) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = birthDate.match(regex);
    
    if (!match) return 0;
    
    const day = parseInt(match[1]);
    const month = parseInt(match[2]);
    const year = parseInt(match[3]);
    
    const birth = new Date(year, month - 1, day);
    const today = new Date();
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Aplica desconto para pagamento à vista
   */
  static applyDiscountForCashPayment() {
    const totalField = document.querySelector('#total');
    const descontoField = document.querySelector('#desconto');
    
    if (totalField && descontoField && totalField.value && !descontoField.value) {
      const total = parseFloat(totalField.value.replace(/[R$\s\.]/g, '').replace(',', '.'));
      if (total > 0) {
        const discount = total * 0.05; // 5% de desconto
        descontoField.value = `R$ ${discount.toFixed(2).replace('.', ',')}`;
        console.log('💰 Desconto de 5% aplicado automaticamente');
      }
    }
  }

  /**
   * Salva dados do formulário no localStorage
   */
  static saveFormData() {
    const formData = {};
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      if (input.id) {
        formData[input.id] = input.value;
      }
    });
    
    localStorage.setItem('gerador_contratos_backup', JSON.stringify(formData));
    console.log('💾 Dados salvos automaticamente');
  }

  /**
   * Mostra feedback de validação
   */
  static showValidationFeedback(element, isValid, errorMessage) {
    // Remove classes anteriores
    element.classList.remove('valid', 'invalid');
    
    // Adiciona classe baseada na validação
    element.classList.add(isValid ? 'valid' : 'invalid');
    
    // Mostra/remove mensagem de erro
    let errorDiv = element.parentNode.querySelector('.error-message');
    
    if (!isValid) {
      if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        element.parentNode.appendChild(errorDiv);
      }
      errorDiv.textContent = errorMessage;
    } else if (errorDiv) {
      errorDiv.remove();
    }
  }

  /**
   * Mostra notificação de erro
   */
  static showErrorNotification(message) {
    // Criar ou atualizar div de notificação
    let notification = document.querySelector('.error-notification');
    
    if (!notification) {
      notification = document.createElement('div');
      notification.className = 'error-notification';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 15px;
        border-radius: 8px;
        z-index: 10000;
        max-width: 300px;
      `;
      document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    
    // Remover após 5 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }
}

// Auto-inicializar quando DOM carregar
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    SystemAutomations.init();
  }, 1000);
});

// Exportar para contexto global
window.SystemAutomations = SystemAutomations;