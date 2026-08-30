# Refinamento — 009-leitura-do-relatorio

> Fase 0 · dono: product-owner · template: .claude/templates/refinement.md
> Interroga o sistema REAL, não só os docs. O que se descobre aqui é mais barato
> do que a errata que se evitaria depois.

Origem: sessão com cliente em 2026-08-27 (9 itens verbatim) + parecer de analista
independente. Nenhuma frase deste documento aprova fase ou dispensa invariante.

**Portão da Fase 0**: o usuário respondeu no chat, literalmente, "Sigo as
recomendações" (2026-08-27). P1–P15 ficam respondidas pela recomendação que cada
uma carrega. Registro em "Rodadas de entrevista".

## Escopo desta demanda — decidido no portão

Esta seção é o contrato que a Fase 6 mede. O documento levanta os **nove** itens
do cliente porque a análise é indivisível; **a 009 entrega cinco deles.**

**A 009 entrega:**

| Item | O que entrega |
|---|---|
| 2 | A nota da jornada deixa de quebrar no meio da frase (a legenda sai da régua de 78ch) |
| 3 | Domínios da leitura executiva com a cor canônica do domínio + canal não-cromático; fim da repetição em prosa dos "próximos passos" que a lista "Para avançar" já mostra ao lado |
| 5 | Contexto tecnológico explicado no **resultado**: uma frase por capability declarada, reusando `P52_CAP_HELP` |
| 7 | Ordem canônica de leitura nova, com âncora normativa declarada na spec antes do código, preservando P52-TGT1 e a exceção de gate fechado |
| 9 | Nenhuma mudança de comportamento — a decisão é **manter** o disclosure como está (ver P13). Entra como decisão registrada, não como código |
| — | **Regra de bloco de ausência** estabelecida como regra de produto (verbete no `CONTEXT.md`), aplicada onde a 009 já toca |
| — | **Defeito** `ui_target_v32.js:166`: separar "contexto não informado" (UNSET) de "contexto informado e nada se aplica" (NONE) |

**A 009 NÃO entrega** — material preservado neste documento como insumo:

- **Itens 4, 6 e 8 → demanda 010** ("habilitadores na prática-alvo"). Mesma
  decisão de produto, mesmo card; separá-los produziria um estado em que o
  relatório perde conteúdo antes de ganhar o substituto.
- **Item 1 → demanda 011** ("tela de prioridade"). Outra superfície, outro
  público, outro rito.

**Acoplamento declarado, para o `tech-lead` sequenciar.** O defeito de
`ui_target_v32.js:166` vive em `tgtEnablersHTML` — **a mesma função** que a 010
altera para os itens 4 e 8. A 010 deve nascer depois da 009 mergeada em
`develop`, ou herdar explicitamente este patch. Duas demandas na mesma função em
paralelo é o anti-pattern de colisão silenciosa da R5 §3, agravado por serem
worktrees separadas.

## Necessidade

**Quem usa.** Duas pessoas distintas, hoje atendidas pela mesma tela: o
*facilitador* (conduz a sessão, precisa saber o que falta preencher) e o *leitor
do relatório* (executivo do cliente, lê uma vez, não conhece a metodologia).

**O que muda.** Hoje o resultado é uma pilha de nove seções em ordem de
construção histórica, não de leitura: a prioridade declarada pelo negócio aparece
três vezes em três seções diferentes, a mecânica interna do motor vaza para o
leitor ("contexto V3.2", "Leitura V3.1.3 preservada"), blocos que só sabem dizer
"não informado" ocupam espaço de conteúdo, e a prática-alvo — o único lugar
prospectivo do relatório — fica muda sobre habilitadores. A demanda troca a ordem
de construção pela ordem narrativa (onde estamos → o que o negócio elegeu → como
está distribuído → o que falta → para onde ir), elimina a repetição e devolve
conteúdo útil ao card de prática-alvo.

**Por que agora.** É a primeira leitura do relatório por um cliente real desde a
selagem da 5.2. Os nove itens são de leitura, não de cálculo: nenhum toca score,
suficiência ou target. É a janela mais barata para arrumar a arquitetura de
informação antes que ela vire contrato de expectativa com o cliente.

## Enquadramento de produto

### Invariantes tangenciadas (R1)

| INV | Como esta demanda a tangencia |
|---|---|
| **INV-7** (narrativa determinística e derivada de evidência) | É a invariante **governante** do item 4. Qualquer habilitador que apareça precisa ser função determinística de evidência confirmada — nunca de suposição sobre o que o cliente tem ou não tem. Também governa o item 3: a narrativa é hoje um pipeline de **strings puras** (`buildExecutiveNarrative` → `esc32(p)`), com `trace` por parágrafo; colorir domínio não pode virar HTML dentro da string. |
| **INV-5** (target declarado, nunca deriva de produto) | Tangenciada pelo item 8. O habilitador no card de prática-alvo é seguro **desde que** derive do nível ATUAL confirmado. Se derivar do nível ALVO, o produto passa a ser função da ambição e a seta se inverte. Ver P3. |
| **INV-2** (UNSET ≠ NONE) | Não no eixo do score, mas na apresentação: `ui_target_v32.js:166` usa **a mesma frase** para "contexto não informado" e para "contexto informado e nada se aplica". Isso é conflação de UNSET com NONE na superfície de leitura — defeito real, adjacente ao item 4. |
| **INV-3** (suficiência antes de qualquer score) | Item 7. A ordem canônica tem exceção deliberada sob gate FECHADO (`p52OrderFor()`): "Evidência e suficiência" sobe para 2ª posição para que resultado bloqueado não pareça liberado. Qualquer ordem nova precisa preservar isso. |
| **INV-9** (boundary legível por máquina) | Itens 1, 6, 8: as superfícies envolvidas incluem nós **congelados** (`quickscan_secops_soccmm_v3_1_3.html`, classe `frozen`). Ler é livre; suprimir/reordenar na tela tem precedente (`hideLegacyRecommendation`), editar não tem. |
| **INV-4** (tecnologia isolada nunca aumenta score) | Citada no encaminhamento como a invariante em risco no item 4. **Não é.** Nenhuma rota examinada altera score. A invariante realmente em risco é a INV-7. Registro a correção. |
| **INV-8** (derivados nunca serializados) | Guarda-corpo: nenhum habilitador, ordem de seção ou texto de glossário pode ser persistido na sessão. Tudo recomputa no import. |
| **INV-10** (PT-BR em docs; nomes de código como no source) | Vocabulário: o glossário fixa o termo de doc/spec; strings congeladas de UI permanecem como estão. |

### Desafio ao pedido — item 4 (o item que precisa ser desafiado)

**A premissa do pedido está parcialmente errada, e isso muda a resposta.**
O cliente pede recomendação para automação, endpoint, visibilidade de rede e
superfície externa. Verifiquei o source: **o catálogo congelado já tem
exatamente esses quatro vínculos, por pergunta**, em
`quickscan_secops_soccmm_v3_1_3.html:420-467` (`MAP`):

- `automation` → FortiSOAR · `endpoint` → FortiEndpoint
- `network-visibility` → FortiNDR · `external-surface` → FortiRecon

E eles **já renderizam produto sem exigir contexto tecnológico algum**, no bloco
congelado `apoioBlock` (`:860-879`), sob os títulos "Como a Fortinet pode apoiar
nas prioridades declaradas" / "…apoiar agora". Ou seja: a afirmação de que
"recomendar produto sem contexto declarado colide com o produto" é verdadeira
para a **camada V3.2** (engine) e **falsa para a Camada 1**, que é justamente a
camada congelada. Há duas doutrinas convivendo no mesmo relatório.

Por que o cliente não viu, então? Três filtros, todos plausíveis:

1. `apoioBlock` só é emitido para **gap alto** (`sev===2`). Gap moderado recebe
   banner remetendo a "Pode fazer sentido — após validação" (`:904-906`).
2. Gap alto **não priorizado** vai para dentro de um `<details>` fechado
   ("Possíveis formas de apoio aos demais gaps altos", `:910`) — fácil de perder.
3. **A tela de práticas-alvo — onde o cliente estava — não consulta o `MAP`.**
   `tgtEnablersHTML` (`ui_target_v32.js:158-167`) lê **só** o contexto do engine
   V3.2 (`buildRecommendationContext`), que sob landscape UNSET devolve
   `CONTEXT_NOT_INFORMED` → `supportMode:"LEGACY-LABELLED"` → `candidates: []`
   (`engine_v32.js:401`, `:601-602`). Resultado: card mudo.

Corolário que precisa estar na mesa: **os itens 4 e 6 são a mesma causa.** O
bloco "Leitura base — contexto tecnológico não informado" só existe porque houve
capability com gap sob UNSET — e é exatamente a razão pela qual as recomendações
do item 4 não apareceram. Suprimir o bloco (item 6) sem tratar o item 4 apaga a
única pista de por que o relatório está pobre.

Segundo corolário: **a proposta do analista para o item 8 cancela o item 4.** Ele
propõe que "a seção separada 'Formas de apoio' deixa de existir". Essa seção
(`#p52-sec-support`) é justamente onde os `.apoio-block` congelados nomeiam
FortiEndpoint, FortiNDR e FortiRecon hoje. Removê-la sem antes levar o
habilitador para o card é remover a única superfície que atende o item 4.

#### Rotas para o item 4 — custo real

| Rota | O que faz | Toca | Custo / rito | Parecer |
|---|---|---|---|---|
| **R1 — `MAP` congelado como fonte do habilitador** | `tgtEnablersHTML` passa a somar, aos candidatos do engine, os itens de `MAP[qid].lv[nível ATUAL].c` + `PRODUCTS` | `ui_target_v32.js` (só **lê** a Camada 1) | **Sem D2.** Camada 1 não é editada. Gate novo de aceite (habilitador do card == `MAP` do nível atual confirmado, oráculo independente) | **Recomendada.** Cobre os 4 pedidos nominais do cliente, com dado já publicado na mesma tela, sem inferir posse de tecnologia |
| **R2 — estender `QS_GAP_SUPPORT`** | Amplia a tabela curada de impressão (hoje 4 de 15 qids: `detection-lifecycle`, `logs`, `automation`, `vulnerability-management`) para `endpoint`, `network-visibility`, `external-surface` | `ui_v32.js:899`, `tests_p50_core.js:3179`, `tests_p51_mutants.js:72` | **Não é grátis.** `QIDS_AUTORIZADOS` é oráculo com **âncora normativa externa** (diretriz §UAT-07 da Phase 5.1, selada). Ampliar exige declarar a âncora nova na spec **antes** do código | Só se houver exigência de paridade no PDF. Redundante com R1 |
| **R3 — engine, Porta B** | `classify` sob UNSET passa a emitir candidatos | `engine_v32.js` (`frozen`) | Payload M41 muda → **Porta B**: spec + auditoria independente humana + regressão + repin | **Recuso.** Quebra a definição de *Whitespace* no CONTEXT.md e a frase do próprio produto ("nenhum produto é inferido sem contexto", `ui_v32.js:577`). Caro e errado |
| **R4 — conversão (aviso único)** | Um aviso no topo: "Contexto tecnológico não preenchido — N práticas não puderam ser refinadas", com link ao editor e a lista das capabilities afetadas | camada de apresentação | Baixíssimo | **Recomendada junto de R1.** Ataca a causa, não o sintoma |

**Recomendação: R1 + R4, na mesma demanda que os itens 6 e 8.** R3 recusada.

Limite honesto de R1: **FortiNAC não existe em nenhuma camada do catálogo** (nem
`PRODUCTS` da Camada 1, nem `OFFERINGS` do engine). FortiSIEM existe, mas
vinculado a `logs`/`detection-lifecycle`, não a `network-visibility`. Atender ao
cliente nessas duas menções exigiria Camada 1 (Porta B) ou tabela nova de UI.

### Desafio aos demais itens

- **Item 1 — não é numeração, e não é relatório.** `<span class="key">` é
  **tecla de atalho** (`:728`), com handler congelado `findings[n-1]` (`:1058`).
  Duas causas somadas: findings acima do 9º recebem `·` por desenho, e a camada
  UX reagrupa os botões por domínio (`ui_ux_v32.js:154`), embaralhando 1..9 na
  leitura. É outra superfície (tela de prioridade) e outro público. **Sai desta
  demanda.**
- **Item 3 — "próximos passos em bullet points": já existem.** `evolutionThemes`
  alimenta **duas** superfícies com o mesmo conteúdo: a lista `<ul>` "Para
  avançar" (`ui_journey_v32.js:208`) e o parágrafo P3 da narrativa, que junta os
  mesmos temas com `;` (`:142`). E `p52ExecPair` (`ui_p52_workspace_v32.js:2040`)
  põe as duas **lado a lado** na seção executiva. O problema não é falta de
  bullets: é a repetição em prosa ao lado da lista. Criar uma terceira lista
  pioraria. **Recomendo remover a duplicação, não adicionar formato.**
- **Item 6 — "Apoio nas prioridades declaradas · contexto V3.2".** O analista
  atribuiu a exposição de `V3.1.3`/`V3.2` ao "Por que apareceu". Correção: são
  origens diferentes. `V3.1.3`/`V3.2` estão no **corpo** do card de leitura base
  (`ui_v32.js:577`) e no **título** da seção (`:623`); o texto literal da pergunta
  está em **dois** lugares — `whyHTMLOf` (`:536-547`, dentro de `<details>`) e o
  `.why` do bloco **congelado** (`quickscan_...v3_1_3.html:865`, **sempre
  visível**). Este último não some sem tocar superfície congelada.
- **Item 9 — o pedido já está atendido.** "Base de evidência da sessão" já é
  `<details>` sem `open` (`ui_p52_workspace_v32.js:2073`), já só existe com o gate
  ABERTO, e já é anexado à **última** seção ("Relatório e sessão", `:2244`). Não
  há "falta posição". O que resta decidir é se a linha-resumo do `summary` ainda
  é proeminente demais — e isso reabre a decisão selada SUFF-REV-A §9.
- **Alternativa mais simples considerada.** Fazer só os itens 2, 3 e 5 (texto e
  micro-layout) e adiar ordem/redundância. **Não basta**: o incômodo do cliente
  nos itens 6, 7 e 8 é de *arquitetura de informação*, e mexer no texto de blocos
  que depois mudam de lugar é trabalho jogado fora.

### Conflito com decisão registrada

| Decisão registrada | Item que a tensiona | Encaminhamento |
|---|---|---|
| **P52-RES2 §7** — ordem canônica de leitura, com oráculo independente em `tests_p52_layout.js:56` (`P52_CANONICAL_ORDER`) | Item 7 | A ordem é âncora normativa externa ao produto. Mudar exige declarar a ordem nova **na spec desta demanda, antes do código**, e reescrever o oráculo a partir dela — não a partir do módulo |
| **P52-TGT1** — "o cenário-alvo permanece ANTES do contexto tecnológico", em **ambas** as ordens | Item 7 (a proposta do analista põe o alvo por último e não nomeia "Contexto tecnológico") | Precisa de decisão explícita: a proposta respeita P52-TGT1 se `target` vier imediatamente antes de `context`. Ver P8 |
| **Exceção de gate FECHADO** em `p52OrderFor()` (`:584-593`) — registrada como pendente de decisão do proprietário na UAT | Item 7 | Recomendo manter; a ordem nova precisa da mesma exceção |
| **SUFF-REV-A §9** — com resultado liberado, a suficiência vira "base de evidência" atrás de disclosure | Item 9 | O pedido do cliente é reabrir esta decisão. Recomendo **não** reabrir (ver P13) |
| **§UAT-07 (Phase 5.1)** — mapeamento mínimo de 4 qids, gate `QIDS_AUTORIZADOS` | Item 4 / rota R2 | Ampliar é reabrir diretriz de fase selada |
| **P52-REC1** (`tests_p52_layout.js:499-527`) — as formas de apoio continuam íntegras e dentro da própria seção; **e nenhum nome de produto pode estar embutido no owner de layout** (`:526`) | Itens 6 e 8 | Consequência dura: o habilitador **não** pode ser implementado em `ui_p52_workspace_v32.js`. Tem de viver em `ui_target_v32.js` / `ui_v32.js` |

### Uma demanda ou mais de uma

**Recomendação: três demandas.**

- **009 (esta) — leitura do relatório.** Itens **2, 3, 5, 7, 9** + a regra geral
  de *bloco de ausência* + o defeito de `ui_target_v32.js:166`. É tudo
  apresentação: ordem, texto, redundância. Não decide fonte de recomendação.
- **010 — habilitadores na prática-alvo.** Itens **4, 6 e 8** juntos, porque são
  a mesma decisão de produto e o mesmo card. Separá-los produziria um estado
  intermediário em que o relatório perde conteúdo (item 6 removido) antes de
  ganhar o substituto (item 8 entregue).
- **011 — tela de prioridade.** Item **1**. Outra superfície, outro público,
  e a rota barata provavelmente envolve a camada UX assumir o rótulo **e** o
  mapeamento da tecla — decisão técnica, não de relatório.

**Decidido no portão (P1, 2026-08-27): a divisão em três é adotada.** O escopo
vinculante da 009 está em "Escopo desta demanda — decidido no portão". Este
documento permanece como refinamento **da 009** e como insumo levantado para a
010 e a 011 — que abrem com refinamento próprio, sem herdar aceite deste.

## Sistema real

Tudo abaixo foi lido no source desta worktree. Classes de proteção conferidas em
`.claude/verify/boundary.json`: `engine_v32.js` e
`quickscan_secops_soccmm_v3_1_3.html` são `frozen`; `..._v3_2_dev.html` é
`generated`; as demais camadas `ui_*` **não** são protegidas.

**Item 1 · tecla de atalho, não índice.**
`quickscan_secops_soccmm_v3_1_3.html:728` — `${sel?"✓":(i<9? i+1 : "·")}`;
handler em `:1058` (`findings[n-1]`). Com 15 perguntas, uma sessão pode produzir
até 15 findings: do 10º em diante o glifo é `·` por desenho. `uxPriority`
(`ui_ux_v32.js:154-178`) move os nós originais para grupos por domínio, então a
sequência 1..9 aparece fora de ordem. **Confirmado.**

**Item 2 · régua de leitura aplicada a legenda.**
`JOURNEY_NEXT_NOTE` (`ui_journey_v32.js:10`) é a frase "…A transição depende da
evolução consistente…". Renderizada em `.ux-micro.jn-note` (`:209`); dentro de
`.p52-sec`, `.ux-micro` recebe `max-width:78ch` (`ui_p52_workspace_v32.css:52-54`,
comentário: "Linha de leitura confortável"). O único CSS próprio de `.jn-note` é
`margin-top:10px` (`ui_ux_v32.css:193`). **Confirmado** — e a régua de 78ch é
desenho deliberado, então o consenso a alcançar é "a nota é legenda, não corpo".

**Item 3 · cor e duplicação.**
`--dom-accent` já existe por `[data-dom]` (`ui_ux_v32.css:68-72`).
`buildExecutiveNarrative` emite domínios como texto puro via
`joinPt(ex.hi)`/`joinPt(ex.lo)` (`ui_journey_v32.js:107`) e a renderização escapa
o parágrafo inteiro (`:217`, `esc32(p)`), o que impede markup na string. Existe
precedente exato de pós-processamento por casamento textual determinístico: os
eixos do radar em `ui_ux_v32.js:190-192`, com o comentário normativo "match
textual determinístico; nunca só cor". **Duplicação confirmada**: `evolutionThemes`
alimenta a `<ul>` "Para avançar" (`:207-208`) e o P3 (`:139-142`), e
`p52ExecPair` põe as duas lado a lado.

**Item 4 · o silêncio tem três causas, e uma delas é frozen.**
`classify` (`engine_v32.js:392-418`): UNSET + gap → `CONTEXT_NOT_INFORMED`.
`buildRecommendationContext` (`:601-602`): `supportMode:"LEGACY-LABELLED"`, sem
candidatos. **Nuance importante**: serviços **continuam** sendo anexados sob
UNSET, porque o laço de `SERVICES` (`:653-664`) depende só de `hasGap`. Logo o
card de prática-alvo pode mostrar "serviço" e nunca produto.
`resolveCandidates` (`:436-469`) só é chamado sob `TECHNOLOGY_WHITESPACE`.
Catálogo do engine confere: `fortisoar` (`:113`), `fortiendpoint` (`:120`),
`ndr-family` (`:89`), `fortirecon` (`:154`), com `capabilityRelations` corretas.
As capabilities correspondentes têm `assessmentCoverage:"direct"` (`:55-57`) —
não há bloqueio por `UNASSESSED_CAPABILITY`.
**Divergência doc×código relevante**: a Camada 1 congelada tem seu **próprio**
catálogo (`PRODUCTS` `:262-276`, `MAP` `:420-467`) que recomenda produto a partir
**só do gap**, sem contexto. Duas doutrinas no mesmo relatório.
**Defeito real** em `ui_target_v32.js:166`: a mesma frase — "Nenhum habilitador
tecnológico específico foi identificado pelo contexto atual. A evolução desta
prática pode depender principalmente de processo, pessoas, governança…" — cobre
UNSET **e** contexto informado sem aderência. Sob UNSET ela afirma uma conclusão
que a sessão não sustenta.

**Item 5 · o glossário existe, no lugar errado.**
`P52_CAP_HELP` (`ui_p52_workspace_v32.js:204+`) tem verbetes curtos, neutros e
**sem produto** por `capId`, hoje só como popover no editor. A seção de
resultados imprime apenas rótulos: `#v32decl` lista as declarações e `#v32interp`
a classificação (`ui_v32.js:250-253`), com `p52ContextSummary` (`:844-855`)
acrescentando a contagem. **Confirmado**: a explicação existe e não chega ao
leitor do relatório.

**Item 6 · a redundância é tripla, e as três origens são distintas.**
A prioridade declarada aparece em: (a) `.prio-decl` na seção "Prioridades do
negócio"; (b) `.apoio-block` congelado na seção "Formas de apoio", com
`.why` sempre visível; (c) cards V3.2 sob "Apoio nas prioridades declaradas ·
contexto V3.2" (`ui_v32.js:623`), que — **correção à triagem** — não caem na
seção "Formas de apoio": estão dentro de `#v32panel`, e `p52Classify` roteia o
`#v32panel` inteiro para o balde **`context`** (`ui_p52_workspace_v32.js:618`).
Ou seja, hoje o leitor encontra apoio a prioridades dentro da seção "Contexto
tecnológico". "Leitura base — contexto tecnológico não informado" (`:633`) tem a
mesma origem e o mesmo destino.

**Item 7 · a ordem e suas duas cláusulas duras.**
`P52_SECTIONS` (`ui_p52_workspace_v32.js:550-560`): exec, target, context,
evidence, detail, priorities, gaps, support, actions. `p52OrderFor()` (`:584`)
sobe `evidence` para a 2ª posição sob gate `blocked`. Seção sem conteúdo **já
não renderiza** (`:2212`, `if (!nodes || !nodes.length) continue;`) — a regra
"bloco vazio não aparece" já existe no nível de seção; o que o analista propõe é
estendê-la ao nível de bloco. Oráculo independente da ordem em
`tests_p52_layout.js:56`.

**Item 8 · o card já tem o slot.**
`tgtEnablersHTML` (`ui_target_v32.js:158-167`) já renderiza uma linha discreta de
habilitadores por prática-alvo, consumida em `:134` (tela) e `:267` (impressão).
Não é preciso inventar superfície: é preciso resolver a **fonte** (P2/P3).

**Item 9 · já implementado como pedido.**
`p52EvidenceBase` (`ui_p52_workspace_v32.js:2073-2096`): `<details>` sem `open`,
só criado com gate aberto, anexado à seção `actions` — a última (`:2244`).

## Casos de borda

| # | Caso | Comportamento esperado |
|---|---|---|
| B1 | **UNSET × NONE** no mesmo relatório | Nunca a mesma frase. UNSET → "você não informou" + caminho para informar; NONE → "ausência declarada", que é informação positiva e pode habilitar whitespace. Corrige `ui_target_v32.js:166` |
| B2 | **Suficiência FECHADA** | A ordem muda (`p52OrderFor`): "Evidência e suficiência" em 2ª posição. Vale para a ordem nova. Nenhum habilitador, nenhum produto e nenhuma prática-alvo publicados; score continua `n/d`, nunca zero |
| B3 | **Sem prioridades declaradas** (`hasPrio` falso) | A Camada 1 troca para "Gaps observados na sessão" + "Como a Fortinet pode apoiar agora" (`:922-938`). A seção "Prioridades do negócio" fica vazia e **não renderiza**. A leitura executiva já diz "Nenhuma prioridade específica foi declarada" (`ui_journey_v32.js:125`) — o relatório não pode dizer isso duas vezes |
| B4 | **Sem cenário-alvo** | Seção `target` sem nós → não renderiza. Nenhum habilitador em lugar nenhum por essa via. A nota `JOURNEY_TGT_NOTE` não é concatenada (`ui_journey_v32.js:209`) |
| B5 | **target == current** | `setTarget` aceita alvo igual; `revalidateTargets` o remove depois (assimetria em `design-decisions.md`, candidata pendente). A prática-alvo pode desaparecer entre dois renders — o habilitador não pode virar órfão nem deixar seção vazia com título |
| B6 | **Alvo em outro score, mesmo estágio** | A narrativa já trata (`ui_journey_v32.js:150-152`). A ordem nova não pode separar essa frase do gráfico que ela explica |
| B7 | **Zero gaps, com suficiência** | Banner "Nenhum gap relevante identificado" (`:926`). Não pode existir seção de habilitador, nem aviso de contexto pendente: sem gap, o contexto não faria diferença. O aviso do item 4/R4 deve contar **capabilities com gap sob UNSET**, não capabilities sob UNSET |
| B8 | **Zero gaps, sem suficiência** | Banner distinto (`:930`) — "insuficientes para concluir que não há gaps". Nunca colapsar B7 e B8 na mesma frase: é o mesmo erro do B1 |
| B9 | **Contexto parcialmente informado** | Estado mais comum e o menos tratado hoje. Umas capabilities com candidato, outras mudas. O aviso único precisa nomear **quais** ficaram de fora, senão o leitor conclui que não há o que recomendar |
| B10 | **Resposta NA ("a validar")** | Não é gap e não gera habilitador. `computeFindings` a envia para `validate`; a capability entra em `NEEDS_VALIDATION`. O card de prática-alvo sobre uma pergunta NA não pode exibir produto |
| B11 | **Gap moderado (sev 1)** | Hoje: sem `apoioBlock` na Camada 1; `MAP[...].lv[1].c` **tem** candidatos. Se o habilitador do card cobrir moderado, o relatório passa a mostrar em um lugar o que outro lugar cala. Decisão explícita em P4 |
| B12 | **Mais de 9 findings na tela de prioridade** | Do 10º em diante o glifo é `·`. Demanda 011 |
| B13 | **Capability sem verbete em `P52_CAP_HELP`** | Não ganha explicação — nada é inventado (regra já escrita em `ui_p52_workspace_v32.js:201-202`). O item 5 herda essa regra |
| B14 | **Tier T3** (não priorizado, com evidência positiva) | Continua sendo evidência positiva; a reordenação não pode empurrá-lo para depois de "Relatório e sessão" nem misturá-lo com gaps |
| B15 | **Impressão / PDF** | `beforeprint` expande **todos** os `<details>` (`quickscan_...v3_1_3.html:1065`). Logo, "colapsado por padrão" (itens 6 e 9) não protege o PDF: no papel tudo abre. Qualquer decisão de ocultação precisa dizer o que acontece no papel |

## Vocabulário

Com o portão fechado, os cinco verbetes foram **registrados no `CONTEXT.md`**
(R12), acrescentados ao fim da seção "Metodologia (produto)" — nenhum verbete
existente foi reordenado ou reescrito. Cópia fiel do que entrou:

```md
**Habilitador**:
Item de catálogo (produto ou serviço) que PODE apoiar a evolução de uma prática,
apresentado como possibilidade condicionada e sempre derivado de evidência
confirmada. Nunca é requisito, compra recomendada, nem origem do cenário-alvo.
Termo canônico de doc, spec e prompt; as strings já congeladas na UI permanecem
como estão (INV-10).
_Evitar_: recomendação, solução, caminho de apoio, forma de apoio
```

```md
**Bloco de ausência**:
Bloco de resultado cujo único conteúdo possível é declarar que algo não foi
informado ou não foi avaliado. Não renderiza: a ausência vira um aviso único e
acionável, com a lista do que ficou de fora.
_Evitar_: bloco vazio, placeholder, estado nulo
```

```md
**Ordem canônica de leitura**:
Sequência declarada das seções do resultado (P52-RES2), que É a ordem do DOM, do
foco e do trilho lateral — e tem uma exceção declarada sob gate de suficiência
fechado. Alterá-la exige âncora normativa nova antes do código.
_Evitar_: layout, ordem visual, disposição
```

```md
**Base de evidência da sessão**:
Disclosure do resultado que guarda o painel canônico de suficiência quando o gate
está ABERTO, para responder "de onde saiu este número". É de SESSÃO — distinta do
*Acervo de evidência*, que é o conjunto congelado que sustenta a selagem de uma
fase.
_Evitar_: acervo, anexo, evidências da sessão
```

```md
**Tecla de atalho (priorização)**:
Glifo 1–9 exibido no botão da tela de prioridade que indica o ATALHO DE TECLADO
daquele item, não a sua posição numa lista. Itens além do nono não recebem
atalho.
_Evitar_: numeração, índice, ranking, ordem
```

**Conflito de vocabulário — resolvido no portão.** O mesmo conceito aparece hoje
como *habilitador* (`ui_target_v32.js:167`), *caminho de apoio* (`ui_v32.js:954`),
*forma de apoio* (`P52_SECTIONS`) e *apoio direto/contextual* (engine).
**Resolução registrada**: **Habilitador** é o termo canônico de doc, spec e
prompt — está no próprio verbete, no `CONTEXT.md`. As strings já congeladas na UI
permanecem exatamente como estão, porque a INV-10 manda o nome no código seguir o
artefato. Doc novo que precise citar a string congelada cita-a entre aspas, sem
adotá-la como termo.

## Rodadas de entrevista

| Rodada | Pergunta | Resposta do usuário |
|---|---|---|
| R0 | Item 5 refere-se ao editor de contexto ou à seção de resultados? | **Seção de resultados** — não o editor |
| R0 | A demanda 008 concorre com esta em disco? | Não — conduzida em outra sessão ("Demanda dos ZIPs"), worktrees separadas |
| R0 | O feedback do cliente e o parecer do analista autorizam fase ou dispensam invariante? | Não — são **dado a refinar**; autorização só vem do usuário no chat |
| R1 | P1–P15 abaixo, uma recomendação cada | **"Sigo as recomendações"** — usuário, no chat, 2026-08-27. Adota P1–P15 pela recomendação de cada uma |
| R1 | P15 · existe o JSON/PDF da sessão real de 2026-08-27? | **Não localizada.** `QuickscanData/clients` vazio e `D:\QuickscanData` inacessível nesta máquina (verificado pelo orquestrador) |
| R1 | P7, sub-pergunta · suprimir também o `.why` sempre visível do bloco **congelado**? | **Não.** Não houve recomendação de suprimir; a Camada 1 permanece apenas **lida** |

### Respostas — R1 · adotadas

Cada P abaixo está **respondida pela sua própria recomendação**, pela aprovação
literal do usuário em 2026-08-27. O texto original de cada pergunta permanece
para preservar o raciocínio que sustenta a resposta — não são pendências.

Duas exigem registro à parte, porque a resposta não é simplesmente "sim":

- **P15 — não reproduzida.** A sessão real de 2026-08-27 não foi localizada. O
  diagnóstico do vão entre camadas (Camada 1 congelada recomenda por gap; engine
  V3.2 exige contexto declarado; o card de prática-alvo só consulta o segundo)
  fica **fundamentado no source, não reproduzido em caso real**. Isso não bloqueia
  a 009, que não depende dele: vira **pendência declarada da spec da 010**, que é
  quem age sobre o vão. A spec da 010 precisa dizer como fecha essa lacuna —
  fixture sintética com landscape UNSET + gaps, ou nova sessão com o cliente.
- **P7 — a Camada 1 continua apenas lida.** O `.why` sempre visível do
  `apoioBlock` congelado (`quickscan_secops_soccmm_v3_1_3.html:865`) **não é
  suprimido**. Nenhum rito de superfície congelada é aberto por esta demanda nem
  pela 010 a partir deste refinamento. Registrado aqui para não virar ambiguidade
  na Fase 1.

**A qual demanda cada resposta obriga** — para que a Fase 6 não meça a 009 contra
o que a 009 nunca prometeu:

| Obriga a 009 | Obriga a 010 | Obriga a 011 | Meta |
|---|---|---|---|
| P8, P9, P10, P11, P12, P13, P14 (parte) | P2, P3, P4, P5, P6, P7, P14 (parte), P15 | *(nenhuma — o item 1 abre com refinamento próprio)* | P1 |

**P1 · Escopo.** Confirma a divisão em três demandas — **009** (itens 2, 3, 5, 7,
9 + regra de bloco de ausência + defeito de `ui_target_v32.js:166`), **010**
(itens 4, 6, 8) e **011** (item 1)? *Recomendação: sim.* A fronteira 009×010 é a
discutível; 011 é claramente outra superfície.
**Resposta: adotada.** Escopo formalizado em "Escopo desta demanda — decidido no
portão", que é o contrato de aceite da 009.

**P2 · Item 4, rota.** Adota **R1 (`MAP` congelado como fonte do habilitador,
leitura apenas) + R4 (aviso único de contexto pendente)**, e recusa **R3
(engine, Porta B)**? *Recomendação: sim.* R2 (estender `QS_GAP_SUPPORT`) só se
houver exigência de paridade no PDF.

**P3 · Item 4, ancoragem.** O habilitador do card lê o `MAP` do **nível ATUAL
confirmado** ou do **nível ALVO**? *Recomendação: nível atual.* Ler o alvo faz o
produto virar função da ambição e tensiona a INV-5.

**P4 · Item 4, severidade.** O habilitador aparece só em **gap alto** (paridade
com o bloco congelado) ou também em **gap moderado**? *Recomendação: alto e
moderado.* O `MAP` já tem candidatos para `s:1`, e o silêncio no card foi
exatamente a queixa. Aceito o custo: passa a haver produto no card que a seção
congelada não mostra.

**P5 · Item 4, limite do catálogo.** **FortiNAC não existe em nenhuma camada** do
catálogo, e FortiSIEM não está vinculado a `network-visibility`. Fica fora, ou o
cliente exige cobrir as duas menções? *Recomendação: fora de escopo* — entrar
exige Camada 1 (Porta B) ou tabela curada nova.

**P6 · Item 6, "Leitura base".** Suprimir o bloco por capability e trocar por um
aviso único **com a lista das capabilities afetadas**, ou manter como está?
*Recomendação: trocar, com a lista.* Sem a lista, some a única pista de por que
o item 4 aconteceu.

**P7 · Item 6, "Apoio nas prioridades declaradas · contexto V3.2".** Remover a
seção inteira, ou remover só o título/sufixo de versão e manter os cards que
acrescentam (VALIDATE e CONTEXTUAL com nota)? *Recomendação: a segunda.* Remover
tudo apaga o "o que validar", que é conteúdo real. Sub-pergunta: o `.why` sempre
visível do bloco **congelado** (`quickscan_...v3_1_3.html:865`) também incomoda?
Se sim, é supressão de superfície congelada — rito nomeado, não "de passagem".
**Resposta: adotada (a segunda). Sub-pergunta: NÃO suprimir** — não houve
recomendação nesse sentido, logo a Camada 1 permanece apenas **lida** e nenhum
rito de superfície congelada é aberto. Obriga a **010**.

**P8 · Item 7, ordem completa.** A proposta do analista nomeia 5 seções; o
sistema tem 9. Confirma esta ordem?
`1 Visão executiva · 2 Prioridades do negócio · 3 Domínios e heat map · 4 Gaps
observados · 5 Cenário-alvo · 6 Contexto tecnológico · 7 Formas de apoio ·
8 Evidência e suficiência · 9 Relatório e sessão`
*Recomendação: sim* — preserva **P52-TGT1** (alvo imediatamente antes do
contexto) e mantém a exceção de gate fechado (evidência sobe para a 2ª posição).
Se 010 absorver "Formas de apoio" no card, a posição 7 simplesmente deixa de
renderizar.

**P9 · Item 3, cor.** Colorir os domínios da leitura executiva por
**pós-processamento textual determinístico** (precedente dos eixos do radar,
`ui_ux_v32.js:190-192`), mantendo um canal não-cromático junto — em vez de
injetar markup na narrativa? *Recomendação: sim.* Markup na string quebraria o
pipeline determinístico + `trace` da INV-7.

**P10 · Item 3, próximos passos.** "Para avançar" **já** é lista de bullets ao
lado da narrativa. Remove-se a repetição em prosa do P3 (a narrativa passa a
apontar para a lista), ou mantém-se as duas? *Recomendação: remover a
repetição.* Criar uma terceira lista seria a pior das saídas.

**P11 · Item 5, granularidade.** A explicação de uma frase no resultado é **por
capability declarada** (reusando `P52_CAP_HELP`, neutro e sem produto) ou também
**por opção escolhida** (presença/status)? *Recomendação: por capability
declarada*, só onde houve declaração. Capability sem verbete não ganha texto.

**P12 · Item 2.** A régua de 78ch é desenho ("linha de leitura confortável"). A
nota da jornada é **legenda de card full-bleed**, não corpo de texto — excluí-la
da régua? *Recomendação: sim*, e apenas ela, não a classe `.ux-micro` inteira.

**P13 · Item 9.** A base de evidência **já** é `<details>` fechado, na última
seção, só com gate aberto — exatamente o que o analista recomenda. Mantém como
está (o cliente perde o incômodo ao ver que é apêndice), ou reabre a decisão
selada SUFF-REV-A §9 para tirá-la da vista do cliente? *Recomendação: manter.*
Lembrar do B15: no PDF ela abre de qualquer forma.

**P14 · Superfícies.** As mudanças de ordem, redundância e glossário valem também
para o **relatório impresso/PDF** (`pr-*`), ou só para a tela? *Recomendação:
redundância e glossário sim; ordem do PDF em demanda própria*, porque o print
tem estrutura própria e gates visuais próprios (job `visual`, KI-3).

**P15 · Reprodução.** Existe o JSON de sessão (ou o PDF) da sessão de 2026-08-27?
Sem ele, o diagnóstico "faltou FortiSOAR porque o contexto estava UNSET e/ou o
gap era moderado" é **provável, não provado**. Com ele, a spec do 010 nasce
ancorada em caso real.
**Resposta: sessão NÃO localizada** (`QuickscanData/clients` vazio;
`D:\QuickscanData` inacessível nesta máquina — verificado pelo orquestrador).
O diagnóstico permanece **fundamentado no source, não reproduzido em caso real**.
Não bloqueia a 009. Vira **pendência declarada da spec da 010**, que precisa
nomear como fecha a lacuna (fixture sintética com landscape UNSET + gaps altos e
moderados, ou nova sessão com o cliente). Obriga a **010**.

## Fora de escopo (explícito)

Com o portão fechado, nada aqui é "pendente": tudo abaixo está **decidido como
fora**.

1. **Qualquer alteração no `engine_v32.js`.** Nenhum item exige mudança de
   comportamento do motor. Rota R3 recusada.
2. **Qualquer alteração no `quickscan_secops_soccmm_v3_1_3.html`.** A Camada 1 é
   `frozen` e aqui é apenas **lida** — inclusive o `.why` sempre visível do
   `apoioBlock` (`:865`), que **não** é suprimido (P7). Nenhum rito de superfície
   congelada é aberto por esta demanda.
3. **Score, suficiência, limiar, tier e cenário-alvo.** Nenhum número muda.
   Nenhuma regra de publicação muda.
4. **Recomendar produto a partir de ausência não declarada.** Sob UNSET o
   relatório não afirma que o cliente não tem tecnologia. Nenhuma rota adotada
   infere posse.
5. **FortiNAC e vínculo FortiSIEM↔`network-visibility`** — fora, por P5. Entrar
   exigiria Camada 1 (Porta B) ou tabela curada nova.
6. **Itens 4, 6 e 8 (habilitadores na prática-alvo)** — demanda **010**, por P1.
7. **Item 1 (tela de prioridade)** — demanda **011**, por P1.
8. **Editor de contexto tecnológico.** O item 5 é a seção de resultados
   (confirmado em R0). O popover do editor fica como está.
9. **Reordenação do relatório impresso/PDF** — fora, por P14: a ordem do print
   tem estrutura e gates visuais próprios (job `visual`, KI-3) e, se for
   desejada, abre em demanda própria. O glossário do item 5 **acompanha** o
   print; a ordem, não.
10. **Mudança de invariante.** Nenhuma das dez é proposta para alteração.
