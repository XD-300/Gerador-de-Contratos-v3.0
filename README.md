# 🎯 Gerador de Contratos v2.1

Sistema profissional para geração de contratos educacionais com cálculo automático, templates personalizáveis e exportação em múltiplos formatos.

## 📁 Estrutura do Projeto

```
📦 Gerador JAVA/
├── 📄 index.html                    # Sistema principal
├── 📄 index-offline.html           # Versão offline
├── 📄 download-libs.bat            # Script para bibliotecas
├── 📄 README.md                    # Este arquivo
│
├── 📂 src/                         # Código fonte
│   ├── 📂 core/                    # Módulos JavaScript principais
│   │   ├── 📄 utils.js             # Utilitários e validações
│   │   ├── 📄 calculations.js      # Sistema de cálculos
│   │   ├── 📄 exports.js          # Exportação (PDF/DOCX/JSON)
│   │   ├── 📄 main.js             # Aplicação principal
│   │   └── 📄 python-examples.js  # Exemplos de integração Python
│   │
│   └── 📂 styles/                  # Folhas de estilo
│       └── 📄 styles.css          # CSS principal
│
├── 📂 tests/                      # Arquivos de teste
│   ├── 📄 teste-templates.html    # Teste do sistema de templates
│   ├── 📄 teste-final-sistema.html # Teste completo
│   └── 📄 teste-download-docx.html # Teste de download DOCX
│
├── 📂 docs/                       # Documentação
│   ├── 📄 GUIA_COMPLETO.md        # Guia completo do sistema
│   ├── 📄 MOBILE_GUIDE.md         # Guia para uso mobile
│   └── 📄 PUBLICACAO_ONLINE.md    # Guia de publicação
│
├── 📂 templates/                  # Templates de exemplo
│   └── 📄 Template_Teste_Exemplo.docx # Template exemplo
│
├── 📂 examples/                   # Arquivos de exemplo
│   └── 📄 Lista_Placeholders_Teste.txt # Lista de placeholders
│
└── 📂 libs/                      # Bibliotecas locais (se necessário)
```

## 🚀 Como Usar

### **Sistema Principal:**
1. Abra `index.html` no navegador
2. Preencha os dados do contrato
3. Use o sistema de templates ou exportação direta

### **Testes:**
1. **Teste Completo:** `tests/teste-final-sistema.html`
2. **Teste Templates:** `tests/teste-templates.html`
3. **Teste Download:** `tests/teste-download-docx.html`

### **Documentação:**
- **Guia Completo:** `docs/GUIA_COMPLETO.md`
- **Mobile:** `docs/MOBILE_GUIDE.md`
- **Publicação:** `docs/PUBLICACAO_ONLINE.md`

## ⭐ Funcionalidades

### **📋 Geração de Contratos**
- ✅ Formulários inteligentes com validação
- ✅ Cálculo automático de valores financeiros
- ✅ Sistema de máscaras e formatação
- ✅ Múltiplas formas de pagamento

### **📄 Sistema de Templates**
- ✅ Upload de templates DOCX personalizados
- ✅ Placeholders automáticos `{{CAMPO}}`
- ✅ Substituição inteligente de dados
- ✅ Templates de exemplo incluídos

### **💾 Exportação Avançada**
- ✅ **PDF:** Documentos formatados profissionalmente
- ✅ **DOCX:** Templates personalizáveis
- ✅ **JSON:** Dados estruturados para integração

### **🎨 Interface Profissional**
- ✅ Design responsivo para mobile/desktop
- ✅ Tema escuro moderno
- ✅ Atalhos de teclado
- ✅ Validação em tempo real

### **🧪 Sistema de Testes**
- ✅ Testes automatizados de funcionalidades
- ✅ Diagnóstico de dependências
- ✅ Relatórios detalhados de status

## 🔧 Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Bibliotecas:** jsPDF 2.5.1, docx 7.8.2
- **Compatibilidade:** Navegadores modernos
- **Responsividade:** Mobile-first design

## 📱 Compatibilidade

### **Desktop:**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### **Mobile:**
- ✅ iOS Safari 14+
- ✅ Chrome Mobile 90+
- ✅ Samsung Internet 13+

## 🎯 Versões

- **v2.1** - Sistema de templates DOCX + Estrutura organizada
- **v2.0** - Sistema modular + Funcionalidades completas
- **v1.x** - Versão base com funcionalidades básicas

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação em `docs/`
2. Execute os testes em `tests/`
3. Verifique a estrutura de arquivos

---

**Desenvolvido com ❤️ para facilitar a geração de contratos educacionais**