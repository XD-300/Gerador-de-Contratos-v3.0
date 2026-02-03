## Rápido (o que o agente precisa saber)
- Projeto: SPA front-end para geração de contratos com motor de cálculos, templates DOCX e exportação (DOCX/XLSX/JSON).
- Objetivo do agente: editar regras de cálculo, automações e templates; garantir que exports preenchem placeholders corretamente; manter a UI consistente com a pasta `templates/`.

## Arquitetura — visão prática
- UI single-page: `index.html` é o ponto de entrada. Scripts carregados (ordem importante) vivem em `src/core/*` e `src/auto-calc/*`.
- Motor de cálculo: `src/auto-calc/engine.js` (implementa `AutomaticCalculations`). Inicialização e visibilidade dos campos: `src/auto-calc/init.js`.
- Lógica de domínio/integrações: `src/core/` contém `calculations.js`, `automations.js`, `exports.js`, `utils.js` e `templates-embedded.js` — aqui ficam os mapeamentos para preenchimento de templates e o orquestrador de exportação.
- Templates: os arquivos reais de template devem estar em `templates/`. O select `#modelo` na UI deve refletir apenas o que existir em `templates/` (ver item Convensões abaixo).
- Bibliotecas de template: `libs/pizzip.min.js` e `libs/docxtemplater.js` (local-first) são usadas para preencher DOCX; há também CDNs com fallback (veja `index.html`).

## Fluxos críticos (onde procurar/editar)
- Fluxo UI → motor de cálculo: `index.html` coleciona campos (IDs como `#total`, `#parcela`, `#entrada`, `#nParcelas`, `#forma`) → `src/auto-calc/engine.js` calcula → `src/auto-calc/init.js` lida com visibilidade e inicialização.
- Fluxo cálculo → template → export: valores calculados são mapeados (ver `src/core/templates-embedded.js`) e `src/core/exports.js` gerencia Docxtemplater + PizZip para gerar o .docx. Eventos customizados usados: `gerarDocx`, `docx:generated`, `docx:downloaded`.
- Persistência/histórico: localStorage usa a chave `gerador_historico_contratos`. Ver funções `obterDadosFormulario` e `salvarContratoNoHistorico` em `index.html`.

## Convenções e regras específicas do projeto
- IDs de formulário esperados (não inventar novos sem mapear): `modelo`, `forma`, `data`, `nomeResp`, `nomeAluno`, `curso`, `total`, `entrada`, `parcela`, `nParcelas`, `desconto`, `diaVenc`, `templateUpload`, `btnDocx`.
- Modelos/Select `#modelo`: deve mostrar somente templates existentes na pasta `templates/`. Se for necessário adicionar/remover opções, atualize tanto os arquivos em `templates/` quanto o valor default em `index.html` (`CONTRATO_DE_PRESTACAO_DE_SERVICO` atualmente). Evite duplicar opções estáticas sem refletir a pasta `templates/`.
- Ordem de carregamento: scripts locais (libs) são carregados antes dos CDNs; qualquer mudança na ordem pode quebrar a detecção local-first (ver checagens em `index.html` que testam `window.PizZip` e `window.Docxtemplater`).
- Eventos customizados: para integrar com exportação, emita `window.dispatchEvent(new CustomEvent('gerarDocx'))` — o fluxo de exportação observa este evento e registra diagnóstico em `relatorio.js`.

## Como testar / depurar rápido
- Execução local: abra `index.html` via um servidor estático (ex.: extensão Live Server do VS Code ou `python -m http.server` na pasta do projeto). Abrir o arquivo diretamente no filesystem pode causar problemas com algumas libs (use servidor estático).
- Pontos para colocar breakpoints/console.log:
  - `src/auto-calc/engine.js` — métodos de cálculo (calculateAvista/Cartao/Boleto)
  - `src/auto-calc/init.js` — visibilidade/initialization
  - `src/core/exports.js` — preenchimento e geração do DOCX
  - `index.html` scripts que coletam campos e disparam `gerarDocx` / `btnDocx` handlers
- Testes manuais úteis: usar o botão `📝` (id `btnExemplo`) que preenche campos com `dados_exemplo_atualizados.md` para reproduzir cenários padronizados.

## Integrações e pontos de atenção
- Template filling: examine `src/core/templates-embedded.js` para ver o mapeamento entre chaves/nomes do template e os IDs do formulário. Se adicionar placeholders ao DOCX, atualize esse mapeamento.
- Docxtemplater/PizZip: o projeto carrega versões locais (em `libs/`) e faz checagem/diagnóstico (ver `index.html`) antes de usar CDN. Não mover as bibliotecas sem atualizar as checagens.
- Eventos para auditoria/UX: `relatorio.js` e os eventos `docx:generated` / `docx:downloaded` produzem o modal/relatório de diagnóstico. Ao alterar `exports.js`, mantenha a emissão desses eventos para compatibilidade com o UX.

## Exemplos de prompts úteis para o agente
- "Adicionar regra: nova função `calcTax(context)` em `src/core/calculations.js` que retorna { tax: number } e inclua o resultado no mapeamento de `src/core/templates-embedded.js` sob `taxa`. Teste com `dados_exemplo_atualizados.md`."
- "Ajustar select `#modelo` para listar arquivos de `templates/`: implementar função que varre `templates/` no build/servidor e popula o select; garantir fallback para `CONTRATO_DE_PRESTACAO_DE_SERVICO` se vazio."
- "Investigar bug: DOCX gerado sem campo X — reproduza com botão `btnExemplo`, rode exportação, inspecione `src/core/templates-embedded.js` e `src/core/exports.js` para ver se o placeholder está sendo mapeado."

## Nota final e pedido de confirmação
Incluí as convenções observáveis e os caminhos reais do repositório (`src/auto-calc/*`, `src/core/*`, `libs/`, `templates/`, `dados_exemplo_atualizados.md`).
Se quiser, eu: (1) atualizo o `#modelo` para popular automaticamente a partir de `templates/` (se preferir uma solução JS/Node), ou (2) mesclo conteúdo existente caso já exista `.github/copilot-instructions.md` em outro branch. Qual prefere? 
