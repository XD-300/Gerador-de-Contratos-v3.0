# 🎯 Sistema de Templates DOCX - Guia de Uso

## ✅ O que foi implementado

O sistema agora usa **Docxtemplater + PizZip** para preencher templates Word mantendo a formatação original idêntica.

### 🔧 Bibliotecas Integradas
- **Docxtemplater v3.44.0**: Para preenchimento de templates
- **PizZip v3.1.7**: Para manipulação de arquivos DOCX
- **Preservação total**: Fontes, posições, diagramação mantidas

## 📝 Como usar os templates

### 1. Preparar o template DOCX
No seu arquivo Word (.docx), use placeholders com esta sintaxe:
```
{{CONTRATO}} - Número do contrato
{{NOME}} - Nome do cliente
{{CPF}} - CPF do cliente
{{ENDERECO}} - Endereço completo
{{TELEFONE}} - Telefone de contato
{{EMAIL}} - Email do cliente
{{VALOR_TOTAL}} - Valor total do contrato
{{PARCELAS}} - Número de parcelas
{{DATA_ATUAL}} - Data atual (gerada automaticamente)
```

### 2. Blocos condicionais
Para mostrar/ocultar seções baseado na forma de pagamento:
```
{#BLOCO_AVISTA}
Este texto só aparece se for pagamento à vista
{/BLOCO_AVISTA}

{#BLOCO_CARTAO}
Este texto só aparece se for pagamento no cartão
{/BLOCO_CARTAO}

{#BLOCO_BOLETO}
Este texto só aparece se for pagamento por boleto
{/BLOCO_BOLETO}
```

### 3. Exemplo de template
```
CONTRATO DE PRESTAÇÃO DE SERVIÇOS Nº {{CONTRATO}}

Contratante: {{NOME}}
CPF: {{CPF}}
Endereço: {{ENDERECO}}
Telefone: {{TELEFONE}}
E-mail: {{EMAIL}}

Valor Total: {{VALOR_TOTAL}}
Parcelamento: {{PARCELAS}}

{#BLOCO_CARTAO}
Forma de Pagamento: Cartão de Crédito
Taxa adicional: 2,5%
{/BLOCO_CARTAO}

{#BLOCO_BOLETO}
Forma de Pagamento: Boleto Bancário
Vencimento: Todo dia 10
{/BLOCO_BOLETO}

Data: {{DATA_ATUAL}}
```

## 🚀 Como funciona

1. **Carregamento**: Sistema carrega o template DOCX automaticamente
2. **Preenchimento**: Formulário envia dados para o template
3. **Processamento**: Docxtemplater substitui {{PLACEHOLDERS}} pelos valores reais
4. **Download**: Arquivo final mantém formatação original + dados preenchidos

## 🎨 Vantagens

- **Formatação preservada**: Fontes, cores, estilos mantidos
- **Layout original**: Posições, tabelas, imagens preservadas
- **Blocos condicionais**: Mostra/oculta seções automaticamente
- **Fácil manutenção**: Edite templates no Word normalmente

## 🧪 Teste

1. Abra `tests/teste-docxtemplater.html`
2. Verifique se as bibliotecas carregaram
3. Teste os dados de exemplo
4. Confirme que tudo está funcionando

## 📁 Arquivos modificados

- `index.html`: Adicionadas bibliotecas Docxtemplater e PizZip
- `src/core/exports.js`: Nova função `_preencherComDocxtemplater`
- `templates/*.docx`: Templates Word com placeholders

## 🔄 Próximos passos

1. Edite seus templates DOCX com os placeholders
2. Teste o preenchimento no sistema
3. Ajuste os campos conforme necessário
4. O arquivo final terá formatação idêntica ao original!