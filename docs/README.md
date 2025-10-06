# 📄 Gerador de Contratos v2.0

Sistema web profissional para geração de contratos educacionais com cálculo automático e exportação em múltiplos formatos.

## 🚀 Características Principais

- ✅ **Interface moderna** com design responsivo
- 🔢 **Cálculo automático** de parcelas e valores
- 📊 **Exportação múltipla**: PDF, DOCX e JSON
- 🎭 **Máscaras automáticas** para CPF, telefone, CEP e datas
- ⌨️ **Atalhos de teclado** para produtividade
- 📱 **Responsivo** para desktop e mobile

## 🏗️ Estrutura do Projeto

```
Gerador JAVA/
├── index.html              # Página principal
├── css/
│   └── styles.css         # Estilos da aplicação
├── js/
│   ├── utils.js           # Funções utilitárias e máscaras
│   ├── calculations.js    # Sistema de cálculos financeiros
│   ├── exports.js         # Funcionalidades de exportação
│   └── main.js            # Aplicação principal e coordenação
└── BASE                   # Arquivo original (backup)
```

## 💻 Como Usar

### Instalação
1. Abra o arquivo `index.html` em qualquer navegador moderno
2. Não requer instalação de servidor - funciona localmente

### Preenchimento
1. **Selecione o modelo** do contrato desejado
2. **Escolha a forma de pagamento** (À vista, Cartão ou Boleto)
3. **Preencha os dados** do responsável e aluno
4. **Informe valores financeiros** - o sistema calcula automaticamente
5. **Exporte** nos formatos desejados

## ⌨️ Atalhos de Teclado

| Atalho | Função |
|--------|--------|
| `Ctrl + S` | Gerar PDF |
| `Ctrl + D` | Gerar DOCX |
| `Ctrl + J` | Baixar JSON |
| `F5` | Preencher exemplo |
| `F9` | Forçar recálculo |

## 🧮 Sistema de Cálculos

### À Vista
- Valor total = Valor à vista

### Cartão de Crédito
- Total = Número de parcelas × Valor da parcela
- Ajuste automático quando valores são alterados

### Boleto Bancário
- Total = Entrada + (Número de parcelas × Valor da parcela)
- Cálculo inteligente baseado nos valores informados

## 📋 Funcionalidades por Módulo

### `utils.js` - Utilitários
- Formatação de texto (Title Case)
- Máscaras para CPF, telefone, CEP e datas
- Conversão e formatação monetária (BRL)
- Helpers DOM
- Validações (CPF, datas)

### `calculations.js` - Cálculos
- Sistema de recálculo automático
- Validação de valores financeiros
- Cálculo de descontos
- Resumo financeiro detalhado

### `exports.js` - Exportações
- Exportação em JSON estruturado
- Geração de PDF formatado
- Criação de documentos DOCX
- Preenchimento de exemplo

### `main.js` - Aplicação Principal
- Inicialização e coordenação
- Configuração de eventos
- Atalhos de teclado
- Validação completa do formulário

## 🎨 Estilos e Interface

- **Tema escuro elegante** com gradientes
- **Sistema de cores consistente** via CSS Variables
- **Componentes modulares** (cards, botões, inputs)
- **Animações suaves** para melhor UX
- **Design responsivo** para todos os dispositivos

## 📊 Formatos de Exportação

### PDF
- Documento formatado profissionalmente
- Resumo completo do contrato
- Cabeçalho e rodapé personalizados

### DOCX
- Documento Word editável
- Estrutura com seções organizadas
- Formatação profissional mantida

### JSON
- Dados estruturados para integração
- Metadados incluídos
- Formato padrão para APIs

## 🔧 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com Grid e Flexbox
- **JavaScript ES6+** - Lógica da aplicação
- **jsPDF** - Geração de PDFs no cliente
- **docx** - Criação de documentos Word
- **CDN** - Bibliotecas externas otimizadas

## 🚀 Melhorias Implementadas na v2.0

1. **Arquitetura modular** - Código organizado em módulos especializados
2. **Sistema de classes** - Orientação a objetos para melhor manutenção
3. **Validações robustas** - Verificação de CPF e dados críticos
4. **Atalhos de produtividade** - Teclas de atalho para ações rápidas
5. **Interface aprimorada** - Design mais profissional e responsivo
6. **Exportação DOCX** - Documentos Word editáveis
7. **Logging detalhado** - Console logs para debugging
8. **Tratamento de erros** - Mensagens informativas para o usuário

## 🔮 Funcionalidades Futuras

- [ ] Salvamento automático no localStorage
- [ ] Templates de contrato personalizáveis
- [ ] Integração com APIs de CEP
- [ ] Assinatura digital
- [ ] Histórico de contratos gerados
- [ ] Modo offline com Service Workers

## 📝 Exemplos de Uso

### Contrato Técnico em Enfermagem
```
Modelo: Contrato_TEC
Curso: Técnico em Enfermagem
Carga: 1200h
Valor: R$ 2.400,00
Parcelas: 12x R$ 200,00 (Cartão)
```

### Curso EJA
```
Modelo: Contrato_EJA
Curso: Ensino Médio - EJA
Valor: R$ 800,00 à vista
Desconto: R$ 200,00
```

## 🐛 Solução de Problemas

### Máscaras não funcionam
- Verifique se o `utils.js` foi carregado corretamente

### Cálculos incorretos
- Pressione F9 para forçar recálculo
- Verifique se todos os valores estão no formato correto

### Exportação falha
- Verifique conexão com internet (CDNs)
- Confirme se os campos obrigatórios estão preenchidos

## 📄 Licença

Este projeto é de uso livre para fins educacionais e comerciais.

---

**Desenvolvido com ❤️ para facilitar a gestão de contratos educacionais**