# 🎯 Sistema de Templates Automático

## ✨ Como Funciona Agora

O sistema foi **completamente atualizado** para carregar automaticamente os templates baseado no modelo selecionado!

### 📂 **Estrutura de Templates**

```
📁 templates/
   ├── Contrato_EJA.docx     ← Para "Contrato EJA" 
   ├── Contrato_OM.docx      ← Para "Contrato OM"
   ├── CONTRATO_OM_DK.docx   ← Para "Contrato OM-DK"
   └── Contrato_TEC.docx     ← Para "Contrato Técnico"
```

## 🚀 **Como Usar (Novo Sistema)**

### 1. **Seleção Automática de Template**
- Abra o `index.html`
- Escolha o **modelo desejado** no dropdown
- **Automaticamente** o template correspondente será carregado da pasta `templates/`
- Aparecerá um **indicador visual** mostrando qual template foi carregado

### 2. **Geração do Documento**
- Preencha todos os dados do formulário
- Clique no botão **"Gerar DOCX"**
- O sistema automaticamente:
  1. Carrega o template correto da pasta
  2. Preenche com os dados do formulário
  3. Baixa o documento final

### 3. **Sistema de Fallback**
Se por algum motivo o template não for encontrado na pasta:
- O sistema mostrará um aviso
- Você pode fazer upload manual do arquivo
- O upload manual sempre tem precedência

## 📋 **Placeholders nos Templates**

Seus arquivos `.docx` devem conter exatamente estes campos:

**Identificação:**
- `{{CONTRATO}}`
- `{{DATA}}`

**Responsável:**
- `{{NOME COMPLETO}}`
- `{{NASC RESP}}`
- `{{NÚMERO DO CPF}}`
- `{{RG RESPONSAVEL}}`
- `{{TELEFONE}}`

**Endereço:**
- `{{ENDEREÇO COMPLETO}}`
- `{{N CS}}`
- `{{BAIRRO}}`
- `{{CEP}}`
- `{{CID/EST}}`

**Aluno:**
- `{{NOME DO ALUNO}}`
- `{{NASC ALUNO}}`
- `{{CPF DO ALUNO}}`
- `{{RG ALUNO}}`

**Curso:**
- `{{PROFISSIONALIZANTE}}`
- `{{CARGA HORÁRIA}}`

**Valores:**
- `{{VALOR TOTAL}}`
- `{{PARCELA}}`
- `{{DESCONTO}}`
- `{{NUMERO DE PARCELAS}}`

## 🔧 **Vantagens do Novo Sistema**

✅ **Automático:** Não precisa mais fazer upload manual
✅ **Intuitivo:** Modelo selecionado = template carregado
✅ **Visual:** Indicador mostra qual template está ativo
✅ **Fallback:** Upload manual ainda funciona como backup
✅ **Organizado:** Templates ficam centralizados na pasta

## 🎮 **Teste Rápido**

1. Abra o `index.html`
2. Mude o modelo no dropdown
3. Observe o indicador de template
4. Clique em "📝 Exemplo" para preencher dados teste
5. Clique em "Gerar DOCX"
6. Pronto! 🎉

---

**Resultado:** Sistema 100% automático onde você só precisa selecionar o modelo e preencher os dados!