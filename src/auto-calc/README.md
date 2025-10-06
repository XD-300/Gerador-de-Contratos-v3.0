# Sistema de Cálculo Automático

Este módulo contém o sistema completo de cálculo automático para contratos. O sistema detecta automaticamente qual campo está vazio e calcula seu valor baseado nos outros campos preenchidos.

## Estrutura do Módulo

```
src/auto-calc/
├── engine.js      # Motor de cálculo principal
├── init.js        # Sistema de inicialização
├── styles.css     # Estilos e animações
└── README.md      # Esta documentação
```

## Funcionalidades

### 🧮 **Cálculos Automáticos**
- **À Vista**: Calcula valor total, desconto em R$ ou %
- **Cartão**: Calcula valor total, parcelas, valor por parcela
- **Boleto**: Calcula valor total, parcelas, valor por parcela (sem desconto)

### 🎯 **Detecção Inteligente**
- Identifica qual campo está vazio
- Calcula automaticamente quando apenas 1 campo está vazio
- Evita loops infinitos de cálculo
- Preserva valores digitados pelo usuário

### 🎨 **Feedback Visual**
- Animações para campos calculados
- Indicadores visuais de estado
- Tooltips informativos
- Suporte a tema escuro

### ⚙️ **Configuração Automática**
- Auto-inicialização no carregamento da página
- Configuração automática de eventos
- Gerenciamento de visibilidade de campos
- Sistema de diagnósticos

## Como Usar

### 1. **Incluir os Arquivos**

No seu HTML, adicione os links:

```html
<!-- CSS do sistema de cálculo -->
<link rel="stylesheet" href="src/auto-calc/styles.css">

<!-- JavaScript do sistema (ordem importante) -->
<script src="src/auto-calc/engine.js"></script>
<script src="src/auto-calc/init.js"></script>
```

### 2. **IDs Obrigatórios dos Campos**

O sistema espera estes IDs nos campos do formulário:

```html
<!-- Valor base -->
<input type="text" id="valor_contrato">

<!-- Campos de desconto (à vista) -->
<input type="text" id="percentual_desconto">
<input type="text" id="valor_desconto">

<!-- Campos de parcelamento -->
<input type="text" id="numero_parcelas">
<input type="text" id="valor_parcela">

<!-- Forma de pagamento -->
<select id="forma_pagamento">
  <option value="avista">À Vista</option>
  <option value="cartao">Cartão</option>
  <option value="boleto">Boleto</option>
</select>
```

### 3. **Inicialização Automática**

O sistema se inicializa automaticamente. Não é necessário código adicional!

## API do Sistema

### **Classe AutomaticCalculations**

#### Métodos Principais:
- `initialize()` - Inicializa o sistema
- `setupEventListeners()` - Configura eventos dos campos
- `calculateMissingField()` - Calcula campo faltante
- `formatCurrency(value)` - Formata valores como moeda
- `parseNumber(str)` - Converte string para número

#### Métodos de Cálculo:
- `calculateAvista()` - Cálculos para à vista
- `calculateCartao()` - Cálculos para cartão
- `calculateBoleto()` - Cálculos para boleto

### **Classe AutoCalcInit**

#### Métodos Principais:
- `initialize()` - Inicialização completa
- `setupFieldVisibility()` - Gerencia visibilidade
- `setupManualRecalc()` - Botão de recálculo manual
- `diagnostics()` - Diagnósticos do sistema

## Personalização

### **Modificar Cálculos**

Para alterar a lógica de cálculo, edite os métodos em `engine.js`:

```javascript
calculateAvista() {
  // Sua lógica personalizada aqui
}
```

### **Adicionar Novos Campos**

1. Adicione o campo no HTML com ID único
2. Inclua o campo nos métodos de cálculo
3. Adicione event listeners se necessário

### **Personalizar Estilos**

Modifique `styles.css` para alterar:
- Cores das animações
- Duração dos efeitos
- Estilos de feedback visual

## Solução de Problemas

### **Cálculos não funcionam**

1. Verifique se os IDs dos campos estão corretos
2. Confirme que os scripts estão na ordem correta
3. Verifique o console para erros JavaScript

### **Campos não aparecem/desaparecem**

1. Verifique os atributos `data-show` nos elementos
2. Confirme que a função `updateFormaUI()` existe
3. Verifique se o ID `forma_pagamento` está correto

### **Diagnósticos**

Use a função de diagnóstico no console:

```javascript
// Executar diagnóstico completo
if (window.autoCalcInit) {
  window.autoCalcInit.diagnostics();
}
```

## Compatibilidade

- ✅ Chrome/Edge (versões recentes)
- ✅ Firefox (versões recentes)
- ✅ Safari (versões recentes)
- ✅ IE 11+ (com polyfills)

## Changelog

### v2.0 (Atual)
- Sistema modular organizado
- Compatibilidade aprimorada (sem métodos privados)
- Sistema de diagnósticos
- Documentação completa

### v1.0
- Sistema básico de cálculos
- Feedback visual inicial
- Detecção de campos vazios