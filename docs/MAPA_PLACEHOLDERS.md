# 📋 **MAPA COMPLETO DE PLACEHOLDERS**

## 🗺️ **Placeholders ⇒ Campos do Formulário**

### **📝 Dados Básicos**
```
{{CONTRATO}} ⇒ CONTRATO
{{DATA}} ⇒ DATA
{{DATA INICIAL}} ⇒ DATA (alias)
{{PREVISAO TERMINO}} ⇒ (vazio - não implementado)
```

### **👤 Responsável Financeiro**
```
{{NOME COMPLETO}} ⇒ NOME COMPLETO
{{NÚMERO DO CPF}} ⇒ CPF
{{NUMERO DO CPF}} ⇒ CPF (alias)
{{CPF (RESPONSAVEL)}} ⇒ CPF (alias)
{{RG RESPONSAVEL}} ⇒ RG RESPONSAVEL
{{RG RESPONSÁVEL}} ⇒ RG RESPONSAVEL (alias)
{{RG}} ⇒ RG RESPONSAVEL (alias)
{{TELEFONE}} ⇒ TELEFONE
```

### **🏠 Endereço**
```
{{ENDEREÇO COMPLETO}} ⇒ ENDEREÇO COMPLETO
{{N CS}} ⇒ N CS
{{Nº}} ⇒ N CS (alias)
{{NÚMERO}} ⇒ N CS (alias)
{{NUMERO}} ⇒ N CS (alias)
{{BAIRRO}} ⇒ BAIRRO
{{CEP}} ⇒ CEP
{{CID/EST}} ⇒ CID/EST
{{CIDADE/UF}} ⇒ CID/EST (alias)
{{CIDADE UF}} ⇒ CID/EST (alias)
```

### **🎓 Dados do Aluno**
```
{{NOME DO ALUNO}} ⇒ NOME DO ALUNO
{{NASC ALUNO}} ⇒ NASC ALUNO
{{CPF DO ALUNO}} ⇒ CPF DO ALUNO
{{RG ALUNO}} ⇒ RG ALUNO
{{RG ALUNO(A)}} ⇒ RG ALUNO (alias)
```

### **📚 Dados do Curso**
```
{{PROFISSIONALIZANTE}} ⇒ PROFISSIONALIZANTE
{{CARGA HORÁRIA}} ⇒ CARGA HORÁRIA
```

### **💰 Valores Financeiros**
```
{{VALOR TOTAL}} ⇒ VALOR TOTAL
{{VALOR TOTAL DO CURSO}} ⇒ VALOR TOTAL (alias)
{{VALOR À VISTA}} ⇒ VALOR À VISTA
{{VALOR A VISTA}} ⇒ VALOR À VISTA (alias)
{{DESCONTO}} ⇒ DESCONTO
{{NUMERO DE PARCELAS}} ⇒ NÚMERO DE PARCELAS
{{NÚMERO DE PARCELAS}} ⇒ NÚMERO DE PARCELAS (alias)
{{VALOR PARCELA CARTÃO}} ⇒ VALOR PARCELA CARTÃO
{{PARCELA CARTAO}} ⇒ VALOR PARCELA CARTÃO (alias)
{{VALOR PARCELA BOLETO}} ⇒ VALOR PARCELA BOLETO
{{PARCELA BOLETO}} ⇒ VALOR PARCELA BOLETO (alias)
{{VALOR ENTRADA}} ⇒ VALOR ENTRADA
{{DIA VENCIMENTO}} ⇒ DIA VENCIMENTO
```

### **🔧 Meta Informações**
```
{{MODELO}} ⇒ _meta.modelo
{{FORMA_PAGAMENTO}} ⇒ _meta.forma
{{FORMA PAGAMENTO}} ⇒ _meta.forma (alias)
{{DATA_GERACAO}} ⇒ (timestamp atual)
{{VERSAO}} ⇒ "2.1-Python-Compatible"
```

---

## 🎯 **Blocos Condicionais por Forma de Pagamento**

### **💵 À Vista**
```
{{BLOCO_AVISTA}} ⇒ "Pagamento à vista no valor de R$ XXX."
{{is_avista}} ⇒ true/false (booleano)
```

### **💳 Cartão de Crédito**
```
{{BLOCO_CARTAO}} ⇒ "12 × R$ 150,00"
{{is_cartao}} ⇒ true/false (booleano)
```

### **🧾 Boleto Bancário**
```
{{BLOCO_BOLETO}} ⇒ "Entrada: R$ 200,00 | 11 × R$ 120,00 (venc. dia 15)"
{{is_boleto}} ⇒ true/false (booleano)
```

---

## 🔄 **Templates Condicionais Avançados**

### **Usando booleanos ({#cond}/{/cond}):**
```docx
{#is_avista}
Forma de pagamento: À vista
Valor: {{VALOR À VISTA}}
{/is_avista}

{#is_cartao}
Forma de pagamento: Cartão
Parcelas: {{NUMERO DE PARCELAS}} × {{VALOR PARCELA CARTÃO}}
{/is_cartao}

{#is_boleto}
Forma de pagamento: Boleto
Entrada: {{VALOR ENTRADA}}
Parcelas: {{NUMERO DE PARCELAS}} × {{VALOR PARCELA BOLETO}}
Vencimento: Dia {{DIA VENCIMENTO}}
{/is_boleto}
```

### **Usando blocos prontos:**
```docx
{{BLOCO_AVISTA}}
{{BLOCO_CARTAO}}
{{BLOCO_BOLETO}}
```

---

## ✅ **Sistema de Compatibilidade**

### **🔗 Características:**
- ✅ **Tolerante a chaves ausentes** - usa `nullGetter()`
- ✅ **Múltiplos aliases** para cada campo
- ✅ **Booleanos condicionais** para templates avançados
- ✅ **Blocos pré-formatados** por forma de pagamento
- ✅ **Debug profissional** com log de placeholders faltantes

### **🛡️ Fallback Strategy:**
1. **Placeholder encontrado** → Valor do formulário
2. **Alias disponível** → Mapeamento automático  
3. **Campo ausente** → String vazia (não quebra)
4. **Erro crítico** → Log detalhado + alert informativo

---

## 📊 **Exemplo de Dados Expandidos**

```javascript
{
  // Dados originais do formulário
  "CONTRATO": "001/2025",
  "CPF": "123.456.789-00",
  "RG RESPONSAVEL": "12.345.678-9",
  
  // Aliases automáticos
  "NÚMERO DO CPF": "123.456.789-00",
  "NUMERO DO CPF": "123.456.789-00", 
  "RG": "12.345.678-9",
  "RG RESPONSÁVEL": "12.345.678-9",
  
  // Meta informações
  "MODELO": "Contrato_EJA",
  "FORMA_PAGAMENTO": "Cartão",
  "DATA_GERACAO": "02/10/2025 14:30:15",
  "VERSAO": "2.1-Python-Compatible",
  
  // Booleanos condicionais
  "is_avista": false,
  "is_cartao": true,
  "is_boleto": false,
  
  // Blocos formatados
  "BLOCO_CARTAO": "12 × R$ 150,00"
}
```

---

**🎉 Sistema 100% compatível com qualquer template DOCX!** 🚀