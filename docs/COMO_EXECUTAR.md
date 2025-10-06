# 🚀 Como Executar o Sistema de Contratos

## ⚠️ **Problema Comum: "Não está gerando DOCX"**

### **CAUSA PRINCIPAL:**
O navegador bloqueia o carregamento automático de arquivos quando você abre o `index.html` **diretamente** do explorador de arquivos (protocolo `file://`).

## ✅ **SOLUÇÕES (Escolha uma):**

### **OPÇÃO 1: Servidor Local (RECOMENDADO)**
Execute um servidor web local:

#### **Python (mais simples):**
```bash
# Abra terminal na pasta do projeto
cd "u:\GUILHERME\Desktop\Gerador JAVA"

# Python 3
python -m http.server 8000

# Ou Python 2
python -m SimpleHTTPServer 8000
```
Depois acesse: `http://localhost:8000`

#### **Node.js:**
```bash
# Instalar servidor global
npm install -g http-server

# Executar na pasta do projeto
http-server -p 8000
```

#### **PHP:**
```bash
php -S localhost:8000
```

### **OPÇÃO 2: Upload Manual (Funciona sempre)**
1. Abra o `index.html` normalmente
2. Role até "Sistema de Templates DOCX"
3. Clique em "Escolher arquivo"
4. Selecione seu template `.docx`
5. Clique em "Gerar DOCX"

### **OPÇÃO 3: Extensão do VS Code**
1. Instale a extensão "Live Server"
2. Clique direito no `index.html`
3. Selecione "Open with Live Server"

## 🎯 **Como Saber se Está Funcionando:**

### **✅ Via Servidor (funciona tudo):**
- URL: `http://localhost:8000`
- Template carrega automaticamente
- Indicador mostra: "📄 Template: Contrato_EJA.docx"

### **⚠️ Via Arquivo Direto (só upload manual):**
- URL: `file:///u:/GUILHERME/Desktop/...`
- Precisa fazer upload manual
- Sistema mostra erro explicativo

## 🔧 **Teste Rápido:**
1. Selecione um modelo (ex: "Contrato EJA")
2. Clique em "📝 Exemplo" (preenche dados teste)
3. Clique em "📝 Gerar DOCX"
4. Se funcionar → ✅ | Se não → use OPÇÃO 2

## 📋 **Seus Templates:**
```
📁 templates/
├── Contrato_EJA.docx     ✅ Existe
├── Contrato_OM.docx      ✅ Existe  
├── CONTRATO_OM_DK.docx   ✅ Existe
└── Contrato_TEC.docx     ✅ Existe
```

---

**💡 DICA:** Use sempre a OPÇÃO 1 (servidor local) para melhor experiência!