# Spec — 011-numeracao-das-prioridades

> Fase 1 · donos: product-owner + tech-lead · referencia o refinement.md, não o repete.

## Objetivo

Na tela de prioridade, fazer com que o glifo do botão seja lido pelo que é — **tecla
de atalho** — e nunca como numeração de lista, sem tocar superfície congelada e sem
afirmar hierarquia que a tela nega. Link: [refinement.md](refinement.md).

Decisões do portão da Fase 0 (2026-08-31), que esta spec executa: **P2** existe
demanda; **P9** a lista vazia **não** entra (achado registrado à parte); **P10** o
slug permanece; demais P aprovadas em bloco, com a rota **(a)**.

## Critérios de aceite → gates

Todo critério é um gate executável, definido AQUI (antes do plano — R3 §1).
Namespace da demanda: `D011-*` em `tests_011_prioridade.js` (nome final do arquivo
é do QA; o namespace não). A quinta coluna é a **guarda de tautologia**: o estado
alcançável em que o critério REPROVA. Onde não existe estado de produto que
reprove, está dito — e o poder discriminante passa a depender só do mutante.

| # | Critério | Gate (id · arquivo · asserção) | Mutante previsto | Estado alcançável que o reprova |
|---|---|---|---|---|
| **C1** | **Todo glifo numérico exibido é um atalho que funciona.** Para cada botão cujo `.key` exibe o dígito `N`, um `keydown` de `N` alterna **exatamente aquele** botão | `D011-KEY1` · `tests_011_prioridade.js` · fixture com 15 findings; o oráculo recalcula a ordem de findings **do vetor da fixture** (severidade desc → nível asc → índice da pergunta), sem chamar `computeFindings()`; para `N=1..9`: `keydown N` adiciona o id esperado, `keydown N` de novo o remove (respeita o limite de 3) | **D011-M2** — renumerar o glifo pela posição visual pós-agrupamento | **Nenhum hoje: C1 é critério de PRESERVAÇÃO e nasce VERDE.** Dívida declarada: seu poder discriminante vem só de D011-M2, que precisa ser provado KILL antes do aceite |
| **C2** | **Item sem atalho não exibe glifo.** Com `N ≥ 10` findings, os botões de índice ≥ 9 têm `.key` **sem conteúdo textual** (nem `·` nem qualquer outro caractere), e o elemento `.key` **permanece no DOM** (alinhamento) | `D011-KEY2` · idem · fixture de 15 findings: `.key.textContent.trim() === ""` para os índices 9..14, `.key` presente em 15/15 botões, e `1..9` intactos nos índices 0..8 | **D011-M1** — restaurar o `·` nos itens sem atalho | **Sim, hoje**: qualquer sessão com ≥10 gaps. Red real |
| **C3** | **O glifo sai do nome acessível e o atalho é declarado.** Todo `.key` tem `aria-hidden="true"`; todo botão de índice < 9 tem `aria-keyshortcuts` igual ao seu dígito **inclusive quando selecionado** (o atalho continua funcionando sob `✓`); botão de índice ≥ 9 **não** tem o atributo | `D011-ACC1` · idem · texto do botão ignorando nós `aria-hidden` começa pelo rótulo da pergunta; mapa índice→`aria-keyshortcuts` conferido contra o oráculo; item selecionado mantém o atributo | **D011-M3** — remover `aria-keyshortcuts` do item selecionado (ou aplicá-lo a todos os botões) | **Sim, hoje**: nenhum dos dois atributos existe (`quickscan_...v3_1_3.html:727-728`) |
| **C4** | **A tela declara em texto o que o número é.** Existe **exatamente uma** legenda, dentro do container da grade, com o texto canônico **"Os números são atalhos de teclado — não a ordem de prioridade."**; ela existe se e somente se há ao menos um botão na grade | `D011-LEG1` · idem · igualdade literal do texto, `length === 1`, ancestral comum com a grade; com 0 findings, `length === 0` | **D011-M5** — legenda ausente; e variante que troca o texto por afirmação de ordem | **Sim, hoje**: não existe legenda alguma |
| **C5** | **Idempotência por reconstrução.** Após alternar uma prioridade (o que reconstrói o DOM via `render()`), a tela apresenta **uma** legenda, nenhum glifo mudo e os mesmos atributos de C3 | `D011-IDEM1` · idem · medir estado → `click` num `.opt` → medir de novo: igualdade das três propriedades e `legenda.length === 1` | **D011-M4** — aplicar o ajuste uma única vez (guarda global `__done`) | **Sim** para a implementação ingênua; **não** para o estado de produto atual (o comportamento não existe). Nasce vermelho junto de C2/C3/C4 |
| **C6** | **A regressão congelada permanece intacta.** `tests_ux_m41.js` (UX8–UX14) e `tests_ref_m44.js` nas contagens de `expected_suites.json`; o mapeamento tecla→finding continua o do runtime congelado | Sem gate novo: stage `suites` contra `.claude/verify/expected_suites.json` | **D011-M8** — alterar o mapeamento tecla→finding; **UX14** (`tests_ux_m41.js:127`) tem de matar | **Sim**: o mutante prova que a regressão congelada tem poder discriminante sobre esta demanda |
| **C7** | **Nenhuma superfície protegida muda sem autorização registrada.** `P50-GOV1` verde ao final (`tests_p50_core.js:396`) | Suíte existente `tests_p50_core.js` · stage `suites` + stage `baseline` (pins) | **D011-M6** — editar um byte de `ui_ux_v32.js` sem repin | **Sim, e é o risco mais provável desta demanda** (ver Portão da Fase 1) |
| **C8** | **Higiene de módulo novo** (se a rota criar um): IIFE com guarda de instalação única, zero `innerHTML =`, CSS com prefixo próprio, ≤ 600 linhas, bridge registrado em `bridges.json` se e somente se expuser `window.__*` | stage `lint-arch` (R9) | **D011-M7** — escrever a legenda com `innerHTML =` | **Sim**: `innerHTML =` é o caminho fácil e o lint reprova |
| **C9** | **A suíte nova entra no registro canônico no MESMO PR**, com a contagem **medida por execução**, não declarada | `.claude/verify/expected_suites.json` → chave `d011` · stage `suites` (R10 §3) | — (critério de processo) | **Sim**: PR sem a chave `d011` reprova o stage |
| **C10** | **Contraste da legenda ≥ 4,5:1**, recalculado pela fórmula WCAG sobre as cores resolvidas, no padrão de `V322C-CON1` (`tests_p52_chromium.js:6053-6072`) | `D011-CON1` · suíte Chromium da demanda · razão medida na tela de prioridade | **D011-M9** — pintar a legenda com uma cor **calculada** para dar ~3,9:1 sobre o fundo resolvido (escolhida por medição, nunca por palpite de paleta) | **Sim** — mas **fora do agregado local** (KI-3: Chromium é CI + rito do proprietário). Ver "Declarado não mensurável" |
| **C11** | **Condicional — impressão.** Se mantido (ver Portão): regra `@media print` **do próprio módulo novo**, escopada à grade de prioridade, some com o glifo de atalho e **preserva** o estado de seleção (`✓`/`.sel` e o badge `Prioridade N`) | `D011-PRT1` · asserção sobre o CSS do módulo (precedente de oráculo: `tests_ux_m41.js:260`) + conferência no PDF pelo rito visual | **D011-M10** — estender a regra ao `✓`/`.sel`, apagando o estado no papel | **Sim** para a regra; o **efeito** no PDF não é mensurável em jsdom — o oráculo mede a regra, não o resultado. Limitação declarada |

### O critério central, decomposto

O critério que importa é *"o glifo não lê como índice"* — e ele **não é uma
asserção**, é uma percepção. Não se mede a ausência de um caractere e se declara
vitória. O que a spec mede é a **conjunção** que sustenta a percepção:

- **C1** — todo número mostrado *é* um atalho que funciona (semântica, não texto);
- **C2** — nenhum número é insinuado onde não há atalho;
- **C3** — o número não é conteúdo do botão para quem não vê a tela;
- **C4** — a tela **diz**, em português, o que o número é e o que ele não é.

O resíduo — *o facilitador ainda lê como índice mesmo assim?* — **não é mensurável
por gate** e está declarado abaixo. Resolve-se por inspeção humana no rito visual
do proprietário, não por asserção disfarçada.

### Declarado não mensurável (dívida honesta, não lacuna)

| O que | Por que | Onde se resolve |
|---|---|---|
| A percepção residual "lê como índice" | É julgamento humano; nenhum oráculo o captura | Rito visual do proprietário |
| **Nome acessível computado** (accname) | jsdom não calcula accname; C3 usa a aproximação canônica (texto ignorando `aria-hidden`) | Chromium/axe, na suíte visual |
| Largura/alinhamento real da caixa vazia de C2 | jsdom não faz layout | Chromium |
| Efeito real da regra de print (C11) no PDF | O oráculo mede a **regra CSS**, não o resultado impresso | Rito visual |
| Leitura por leitor de tela real (NVDA/JAWS) | Fora do alcance de qualquer gate deste repositório | Não coberto — declarado |
| Contraste (C10) no agregado local | KI-3: Chromium fora do agregado (design-decisions.md) | CI + rito do proprietário |

## Comportamento especificado

**Superfície única**: tela de prioridade (`document.body.dataset.uxscreen === "priority"`).
`N` = número de findings = respostas confirmadas em nível 0 ou 1 (`:522-533`).
Resposta **A validar (NA)** não gera finding (`:526`) e portanto **reduz** `N`;
**não respondida** idem. Suficiência **não** participa: esta tela não pontua
(`:722`) e a demanda não cria caminho novo para score (INV-6 como restrição).

| Estado | Saída esperada |
|---|---|
| `N = 0` | Grade vazia; **nenhuma legenda**. A lista vazia em si **é achado registrado à parte** (P9) — esta demanda não a trata |
| `1 ≤ N ≤ 9` | Glifos `1..N`, todos atalho funcional; legenda presente; `aria-hidden` no glifo; `aria-keyshortcuts` em todos os botões |
| `10 ≤ N ≤ 15` | Índices 0..8 com glifo e `aria-keyshortcuts`; índices 9..N-1 com `.key` presente e **vazio**, sem `aria-keyshortcuts`; legenda presente |
| Item selecionado, índice < 9 | `✓` no lugar do dígito (**inalterado**); `aria-pressed` inalterado; **`aria-keyshortcuts` permanece** — a tecla continua alternando |
| Item selecionado, índice ≥ 9 | `✓`; nenhum `aria-keyshortcuts` (não há atalho) |
| Após qualquer toggle | Tudo acima se reaplica (C5) |

### As três causas, separadas — o que acontece com cada uma

O refinamento mediu **três** causas para "número faltando". Elas não têm o mesmo
remédio, e tratá-las como uma só produziria gate que passa por estado.

| Causa | Onde | Veredito |
|---|---|---|
| **1 · `·` a partir do décimo** (`:728`) | Camada 1, desenhado; corrigível por decoração | **Muda de forma.** A ausência de atalho deixa de ser desenhada como glifo (C2) e passa a ser dita pela legenda (C4). O fato não é escondido — muda de canal |
| **2 · reagrupamento por domínio espalha o `1..9`** (`ui_ux_v32.js:154-168`) | Camada UX, comportamento aceito e coberto por UX8/UX10 | **Permanece, declarada.** A demanda **não** desfaz o agrupamento e **nenhum critério exige sequência contígua** — exigir isso mataria UX10. É a legenda que converte "sequência embaralhada" em "conjunto de atalhos" |
| **3 · `✓` substitui o número no selecionado** (`:728`) | Camada 1 | **Permanece, inalterada.** É estado, não índice, e `aria-pressed` já o entrega programaticamente (spec selada, UI-004, `PHASE_5_0_REV_B.md:383`). Criar um segundo canal para o mesmo estado seria regressão de acessibilidade |

## Contratos

- **Nenhum estado novo, nenhum dado novo.** Owner do estado de prioridade continua
  sendo a Camada 1 (`businessPriority`, `togglePriority:708`); a demanda é
  **apresentação pura** e não serializa nada (INV-8 intocada).
- **Nenhum bridge novo é necessário**: o módulo não precisa expor API. Se o plano
  concluir o contrário, `window.__*` exige entrada em `.claude/verify/bridges.json`
  no mesmo PR (R9 §2).
- **Ponto de extensão**: medido nesta fase — `window.__uxDecor` / `__P50.registerDecor`
  **não** roda na tela de prioridade. A cadeia é definida em `ui_ux_v32.js:186` sob
  `if (uxScreenOf()==="results")` e invocada só nos caminhos de resultado
  (`ui_v32.js:299`, `:525`, `:1280`); `p50AfterRender` (`ui_p50_shell_v32.js:271-291`)
  roda em todo render mas chama funções fixas, não a lista de decoradores.
  **Consequência**: a demanda precisa de patch-point — decisão do `tech-lead` na
  Fase 2, registrada no registro de patch-points do `plan.md` (R9 §4), entre dois
  precedentes medidos: wrapper do binding global `render` (`ui_ux_v32.js:5`;
  `ui_p50_shell_v32.js:262-269`, "AMB-1, aprovado pelo proprietário") e
  `MutationObserver` (`ui_p52_workspace_v32.js:1699-1719`).

## Cross-check (obrigatório)

- [x] **Invariantes R1 — nenhuma violada.** INV-1 **fora da régua**: o harness M41
  carrega um único arquivo, a Camada 1 (`harness_m41_v313.js:16`, `:24`) — camada
  5.x não entra no payload. INV-2/INV-5/INV-8 não tocadas; INV-6 entra como
  restrição (nada novo alimenta score); INV-10 preservada (nenhum símbolo
  renomeado; prosa PT-BR); **INV-9 é o ponto quente** — ver boundary.
- [x] **design-decisions.md — nenhum conflito.** A candidata "severidade uniforme
  `[2,1,0,0]`" foi **confirmada por leitura** (15 ocorrências de `{s:2,`) e **não é
  reaberta**. **Negativo registrado**: nada em `design-decisions.md` sobre tela de
  prioridade, atalho ou glifo. KI-3 (Chromium fora do agregado) é o que sustenta a
  declaração de C10.
- [x] **Specs validadas anteriores — nenhuma contradição.** `specs/009-.../refinement.md:142-147`
  e `:194-196` declararam o item 1 fora da 009 e desta forma; `specs/009-.../spec.md`
  não legisla sobre esta tela. **Negativo**: nada na 009 sobre glifo, atalho ou
  numeração da tela de prioridade.
- [x] **Specs de fase seladas — por leitura, não por memória.**
  `current_phase.json:18-25` lista **uma**: `specs/PHASE_5_0_REV_B.md`
  (SHA `4f1583c7…4619b`). Lida:
  - **POSITIVO · UI-004 (`:378-397`)** — cobre explicitamente os botões desta tela
    ("mesmo padrão em `fonte:716` para prioridades", `:382-383`), afirma que
    `aria-pressed` já entrega o estado selecionado, e **autoriza o caminho**:
    "superfície nova da Camada 5 e/ou **decoração pós-render** a partir de **módulo
    novo da fase**… usando os mesmos setters do runtime congelado", sendo
    **proibido** reescrever markup dentro da Camada 1 (`:385-388`). Declara ainda o
    risco sobre os gates congelados de teclado/foco (`:390-391`) e exige, na
    superfície nova: teclado, focus visible, **label programático**, estado
    selecionado programático, ordem previsível, sem dependência de hover (`:393`).
    **Esta spec é conforme**: C1/C3 são exatamente label e atalho programáticos;
    C6 é a regressão congelada que UI-004 nomeia como prova.
  - **POSITIVO · §29.4 (`:1613-1620`)** — `ui_ux_v32.js` e `ui_ux_v32.css` estão na
    lista nominal de **protegidos**.
  - **POSITIVO · §29.3 (`:1602-1611`)** — `build_v32_html.py` com edições
    nominalmente fechadas (relevante se a rota injetar módulo novo). Divergência
    prosa×executável **já registrada** em `docs_phase5/RECONCILIACAO_BOUNDARY_5_1_5_2.md:23-24`
    (a 5.2 injetou os módulos P52 além da lista) e resolvida pela precedência do
    regime de pins (Disposição §2, `:38-40`) — **não gera achado novo**.
  - **POSITIVO · §29.6 (`:1631-1641`)** — o pipeline de print e suas semânticas
    congeladas permanecem protegidos **por default**, sem autorização implícita, com
    `STOP` se um requisito exigir tocar arquivo/símbolo protegido. **É o que
    reclassifica C11** (ver Portão, decisão 2).
  - **NEGATIVO · §29.5 (`:1625-1629`)** — a lista nominal de superfícies visuais da
    5.0 **não inclui** a tela de prioridade.
  - **NEGATIVO** — nada na spec selada sobre numeração de lista, glifo de atalho ou
    `aria-keyshortcuts`. As ocorrências de "priorities" são do relatório executivo
    (`:881-885`, `:986`, `:1175`, `:1747`) e as de "teclado" são fluxo e
    acessibilidade (`:1252`, `:1401`, `:1472`, `:1547`, `:1681`) — nenhuma sobre o
    glifo.
- [x] **Boundary (R6) — as três fontes cruzadas**, nesta ordem:
  1. **`.claude/verify/boundary.json`** — `frozen` = engine, Camada 1, harness,
     snapshot (`:9-14`). `ui_ux_v32.js`/`.css` **ausentes de todas as classes**.
     **Lido sozinho, devolve falso negativo** — o mesmo que a 009 corrigiu por
     escrito (`specs/009-.../spec.md:111`).
  2. **`PROTECTED` e `frozenSuites` em `tests_p50_core.js`** — `ui_ux_v32.js:159`
     (`a050401145a5…`) e `ui_ux_v32.css:346` (`8afbd55f97a3…`) **estão pinados**;
     `P50-GOV1` (`:396-398`) reprova byte a byte. `frozenSuites` (`:400-405`) exige
     a presença de `tests_ux_m41.js` e `tests_ref_m44.js` — as duas suítes da
     regressão de C6.
  3. **`.claude/verify/pins.json`** — `:277-278`, **os mesmos dois SHAs**.
  **Resultado: três fontes em acordo sobre a identidade; a primeira silencia sobre
  a proteção, as outras duas a impõem.** `build_v32_html.py` é pinado (`pins.json:145`)
  e **não** é protegido: editá-lo é repin normal, não rito.
  **Toca protegido?** Depende da rota — e é por isso que a decisão 1 do Portão
  existe. A autorização nominal da 009 **não vale aqui**: ela é, textualmente,
  "exclusivamente no escopo da demanda 009" (`specs/009-.../spec.md:115`), o
  registro no próprio gate diz que "não amplia a boundary para outra demanda nem
  para outro arquivo" (`tests_p50_core.js:132-141`) — e `ui_ux_v32.js` **nunca
  esteve** entre os quatro autorizados lá.

## Portão da Fase 1 — duas decisões que não são do agente

### Decisão 1 · a rota, e o que ela custa em boundary

| Rota | Toca | Custo de rito |
|---|---|---|
| **A2 · módulo novo** (`ui_011_*.js` + CSS próprio, injetados pelo builder) | arquivos **novos** + `build_v32_html.py` (pinado, não protegido) + `expected_suites.json` + `pins.json` | **Nenhuma autorização de boundary.** É o caminho **autorizado por escrito** na spec selada (UI-004, `:385-388`). Exige patch-point novo aprovado pelo TL no `plan.md` (R9 §4) |
| **A1 · editar `ui_ux_v32.js`/`.css`** | dois arquivos da **§29.4**, pinados em `P50-GOV1` e em `pins.json` | **Autorização nominal do proprietário, por demanda**, + repin com trilha em `tests_p50_core.js` e `pins.json`, no mesmo PR |

**Recomendação: A2.** Três razões: (i) é o caminho que a spec selada autoriza
nominalmente para esta exata situação; (ii) não consome autorização de boundary —
que é ato de outra natureza que decisão de produto, e a delegação de 2026-08-29
cobre produto; (iii) não repina dois arquivos protegidos para mudar seis linhas.
O preço é um patch-point novo, com dois precedentes medidos e aprovação do TL.

**Se o `tech-lead` concluir na Fase 2 que o gancho exige editar `ui_ux_v32.js`, a
demanda PARA e escala ao proprietário** — não se prossegue "resolvendo na
implementação". O precedente da 010 é o custo de não fazer isso.

### Decisão 2 · C11 (impressão), aprovado em P5, reclassificado pela medição

P5 foi aprovado na Fase 0. A medição da Fase 1 encontrou a **§29.6**
(`PHASE_5_0_REV_B.md:1631-1641`): a semântica de print é protegida por default,
sem autorização implícita. Leitura honesta: uma regra `@media print` **no CSS de um
módulo novo**, escopada à grade de prioridade — que não é superfície de relatório e
não entra em `buildPrintReport`/`preparePrint` — não toca arquivo nem símbolo
protegido, e portanto não dispara o `STOP`. Mas a fronteira é interpretável, e
ambiguidade de spec selada é exatamente o que gera errata.

**Recomendação: manter C11 nos termos estritos acima** (regra própria, escopo
`.ux-priolayout`, zero contato com o pipeline de print) **e registrar aqui que, se o
TL classificar isso como semântica nova de print, C11 sai da demanda** e vira
decisão à parte, sem bloquear C1–C10.

## Fora de escopo

Herdado do refinamento, mais o que a spec exclui:

- **A Camada 1 permanece apenas lida** — nenhum rito D2, nem Porta A nem Porta B.
- **O mapeamento tecla→finding não muda** (`:1058`); UX14 é prova, não obstáculo.
- **O agrupamento por domínio não é desfeito**, e nenhum critério exige sequência
  contígua de glifos (causa 2 permanece, declarada).
- **O `✓` do item selecionado não muda** (causa 3).
- **A lista vazia (`N = 0`) não é tratada** — decisão P9 do portão: é defeito
  distinto, com cadeia arquivo:linha→efeito pronta no `refinement.md` (caso de borda
  5), e vira **achado** no `.claude/BACKLOG.md`. **Id `EA-*` não é alocado nesta
  spec**: a série chega a EA-7 nesta worktree e a 010 corre em branch paralela que
  esta não enxerga (R12 — números citados nunca renumeram). A escrita é tarefa da
  demanda, pelo `doc-writer`, depois que as irmãs chegarem à develop.
- **A frase congelada da `kbd-tip` (`:738`) não é reescrita** pela camada nova.
- **Relatório, scoring, suficiência, sessão e catálogo intocados.**
- **Nenhuma numeração de lista é criada** — é a decisão P1, e é o eixo da demanda.
