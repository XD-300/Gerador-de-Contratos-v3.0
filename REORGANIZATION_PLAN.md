# 🗂️ REORGANIZAÇÃO COMPLETA DO PROJETO

## Problemas Identificados:

### 📁 Arquivos Duplicados:
- `calculations-compatible.js` (raiz) vs `src/core/calculations.js`
- `calculations-test.js` (raiz) - arquivo de teste isolado
- `src/core/automatic-calculations.js` vs `src/auto-calc/engine.js` - funcionalidades similares
- `src/core/auto-calc-init.js` vs `src/auto-calc/init.js` - duplicação
- Arquivos de teste espalhados pela raiz e pasta tests/

### 📂 Estrutura Desorganizada:
- Arquivos de teste na raiz do projeto
- Arquivos legados sem uso
- Documentação espalhada

## 🎯 Estrutura Proposta:

```
📦 Gerador JAVA/
├── 📄 index.html                    # Arquivo principal
├── 📄 index-offline.html           # Versão offline
├── 📄 README.md                    # Documentação principal
├── 📄 project.json                 # Configurações do projeto
├── 📄 .gitignore                   # Arquivos ignorados
│
├── 📂 src/                         # Código fonte
│   ├── 📂 core/                    # Módulos principais
│   │   ├── 📄 main.js             # Aplicação principal
│   │   ├── 📄 calculations.js     # Sistema de cálculos (unificado)
│   │   ├── 📄 exports.js          # Exportações
│   │   ├── 📄 automations.js      # Automações avançadas
│   │   └── 📄 utils.js            # Utilitários
│   │
│   ├── 📂 auto-calc/              # Sistema de cálculo automático
│   │   ├── 📄 engine.js           # Motor de cálculo
│   │   ├── 📄 init.js             # Inicializador
│   │   ├── 📄 styles.css          # Estilos específicos
│   │   └── 📄 README.md           # Documentação
│   │
│   └── 📂 styles/                 # Folhas de estilo
│       ├── 📄 main.css            # Estilos principais
│       ├── 📄 validations.css     # Estilos de validação
│       └── 📄 auto-calc.css       # Estilos de cálculo
│
├── 📂 tests/                      # Todos os testes
│   ├── 📄 index.html              # Índice de testes
│   ├── 📄 automations.html        # Teste de automações
│   ├── 📄 calculations.html       # Teste de cálculos
│   ├── 📄 templates.html          # Teste de templates
│   ├── 📄 libraries.html          # Teste de bibliotecas
│   └── 📄 final-system.html       # Teste do sistema completo
│
├── 📂 docs/                       # Documentação
│   ├── 📄 README.md               # Índice da documentação
│   ├── 📄 user-guide.md           # Guia do usuário
│   ├── 📄 developer-guide.md      # Guia do desenvolvedor
│   ├── 📄 api-reference.md        # Referência da API
│   └── 📄 deployment.md           # Guia de implantação
│
├── 📂 templates/                  # Templates DOCX
│   ├── 📄 README.md               # Documentação dos templates
│   └── 📄 *.docx                  # Arquivos de template
│
├── 📂 examples/                   # Exemplos e referências
│   ├── 📄 README.md               # Documentação dos exemplos
│   └── 📄 *.txt                   # Arquivos de exemplo
│
└── 📂 tools/                      # Ferramentas e scripts
    ├── 📄 download-libs.bat       # Script de download
    └── 📄 organize.js             # Script de organização
```

## 🚀 Ações de Reorganização:

1. **Consolidar arquivos de cálculo**
2. **Mover arquivos de teste para pasta tests/**
3. **Renomear arquivos para padrão consistente**
4. **Remover arquivos duplicados/legados**
5. **Atualizar referências nos HTMLs**
6. **Criar índices organizados**