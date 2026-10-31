# Desenho B — fonte única no dono do estado (encaminhamento do EA-76)

Demanda em abertura: **026 — contrato único de decisão de apoio**. Lente `tech-lead`, somente leitura, base `develop @ 9509e4b`. Este documento **propõe**; quem delega é o orquestrador (R5). Toda afirmação cita `arquivo:linha` lido nesta sessão; o que vem das lentes anteriores (contrato do motor, custo de identidade, anatomia, inventário de gates, refutação) é citado como insumo e foi conferido no código onde é decisivo.

## 0 · O desenho em uma página

**Tese.** "O que o motor ofereceu nesta sessão" passa a ser derivado **uma vez**, em `ui_curation_v32.js` (dono do estado de curadoria, `core-engineer`, bridge `__CURATION`), como uma lista de **registros de decisão** — e não como uma lista de chaves. `ui_p52_support_v32.js` (tela e papel) e `ui_curation_edit_v32.js` (editor) passam a **consumir** esses registros pelo bridge. A função `ofertados()` de hoje (`ui_curation_v32.js:96-152`) e o `ofertaDoMotor()` de hoje (`ui_p52_support_v32.js:247-346`) são as duas cópias que o `EA-76` (`.claude/BACKLOG.md:7094`) nomeia; a segunda vira um leitor da primeira.

**Reconciliação.** A Camada 1 (`MAP`, `quickscan_secops_soccmm_v3_1_3.html:420-467`) continua sendo o **catálogo de hipóteses por pergunta**. O motor (`engine_v32.js`, congelado, zero toque) **corrige** essas hipóteses sempre que tem voz: veta (arquitetura, gap operacional, plataforma declarada, elegibilidade de serviço, validação pendente), troca a variante (`fortiedr`, `fortindr-onprem`, `fortisiem-cloud`), qualifica (prioritária/após validação, escopo, modalidade a definir) e acrescenta o que ele próprio resolve (candidatos DIRECT/contextuais, serviços, itens por sinal). Onde o motor **se abstém** — modo legado (`:552`) e `CONTEXT_NOT_INFORMED`/`LEGACY-LABELLED` (`:601-602`) — a hipótese da Camada 1 passa **inteira**, rotulada como hipótese. Nenhum produto é inferido de ausência de contexto (pin `V10`, `ui_v32.js:670-679`).

**Identidade.** Cada registro tem **duas** identidades, com papéis distintos: `chave` (a linha curável — id da Camada 1 quando existe pareamento por critério; senão o id do motor) e `itemId` (o item que o motor resolveu). Deduplicação é por `chave`; o nome exibido nunca é chave. O estado da curadoria (`decisions`) continua `{ chave → include|exclude }`: **zero linha** em `paraSessao`/`validar`/`daSessao`, zero linha em `ui_session_v32.js`, zero bump de schema. A curadoria passa a alcançar variantes **através da linha** (excluir `FortiEndpoint` retira o card qualquer que seja a variante resolvida) e alcança itens do motor sem linha pela **chave do motor** (curáveis para `exclude`; acréscimo humano continua sendo só do catálogo da Camada 1).

**Papel.** `papelHTML()` (`ui_p52_support_v32.js:794-834`) continua derivando dos cards da tela (`D019-PAR1`), e passa a copiar o que hoje omite: qualificador (`data-p53-sol-tier` + texto), ação, variante, escopo, elegibilidade, origem — mais o bloco de vetos. Resolve o QS-02 por construção.

**Custo.** Dois módulos de produto (`ui_curation_v32.js` ≈ +190 linhas; `ui_p52_support_v32.js` ≈ +40 líquidas) + CSS (+25) + editor (+8); uma suíte nova `tests_026_contrato.js` (3 gates, 4 mutantes); 1 reancoragem de mutante por arquivo (`D022-M10`) e 2 reancoragens de gate por nome (`D019-CTX1 (a)`, `D025-UNS1`); nenhuma âncora da campanha d019 muda; registros (`expected_suites.json`, `mutation_map.json`, `bridges.json`, `pins.json`) no mesmo PR. Engine e Camada 1 intocados.

---

## 1 · O registro de decisão — shape, onde nasce, quem consome

### 1.1 Shape (campos mínimos; vocabulário fechado onde uma máquina resolve)

```js
/* um registro por CHAVE publicável nesta sessão — derivado, recomputado a cada chamada,
   nunca serializado (INV-8) */
{
  chave:        "FortiEndpoint",            // linha curável: id de PRODUCTS, ou id do motor se sem linha
  nome:         "FortiEDR",                 // nome exibido: do item resolvido (1 itemId ∈ OFFERINGS) ou da linha
  tipo:         "produto",                  // "produto" | "servico"
  itemId:       "fortiedr",                 // id do motor que a apresentação mostra; null só em hipótese pura
  itemIds:      ["fortiedr"],               // todos os ids do motor pareados a esta chave nesta sessão
  variante:     "FortiEDR",                 // nome do item quando difere do nome da linha; senão null
  variantes:    null,                       // placeholder de família: ["FortiEndpoint","FortiEDR"]; senão null
  modalidade:   null,                       // "a definir" quando o motor emitiu placeholder (engine_v32.js:462-466)
  acao:         "avaliar-aquisicao",        // enum fechado — ver 1.2
  origem:       "gap",                      // "gap" | "sinal" | "operador"
  tier:         1,                          // 1 = indicação prioritária · 2 = após validação (TIER, ui_p52_support_v32.js:240)
  caps:         ["Detecção e resposta em endpoint (EDR)"],   // textos exibidos (applyCopy), unidos
  sinais:       [],                         // rótulos PT-BR (sigPT), unidos
  escopo:       null,                       // scopeNote do motor (ex. "camada endpoint") ou `sn` da Camada 1
  elegibilidade: null,                      // serviço: "elegivel" | "validar" (note "elegível — validar deployment da base")
  entregaveis:  [],                         // serviços pareados à linha guarda-chuva: nomes de SERVICES[*].name
  motivo:       "restrição arquitetural declarada: saasAllowed=no"   // razão curta, para atributo/diag; nunca chave
}
```

Enum de `acao` (resolvido por máquina — recusa prosa, nuance vai para `motivo`):

| `acao` | quando | texto de apresentação (dono: `ui_p52_support_v32.js`) |
|---|---|---|
| `avaliar-aquisicao` | candidato `offering`/`family` sob `supportMode:"DIRECT"` (`engine_v32.js:571-572`) | "Ação: avaliar aquisição" (+ "— modalidade a definir no aprofundamento" quando `modalidade`) |
| `estender` | `contextual-extension` (`:587-588`, só `fortixdr`) | "Ação: estender a base instalada — não é nova aquisição" |
| `apoio-contextual` | `contextual-support` (`:640-641`) | "Ação: apoio contextual — não é aquisição direta" |
| `sinal` | `relation:"contextual-by-signal"` (`:608`) | (já existe: "habilitado por sinal declarado: …") |
| `servico` | item de `ctx.services[]` (`:653-665`) | "Ação: serviço" (+ elegibilidade quando `validar`) |
| `hipotese` | Camada 1 sem voz do motor (legado `:552`; `LEGACY-LABELLED` `:602`) ou acréscimo humano | "Hipótese da avaliação — contexto tecnológico não informado nesta capability" |

**Vetos** — lista paralela, também derivada, com a razão de supressão que a auditoria pede (QS-01 "Elegibilidade e razões de supressão"):

```js
{ chave:"FortiEndpoint", itemId:"fortiendpoint", nome:"FortiEndpoint", capability:"endpoint-detection",
  cap:"Detecção e resposta em endpoint (EDR)",
  classe:"arquitetura",   // "arquitetura" | "operacional" | "plataforma" | "avaliacao" | "validar" | "elegibilidade" | "sem-relacao"
  motivo:"restrição arquitetural declarada (saasAllowed=no) — variante resolvida: FortiEDR" }
```

`classe:"sem-relacao"` (o MAP oferece um produto que o motor não relaciona à capability sob contexto declarado, ex. `FortiXDR` em `automation` lv1, `v3_1_3.html:447`) fica **só no contrato** (diagnóstico/gate); as demais classes são **renderizadas** (tela e papel), porque carregam razão literal do motor.

### 1.2 Onde NASCE (R9 §5)

`ui_curation_v32.js`, função nova `reconciliar()` — pura sobre `computeFindings()`, `MAP`, `PRODUCTS`, `V32.buildRecommendationContext()`, `V32.OFFERINGS`/`SERVICES`/`SERVICE_FAMILIES`/`CAPABILITIES`, `V32.suppressedByPlatform()`, `V32.archSatisfied()`, `V32.serviceEligibility()` (todas públicas, `engine_v32.js:811-817`). Sem DOM, sem estado próprio; recomputa a cada chamada como `buildRecommendationContext()` faz (`ui_v32.js:272`).

`ofertados()` (`:96-152`) passa a ser `reconciliar().registros.map(r => r.chave)` deduplicado — **a assinatura pública `offered()` não muda** (devolve chaves), e `decidir()` (`:162-165`, âncora `D019-M2`) fica byte-igual.

Bridge `__CURATION` (`:265-315`) ganha dois getters e `contract()` ganha dois campos:

```js
oferta:  function () { return reconciliar().registros; },   // registros (derivado)
vetos:   function () { return reconciliar().vetos; },
contract: function () { return { published, offered, architectureNote, operatorChoices, suppressed,
                                 oferta: reconciliar().registros, vetos: reconciliar().vetos }; }
```

Por que no dono do estado e não em módulo novo: a derivação é lógica não-visual (`core-engineer`), e é **a porteira** de `decidir()` — colocá-la em outro módulo recriaria a distância entre "o que se oferece" e "o que se decide" que o `EA-76` mede. Orçamento R9 §7: 316 → ≈505 linhas, abaixo de 600. Se a implementação estourar, a alternativa registrada é extrair `reconciliar()` para `ui_oferta_v32.js` (IIFE, bridge `__OFERTA` em `bridges.json`, injetado antes de `CURJS` em `build_v32_html.py:22`); o contrato deste documento não muda.

### 1.3 Quem CONSOME

| consumidor | o que lê | como |
|---|---|---|
| `ui_p52_support_v32.js` — tela | `__CURATION.oferta()`, `vetos()`, `decide(chave)`, `isOperatorChoice(chave)`, `state()` | `ofertaDoMotor()` vira leitor do bridge (nome preservado — âncora `D019-M15`, `tests_019_mutants.js:240`) |
| `ui_p52_support_v32.js` — papel | os **cards da tela** (atributos + texto), como hoje (`:794-834`) | derivação, não recálculo (`D019-PAR1`) |
| `ui_curation_edit_v32.js` — editor | `offered()`, `catalog()`, `decide`, `set/unset`, **`oferta()` para o nome** | `nomeDe(id)` (`:72-75`) passa a preferir o `nome` do registro à `PRODUCTS[id].n` |
| `ui_v32.js` `temProdutoPublicadoV32` (`:729-745`) | `published()` | inalterado |
| `ui_session_v32.js` (`:69-77`) | `toSession()` | inalterado |

Nenhum consumidor lê atributo DOM escrito por outro módulo como canal de decisão (R9 §3); o papel lê os cards do **próprio** módulo, como já faz.

---

## 2 · Regras de reconciliação MAP × motor

### 2.1 Pareamento `itemId → chave` (critério, não lista — R12/EA-47)

```js
var REPRESENTANTE = { "endpoint-family": "FortiEndpoint", "fortiguard-labs-advisory": "FortiGuard-Service-Bundle" };
/* os dois únicos nós do motor sem nome na Camada 1 que AGRUPAM itens com linha: a família de endpoint
   (name "Fortinet Endpoint Security", engine_v32.js:87) e a família de serviços (:242-249). `ndr-family`
   pareia por nome ("FortiNDR", :89 = PRODUCTS.FortiNDR.n, v3_1_3.html:267). */
function chaveDe(itemId) {
  var o = V32.OFFERINGS[itemId] || V32.SERVICES[itemId]; if (!o) return null;
  var k = chavePorNome(o.name);                        // 1. nome exato: PRODUCTS[k].n === name (9 offerings + 2 services)
  if (k) return k;
  if (o.variantOf) { k = chaveDe(o.variantOf); if (k) return k; }   // 2. cadeia variantOf: fortisiem-cloud→fortisiem→FortiSIEM; fortindr-*→ndr-family→FortiNDR
  var fam = o.family || itemId;                        // 3. família com representante declarado: fortiedr→endpoint-family→FortiEndpoint
  if (REPRESENTANTE[fam]) return REPRESENTANTE[fam];
  for (var f in V32.SERVICE_FAMILIES)                  //    serviços: membro da família → linha guarda-chuva
    if (V32.SERVICE_FAMILIES[f].members.indexOf(itemId) >= 0 && REPRESENTANTE[f]) return REPRESENTANTE[f];
  return itemId;                                       // 4. sem linha: a chave É o id do motor (fortiaigate, fortipam, fortiauthenticator, fortimail*)
}
```

Inverso `linha → ids do motor` (para saber **por que** um produto do MAP não voltou): `idsDaLinha(chave) = ids ∈ OFFERINGS∪SERVICES com chaveDe(id) === chave`. `fortisoc` nunca é candidato (`recommendationPolicy:"architecture-only"`, `:93-94`) e não tem linha: fica fora do pareamento, e só aparece como **plataforma** em veto de classe `plataforma`.

### 2.2 Tabela de reconciliação por `classification` × `supportMode`

Para cada achado `f` de `computeFindings()` (`v3_1_3.html:522-533`) a capability é `cap(f.id)` (`CAPABILITIES[*].questionIds`, 1:1 com as chaves do MAP, `engine_v32.js:43-58`); `ctx = contexts[cap]`; `H` = produtos do MAP para `MAP[f.id].lv[f.lvl].c` (hipóteses da Camada 1, com `w` e `sn`); `sev` = `f.sev`.

| situação | registros emitidos | hipóteses `H` | tier |
|---|---|---|---|
| `legacyMode` (`:552`) | `H` inteira, `acao:"hipotese"`, `origem:"gap"` | passam | `sev 2 → 1`, senão 2 (como hoje e como `buildTiers`, `v3_1_3.html:545`) |
| `CONTEXT_NOT_INFORMED` / `LEGACY-LABELLED` (`:601-602`) **sem** `sup.caps.has(cap)` | `H` inteira como hipótese **+** `ctx.services[]` como `servico` (C7: `fortiguard-socaas` entra aqui) | passam | hipótese por `sev`; serviço por `maturity.state` |
| `CONTEXT_NOT_INFORMED` **com** `V32.suppressedByPlatform().caps.has(cap)` (C3) | nenhum produto; veto `plataforma` para cada `H` com o literal do motor (`:576`) + nome da plataforma (`sup.plat.offeringId` → `OFFERINGS.fortisoc.name`, ou `sup.plat.solution.product`) | **vetadas** | — |
| `TECHNOLOGY_WHITESPACE` / `DIRECT` (`:570-572`) | cada candidato `offering` → `avaliar-aquisicao` (`escopo` = `scopeNote`, relation `partial` sempre com escopo); `family` → `avaliar-aquisicao` + `modalidade:"a definir"` + `variantes` | `H` cuja linha **não** está entre os candidatos: veto `arquitetura` se algum `idsDaLinha(h)` tem `V32.archSatisfied(OFFERINGS[id].architectureRequires) === "violated"` (C1: `fortiendpoint` sob `saasAllowed:"no"`); senão `sem-relacao` | `maturity.state`: `gap-high → 1`, `gap-moderate → 2` |
| `TECHNOLOGY_WHITESPACE` / `CONTEXTUAL` por plataforma (`:573-577`) | nenhum produto | veto `plataforma` (nota `:576`) | — |
| `TECHNOLOGY_WHITESPACE` / `CONTEXTUAL` só `contextual-support` (`:646-650`) | `apoio-contextual` por candidato | `H` fora dos candidatos → `sem-relacao` | 2 |
| `OPERATIONAL_GAP` / `COVERAGE_GAP` / `ADOPTION_GAP` (`:579-590`) | `contextual-extension` → `estender` (`escopo` = M50); `contextual-support` → `apoio-contextual`; `services[]` → `servico` | veto `operacional` com `ctx.notes[0]` (C2, C4); + M75 quando suprimida | 2 (contextual) / serviço por maturidade |
| `EVALUATION_IN_PROGRESS` (`:591-594`) | só `services[]` | veto `avaliacao` (nota `:593`) | — |
| `TECH_STATUS_UNVERIFIED`, `NEEDS_VALIDATION`, `POSSIBLE_CONTEXT_DIVERGENCE` (`VALIDATE`, `:595-600`, `:630`) | só `services[]` por sinal (gap não dispara: `hasGap` falso, `:657`) | veto `validar` (nota do motor; `NEEDS_VALIDATION` sem nota: "resposta/evidência a validar" + `flags.insufficientEvidence` quando presente) | — |
| `UNASSESSED_CAPABILITY` / `CONTEXTUAL` por sinal (`:603-615`) | `offering` com `relation:"contextual-by-signal"` → `acao:"sinal"`, `origem:"sinal"`, `sinais` (C9) | (não há `H`: capability sem pergunta) | 2 |
| `UNASSESSED_CAPABILITY` licenciada (M62, `:621-625`) / `INVENTORY` / `NONE` / `null` | nada (serviço por sinal, se houver, ainda entra: `dfir` em capability madura) | — | — |
| `ctx.services[]` (qualquer modo, `:653-665`) | `tipo:"servico"`, `chave = chaveDe(serviceId)`; `elegibilidade:"validar"` se `note === "elegível — validar deployment da base"`; linha guarda-chuva acumula `entregaveis` | `H` que é linha de serviço (`SOCaaS`, `FortiGuard-MDR-Service`) e não está em `services[]`: `V32.serviceEligibility(sid)` → `eligible:false` ⇒ veto `elegibilidade` com `reason` (C7 MDR); `eligible:true` e não disparado ⇒ `sem-relacao` | `triggeredBy:["capability-gap"]` → maturidade; por sinal ou `elegibilidade:"validar"` → 2 |

**Regra única de aquisição** (contrato do motor §1): só `supportMode:"DIRECT"` com `itemKind ∈ {offering, family}` vira `avaliar-aquisicao`. Tudo o mais é contextual, serviço, sinal ou hipótese — por construção, não por lista.

**Fusão por chave** (dedup): dois registros com a mesma `chave` (produto que serve duas perguntas; `fortisiem` + `fortisiem-cloud` em C10; `ir-training` + bundle hipótese em `training`) fundem-se: `caps`/`sinais`/`itemIds`/`entregaveis` unidos, `tier` mínimo, `acao` a mais forte (`avaliar-aquisicao` > `estender` > `apoio-contextual` > `servico` > `sinal` > `hipotese`), `nome` = nome do item se `itemIds.length === 1` e `itemIds[0] ∈ OFFERINGS`, senão nome da linha. Ordem: primeira aparição (ordem dos achados, depois ordem de `Object.keys(contexts)`), como hoje.

### 2.3 Os casos, um a um

| caso | motor (medido, `scratchpad/out/*.json`) | regra aplicada | resultado |
|---|---|---|---|
| **C1** endpoint NONE, `saasAllowed:"no"`, `localProcessingRequired:"yes"` | `TECHNOLOGY_WHITESPACE`/`DIRECT`, `fortiedr/offering[atende]` | DIRECT: candidato → registro `chave:"FortiEndpoint"` (regra 3), `nome:"FortiEDR"`, `variante:"FortiEDR"`, `acao:"avaliar-aquisicao"`, tier 1; `H={FortiEndpoint}` → `idsDaLinha` = {fortiendpoint, fortiedr, fortixdr}; `fortiendpoint` `violated` → veto `arquitetura` ("saasAllowed=no — variante resolvida: FortiEDR") | card **FortiEDR** · indicação prioritária · "Variante indicada: FortiEDR (linha FortiEndpoint)"; `data-p53-sol-item="fortiedr"`; veto visível nomeando FortiEndpoint SaaS |
| **C2** gap endpoint, EDR de terceiro em produção | `OPERATIONAL_GAP`/`CONTEXTUAL`, `cand=[]`, nota "nunca substituição" | veto `operacional` para `FortiEndpoint`; nenhum registro | **sem card de aquisição**; seção com bloco de vetos "FortiEndpoint: tecnologia operacional — apoio em operacionalização (nunca substituição)"; a ação de operacionalizar segue no card de capability (`#v32support`, `ui_v32.js:636-640`) e em `#pr-support` |
| **C3** gap automation, FortiSOC só em `soc-platform` | `CONTEXT_NOT_INFORMED`/`LEGACY-LABELLED`; `sup.caps` ∋ `security-automation` | derivação declarada: `CONTEXT_NOT_INFORMED` ∧ `sup.caps.has` → veto `plataforma` ("capability coberta pela plataforma unificada declarada — foco em operacionalização, não em nova aquisição · FortiSOC") | sem card FortiSOAR; veto visível. **Decisão D-3** (§8): é derivação da apresentação sobre dado público do motor, não toque no engine; a lacuna de `classify` vai ao backlog |
| **C3b** (refutador) FortiSOC declarado também em `security-automation` | `OPERATIONAL_GAP` + M75 | veto `operacional`+M75 | idem C2, pela regra do motor, sem derivação |
| **C4** gap logs, Sentinel em produção | `OPERATIONAL_GAP`/`CONTEXTUAL`, `cand=[]` | vetos `operacional` para `FortiAnalyzer` e `FortiSIEM` | sem cards; bloco de vetos com os dois nomes e a nota do motor |
| **C5** legado, `[1,2,2,2,1,1,1,1,1,1,"NA",1,2,0,0]` | `contexts:{}` | legado: `H` inteira como hipótese, tier por `sev` | tela: os mesmos 9 cards (7 "após validação", 2 "indicação prioritária") + linha "Hipótese da avaliação…"; **papel: os 9 com qualificador, ação e escopo** ("camada endpoint" vem do `sn` do MAP `v3_1_3.html:465` e passa pelo registro, não só pelo `.scope` movido) |
| **C6** network NONE, `saasAllowed:"no"` | `WHITESPACE`/`DIRECT`, `fortindr-onprem[atende]` | registro `chave:"FortiNDR"` (regra 2), `nome:"FortiNDR (On-Premises)"`, `variante` idem | card **FortiNDR (On-Premises)** · prioritária; `data-p53-sol-item="fortindr-onprem"`; curável como `FortiNDR` |
| **C7** staffing/monitoring gap, FortiEDR on-prem, endpoint lv1 | `soc-staffing` LEGACY + `socaas<gap>`; `continuous-monitoring` WHITESPACE/DIRECT `cand=[]` + `socaas`; `endpoint-detection` OPERATIONAL + `fortixdr/contextual-extension`; MDR inelegível (`serviceEligibility` → "base declarada apenas em deployments não elegíveis (on-prem/air-gapped) — OG oficial") | SOCaaS → `servico`, tier 1 (gap-high), chave `SOCaaS`; MDR → `H` de serviço não disparado → `serviceEligibility("fortiguard-mdr").eligible === false` → veto `elegibilidade`; `fortixdr` → `estender`, chave `FortiXDR`, escopo M50, tier 2; `FortiEndpoint` (MAP endpoint lv1) → veto `operacional` | cards: **FortiGuard SOCaaS** (prioritária, serviço) e **FortiXDR** (após validação, "estender a base instalada"); **sem MDR**, com veto visível e razão; sem FortiEndpoint |
| **C8** legado, endpoint lv0 | `contexts:{}` | hipótese | **FortiEndpoint** · prioritária · "Hipótese — contexto não informado" (decisão 023 E1 preservada; nada inventado) |
| **C9** `dataLeakageConcern` | `UNASSESSED`/`CONTEXTUAL`, `fortidlp` por sinal em 2 capabilities | `acao:"sinal"`, `origem:"sinal"`, caps unidas | igual a hoje (OK), mais `data-p53-sol-origem="sinal"` no papel |
| **C10** whitespace `saasAllowed:"yes"` | analytics: `fortianalyzer`, `fortisiem`, `fortisiem-cloud`; endpoint: `fortiendpoint` | FortiSIEM funde 2 itemIds → nome da linha, `variantes:["FortiSIEM","FortiSIEM Cloud"]` | 3 cards, iguais aos de hoje, com "disponível também como FortiSIEM Cloud" |

### 2.4 Curadoria

- **Produto retirado não volta**: `decidir(chave)` inalterado; `decorar()` filtra por `decisaoDe(...)` na mesma linha de hoje (`ui_p52_support_v32.js:732-733`, âncora `D019-M5` preservada — `decisaoDe` passa a resolver `nome → chave` pelos registros, não por `PRODUCTS`); o papel deriva dos cards. A supressão **sobrevive à correção**: `"FortiEndpoint":"exclude"` retira o card FortiEDR em C1, porque a chave é a linha.
- **Acréscimo humano** mantém marcador em tela (`[data-p53-prov]`, `:424-425`, `:528`) e papel (`:819-820`, âncora `D019-M4`), ganha `data-p53-sol-origem="operador"` e `data-p53-sol-acao="hipotese"`; continua sem capabilities e sem tier (medido pelo refutador: `data-p53-sol-tier=null`). "Condições" de um acréscimo não existem no estado (019 C1: só ids e enum) — limitação declarada, não resolvida aqui.
- **Item do motor sem linha** (chave = id do motor): `valido(id, valor)` aceita `exclude` quando `motorCuravel(id)` (critério estático: `OFFERINGS[id]` com `entityType ∈ {offering, variant}`, sem `contextAnchor`, `recommendationPolicy ≠ "never-direct"`, ou `SERVICES[id]`) e **recusa `include`** com mensagem nova ("acréscimo só do catálogo da Camada 1: " + id). O editor já funciona para isso sem mudar (linha ofertada: `unset`/`exclude`, `ui_curation_edit_v32.js:91`). `unset(id)` passa a validar só o id (helper `idValido`, R9 §8) — hoje passa `ENUM[0]="include"` (`:291`), que recusaria o `unset` desses ids.
- `catalog()` **não muda** (`Object.keys(PRODUCTS)`): lista do "Acrescentar" (`:200-208`), `catalog()[0]` e `catalog() − offered()` das fixtures ficam iguais.
- **`exclude` obsoleto** continua inerte no arquivo (medido pela lente data-engineer §5) — achado de backlog, não desta demanda.

### 2.5 Identidade

Chave estável = `chave` (linha) + `itemId` (motor), nos atributos `data-p53-sol-chave` e `data-p53-sol-item`. `data-p53-sol-produto` continua carregando o **nome exibido** (é o que `D019-SOL1/SOL3/CTX1`, `D022-PROD1`, `D025-UNS1` leem) — mas deixa de ser chave de deduplicação: a fusão é por `chave` (§2.2), a curadoria é por `chave`, o grupo do portfólio é por `chave` (`PORTFOLIO`, `ui_p52_support_v32.js:78-92`, já chaveado por id de catálogo). Colisão de nome entre família e linha (C6, "FortiNDR" = `ndr-family.name`) deixa de importar: a família pareia por regra 1 e a variante por regra 2, ambas para a mesma `chave`.

---

## 3 · O papel (`pr-card` em `#pr-sup-solucao`)

Derivado dos cards da tela, como hoje; passa a carregar:

| no `pr-card` | de onde (card da tela) | hoje |
|---|---|---|
| `data-p53-sol-tier` + `<div class="pr-mut p53-pr-tier">indicação prioritária / após validação</div>` | `data-p53-sol-tier` e `.p53-sol-tierlabel` | **omitido** (QS-02, C5) |
| `data-p53-sol-chave`, `data-p53-sol-item`, `data-p53-sol-acao`, `data-p53-sol-origem` | atributos homônimos | — |
| `.p53-pr-acao` (texto da ação) | `.p53-sol-acao` | — |
| `.p53-pr-variante` ("Variante indicada: …" / "modalidade a definir: …") | `.p53-sol-variante` | — |
| `.p53-pr-escopo` ("Escopo: camada endpoint") | `.scope` do `.prod` movido **ou** `.p53-sol-escopo` do card montado | **omitido** (QS-02) |
| `.p53-pr-elig` ("Elegibilidade: validar deployment da base") | `.p53-sol-elig` | — |
| `habilitado por sinal declarado: …`, `<b>nome`, `[data-p53-prov]`, `.pt-desc`, `li[data-p53-sol-cap]` | como hoje (`:812-830`) | ok |
| bloco `<div class="pr-mut p53-pr-vetos" data-p53-vetos="N"><ul><li data-p53-veto-item data-p53-veto-classe>nome: motivo</li>…` | `.p53-sol-vetos` da tela | — |

O aviso de curadoria `[data-p53-suprimido]` (`:801-802`, âncora `D023-M6`) fica **byte-igual**; o veto do motor usa marcador próprio (`data-p53-vetos`), porque `D025-AUS1 (b)`/`D025-NEW1` exigem `[data-p53-suprimido] === null` sem curadoria e `D023-PAP1` exige a mesma contagem de supressão nas duas superfícies.

Texto novo no papel não passa por `P52_COPY`: o papel copia o texto do card (`txt()`), e o card é deste módulo — mesmo caminho do tier de hoje. CSS só `p53-*` em `ui_p52_support_v32.css` (R9 §6), sem hex, cor nunca como único portador (`:207` já faz isso para o tier).

---

## 4 · Arquivos, waves, gates

### 4.1 Arquivos tocados (estimativa)

| arquivo | dono | o quê | linhas |
|---|---|---|---|
| `ui_curation_v32.js` | core-engineer | `chaveDe`/`idsDaLinha`/`motorCuravel` (≈45), `reconciliar()` (≈120), `ofertados()` vira leitor (−50 +5), `valido`/`idValido`/`unset` (≈10), bridge `oferta`/`vetos`/`contract` (≈6), cabeçalho (≈20) | ≈ +190 → ≈505 |
| `ui_p52_support_v32.js` | ui-engineer | `ofertaDoMotor()` vira leitor (−95 +12); `chaveDoNome`/`decisaoDe`/`ehEscolhaDoOperador` por chave (≈10); `cardDoProduto` atributos + 4 linhas visíveis (≈30); `corpoDoItemDoMotor` para variante resolvida (≈15); `acrescimos`/`cardAcrescentado` atributos (≈4); `decorar` sem retorno precoce quando há vetos + `declararVetos` (≈30); `papelHTML` (+25) | ≈ +40 líquidas |
| `ui_p52_support_v32.css` | ui-engineer | `.p53-sol-acao`, `.p53-sol-variante`, `.p53-sol-escopo`, `.p53-sol-elig`, `.p53-sol-vetos`, `.p53-pr-*` | ≈ +25 |
| `ui_curation_edit_v32.js` | ui-engineer | `nomeDe` lê o registro; linha ofertada mostra variante como subtítulo | ≈ +8 |
| `tests_026_contrato.js`, `tests_026_mutants.js` | qa-engineer | 3 gates, 4 mutantes, fixtures C1/C2/C3/C4/C6/C7/C8/C9 por `__DEV` + escrita direta em `V32.TECH_LANDSCAPE`/`ARCHITECTURE_CONTEXT` (como `probe026.js:33-39`) | ≈ 250 + 90 |
| `tests_022_mutants.js` | qa-engineer | `D022-M10`: `file: F.apoio → F.estado` (o laço por sinal muda de módulo; a linha-âncora é transportada textualmente) | 2 |
| `tests_019_curadoria.js` (`D019-CTX1 (a)`), `tests_025_curadoria_sessao.js` (`nomeDe`, `D025-UNS1`) | qa-engineer | reancoragem por nome do registro (§4.3) — asserção intacta, só a resolução do nome muda | ≈ 6 |
| `.claude/verify/expected_suites.json`, `mutation_map.json` (`d026`), `bridges.json` (nota do `__CURATION`), `pipeline.yaml`, `pins.json` (`gen_pins.py`) | build-engineer | registros | ≈ 40 |
| `SESSION_SCHEMA_V32.md` §9 (`:444-451`) | doc-writer | uma frase: id do motor sem linha aceito só com `exclude` | 2 |
| `.claude/BACKLOG.md` | doc-writer | `EA-76` → `resolvido` (cadeia); novos: lacuna `classify` × `suppressedByPlatform` (C3); `exclude` obsoleto sem sujeito | ≈ 40 |

Não tocados: `engine_v32.js`, `quickscan_secops_soccmm_v3_1_3.html`, `ui_session_v32.js`, `ui_v32.js`, `tests_019_mutants.js`, `synthetic_session_examples/*`.

### 4.2 Waves (um módulo por delegação; dependência real dita a ordem)

| wave | delegação | depende de |
|---|---|---|
| **W0** | `qa-engineer`: `tests_026_contrato.js` + `tests_026_mutants.js`; RED provado e commitado (R3 §4). O oráculo é o motor público + pareamento **reimplementado no teste** (não `oferta()`): `V32.classify/resolveCandidates/archSatisfied/serviceEligibility/suppressedByPlatform` + `PRODUCTS`/`MAP`. Saída de verificação gravada em arquivo, nunca `| tail` | spec aprovada |
| **W1** | `core-engineer`: `ui_curation_v32.js` (§7.1) | W0 |
| **W2** (paralela, arquivos distintos) | `ui-engineer` A: `ui_p52_support_v32.js` + `.css` (§7.2–7.4) · `ui-engineer` B: `ui_curation_edit_v32.js` (§7.5) | W1 (consome o bridge) |
| **W3** | `qa-engineer`: reancorar `D022-M10`, `D019-CTX1 (a)`, `D025-UNS1`; rodar **em sequência** (campanhas mutam in place) d019 → d022 → d023 → d025 → d026; conferir que nenhuma âncora saiu `ocorrencias ≠ 1`; mutante sobrevivente acusa o gate, não só o código | W2 |
| **W4** | `build-engineer`: `gen_pins.py`, `expected_suites.json` (`d026: 3`), `mutation_map.json` (`d026` com targets `ui_curation_v32.js`, `ui_p52_support_v32.js`, `tests_026_*`), `bridges.json` nota, `pipeline.yaml`; `run.sh` **e** `compliance-audit.sh`; CI `visual` para medir `P8` | W3 |
| **W5** | `doc-writer`: schema §9, backlog, relatório da demanda com a matriz antes/depois (§6) e o **delta visível** declarado (serviços do motor, linha de hipótese, bloco de vetos) | W4 |

### 4.3 Gates existentes — o que quebra e a decisão

Regra que governa o raio (inventário QA): legado e `LEGACY-LABELLED` **mantêm** a oferta do MAP. Sob essa regra:

| gate | classe | decisão |
|---|---|---|
| `D019-SOL1` (`tests_019_curadoria.js:372-407`, oráculo `computeFindings+MAP+PRODUCTS`) | não afeta | fixture legada (`boot()` sem contexto, `:89-120`) — sob o contrato, legado = MAP inteiro, o oráculo continua verdadeiro. **Não reancorar**; uma alínea de guarda pode registrar que ele é oráculo do modo legado |
| `D019-SOL3 (b)` (`:505-508`, tier por `sev`) | não afeta | fixture legada; tier por `sev` é a regra do contrato nesse modo |
| `D019-PROV1 (c)` (`:297-300`, `cardDe` por `PRODUCTS[id].n`) | não afeta | fixture legada: nome do card = nome da linha |
| `D019-CTX1 (a)` (`:559-568`, `offered().map(PRODUCTS[id].n)` ⊆ cards) | **reancorar com trilha** | com contexto, o nome do card pode ser o do item resolvido (C1/C6). A fixture (`security-analytics`/`soc-platform` NONE, `saasAllowed:"yes"`) resolve `fortianalyzer` (nome igual) e `fortisiem`+`fortisiem-cloud` (fusão → nome da linha): passa como está, **por sorte de fixture**. Reancorar (a) para `b.oferta().map(r => r.nome)` — mesma classe de oráculo (bridge × DOM) que a alínea já usa |
| `D025-UNS1` (`tests_025_curadoria_sessao.js:734`, checkbox por `PRODUCTS[off[0]].n`) | **reancorar com trilha** | mesma razão; `nomeDe` do teste (`:159`) passa a ler `oferta()` |
| `D025 fixtures` (`:238-262`, `off.length ≥ 9` em legado) | não afeta | legado = 9 ofertados, inalterado |
| `D019-CUR1/CUR2/INV8/MED1/SOL2/CARD1/PAR1/VAZ1/SUF1/PRT1` | não afeta | `catalog()` igual; `state()` só ids+enum; `MED1` mede que `MAP` não é podado (continua); `CARD1 (a)` "nome uma vez": a linha de variante nunca é igual ao nome do card (regra do `nome`) |
| `D022-PROD1` (`tests_022_escalonamento.js:350`) | não afeta | por sinal preservado; `data-qs22-sinais` igual |
| `D022-M10` (`tests_022_mutants.js:109-111`) | **reancorar** (arquivo) | o laço por sinal passa a viver em `ui_curation_v32.js`; a linha é transportada verbatim para a âncora continuar única |
| `D023-OCU1/REG1/SUP1/SUJ1/PAP1/DOM1/LEG1/ARB1` (fixtures `F1` saas-only, `F2` endpoint NONE, `F3`, `:154-159`) | não afeta | `F1`: tudo `LEGACY-LABELLED` → MAP; `F2`: `endpoint-family` placeholder → chave `FortiEndpoint`, card "Fortinet Endpoint Security — modalidade a definir" (conta igual); `F3`/`F7`/`F8`: `offered()` não vazio |
| `D010-*` (`fixtures_010_vao.js:455-466`, `substituto` declarado) | não afeta | `F1/F1b/F4` só `saasAllowed:"yes"` → MAP mantido → `published()` não vazio; `F3` gate fechado: tudo `UNSET` → `LEGACY-LABELLED` → hipóteses mantidas (capability declarada NONE sob gate fechado viraria `NEEDS_VALIDATION` → veto `validar`; nenhuma fixture da 010 declara) |
| `D015-*`, `U1/U7`, `P52-ICON3 (t2)`, `P52-LAY4/LAY5`, `S69 (b)` | não afeta | oferta não vazia nos estados dessas fixtures; `S69` `richLandscape` ganha `FortiXDR` (estender) e perde `FortiEndpoint`/`FortiNDR` por veto operacional — `offered()` segue não vazio e com id fora da oferta |
| `D025-AUS1 (b)`, `D025-NEW1` (`[data-p53-suprimido] === null`) | não afeta — **guarda** | o veto usa `data-p53-vetos`, nunca o aviso da curadoria |
| `P52-REC1g`, `P52-PR1`, `P51-DOC13`, `D010-PAPEL1` | não afeta | contador reescrito; `pr-sup-solucao` opcional; bloco de vetos entra **depois** dos cards (censo da Camada 1 intacto, `ui_p52_support_v32.js:400-417`) |
| playwright `P8` (`tests_visual/print.spec.js:105-108`, 12 páginas) | **incerto → medir no CI** | qualificador/ação/escopo por `pr-card` e bloco de vetos podem repaginar `F7_target_up`. Se mudar: repin do `BASELINE` declarado com trilha, nunca afrouxar |
| `expected_suites.json`, `mutation_map.json`, `pins.json` | reancorar (registro) | `d026` novo; d019/d022/d023/d025 contagens inalteradas; `gen_pins.py` no mesmo PR |
| oráculo declarado de outra demanda → **parar e escalar** | nenhum | sob a regra "legado/LEGACY-LABELLED mantém MAP" nenhum `D010_DECLARED.substituto` muda. Se o PO escolher "LEGACY-LABELLED sempre após validação" (D-2) ou "VALIDATE sob gate fechado veta hipótese declarada NONE" em fixture que declare, aí sim é escalar |

### 4.4 Gates novos (`D026-*`) e mutantes — só o que, sem eles, quebra em silêncio

| gate | afirma | por que não é redundante | mutante |
|---|---|---|---|
| `D026-REC1` "o motor vence a Camada 1 onde tem voz" | fixtures C1, C2, C4, C6, C7: (a) produto com `archSatisfied === "violated"` não é card e o item resolvido é (`data-p53-sol-item`); (b) `OPERATIONAL_GAP` sem candidato ⇒ nenhum card da linha e veto `operacional` em tela e papel; (c) serviço com `serviceEligibility().eligible === false` ausente, veto `elegibilidade` com a `reason` literal; (d) `contextual-extension` ⇒ `acao="estender"` e nunca tier 1; (e) `data-p53-sol-chave` da variante é a linha e `decide(chave)="exclude"` retira o card. Oráculo: motor público + pareamento reimplementado no teste | nenhum gate hoje mede produto × decisão do motor sob contexto (todas as fixtures vivem em legado/LEGACY-LABELLED — inventário QA) | `D026-M1` em `ui_curation_v32.js`: `reconciliar()` ignora `ctx.supportMode` (trata tudo como `LEGACY-LABELLED`) → C1/C2/C4/C7 voltam a mostrar o MAP |
| `D026-PAP1` "o papel diz o que a tela diz, por card" | para cada `pr-card`: `data-p53-sol-tier`, `-acao`, `-item`, `-origem` iguais ao card homônimo da tela; texto do qualificador presente; escopo presente quando a tela o tem (C5: "camada endpoint"); bloco de vetos com a mesma contagem nas duas superfícies | `D019-PAR1` compara **conjuntos** de nomes; QS-02 é divergência de **conteúdo** por card — medido: `tierAttr=null` em todos os cenários | `D026-M2` em `ui_p52_support_v32.js`: `papelHTML` omite `data-p53-sol-tier`/`.p53-pr-tier` (estilo `D019-M4`: só no papel) |
| `D026-LEG1` "sem voz do motor, nada é inventado" | (a) C8 legado: card `FortiEndpoint`, `acao="hipotese"`, tier por `sev`, zero veto; (b) C9: `origem="sinal"` em tela e papel, nunca `gap`; (c) C3: veto `plataforma` nomeando a plataforma declarada, e `[data-p53-suprimido]` ausente; (d) `set("fortiaigate","include")` recusado e `set(...,"exclude")` aceito quando ofertado por sinal | protege a regra que decide se 35 gates são reancoragem ou vácuo (inventário QA) e a guarda `D025-AUS1 (b)` | `D026-M3` em `ui_curation_v32.js`: `chaveDe` pareia **só por nome** (regras 2–3 removidas) → `fortiedr` vira chave própria, `"FortiEndpoint":"exclude"` deixa de retirar o card; `D026-M4` em `ui_p52_support_v32.js`: `declararVetos` escreve `data-p53-suprimido` em vez de `data-p53-vetos` → `D025-AUS1 (b)` cai (mutante de outra suíte como carrasco, declarado) |

Namespace `D026-*`, arquivo próprio (`R10`), contagem `3` em `expected_suites.json` no mesmo PR; `d026` em `mutation_map.json` com `preflight: true` e `targets` nos dois módulos.

---

## 5 · Invariantes, importação substitutiva (025), riscos, rollback

| invariante | impacto |
|---|---|
| INV-1 engine byte-idêntico | zero toque; `boundary.json` intacto; `D022-BND1`/`D023-BND1` continuam verdes |
| INV-2 UNSET ≠ NONE | preservada e **reforçada**: `UNSET` (`LEGACY-LABELLED`) → hipótese, nunca aquisição derivada de ausência; `NONE` → o motor decide. A única leitura nova sobre `UNSET` (C3) lê uma plataforma **declarada** em `soc-platform`, não a ausência |
| INV-3 suficiência; UI nunca dona | gate fechado: `ENV.assessmentSufficient()` falso ⇒ `NEEDS_VALIDATION(insufficientEvidence)` ⇒ veto `validar` para capability declarada NONE; hipóteses `LEGACY-LABELLED` ficam (errata 023 E4 e `temProdutoPublicadoV32` `:741` inalterados) |
| INV-4/5/6 | não tocadas (nenhuma escrita em score/target/refinement; `D022-INV1` `legacySnapshot` byte-igual continua) |
| INV-7 narrativa derivada de evidência | `reconciliar()` é função pura de (respostas, MAP, contexto, estado de curadoria); texto de ação é enum → copy no módulo de apresentação |
| INV-8 derivado nunca serializado | `decisions` continua `{chave → enum}`; `oferta()`/`vetos()` nunca entram em `toSession()` (`:199-204` intacto); nomes de campo do registro (`entregaveis`, `variantes`, `itemIds`) não colidem com `RESERVED_DERIVED` (`ui_session_v32.js:34-37`) nem com os 13 banidos do `S4-S5` — e nem precisariam, porque não viajam |
| INV-9 boundary | nenhuma classe protegida |
| INV-10 PT-BR / nomes exatos | enum em PT-BR sem acento (`avaliar-aquisicao`, `hipotese`), como `prioritaria`/`validacao` já são |

**Importação substitutiva (025).** `validate`/`fromSession`/transação/rollback (`ui_session_v32.js:239-244`, `:619-637`) não mudam. Arquivos existentes (inclusive `exemplo-completo.json`) continuam válidos com o **mesmo significado** — a exclusão declarada sobrevive à correção da oferta (§2.4). Única assimetria nova: um arquivo com `"fortiaigate":"exclude"` (id do motor sem linha) é aceito por esta release e **recusado com mensagem** pela anterior (`"decisions: id fora do catálogo: fortiaigate"`) — forward-incompat nomeada, sem bump de `schemaVersion` (§6 do schema só olha `format`/`schemaVersion`/`engineSha256`). Registrar no schema §9.

**Riscos.**
1. Delta visível ao cliente, declarado: cards somem (C2/C4/C7 MDR), variante no título (C1/C6), serviços do motor sob a linha guarda-chuva com entregáveis nomeados, linha de hipótese em legado, bloco de vetos. Cada um é decisão listada em §8; nenhum é efeito colateral.
2. `P8` (paginação) — medir; repin declarado.
3. `reconciliar()` chamada por `offered()`, `decide()`, `published()`, `contract()`, `oferta()` em cada passagem de decorador: custo O(capabilities × ofertas), igual ao de hoje (`buildRecommendationContext()` já é recomputada em `ofertados()`:124 e `ofertaDoMotor()`:293). Memoização por passagem é otimização futura, não deste desenho.
4. Fixture de teste que escreve direto em `V32.TECH_LANDSCAPE` (como `probe026.js`) muda o resultado da próxima chamada — já é assim para todo gate com contexto (`tests_019_curadoria.js:110-116`).
5. Âncora `D019-M5` depende de `decisaoDe(produtos[i].nome)` continuar aceitando **nome**: o resolvedor `chaveDoNome` tem de existir antes de a linha ser tocada (W2 lê W1).
6. Sem `__CURATION` instalado, a visão por produto deixa de existir (hoje `ofertaDoMotor()` funciona sozinho, `:130-131`). É deliberado: um fallback seria a segunda fonte do `EA-76` de volta. O builder sempre injeta os dois (`build_v32_html.py:22`, `:26`), e o estado conservador sem consolidação é a Camada 1 visível, que a 010 garante.

**Rollback.** Um PR; `git revert` do merge devolve as duas cópias do `EA-76`. Nenhuma migração de dado; sessões gravadas entre o merge e o revert só divergem se contiverem `exclude` de id do motor sem linha (recusa nomeada, não corrupção).

---

## 6 · Antes / depois — C1..C9

| caso | antes: produto · tier · tela/papel | depois: produto · qualificador · ação · tela · papel |
|---|---|---|
| C1 | FortiEndpoint · prioritária · papel sem tier | **FortiEDR** (chave `FortiEndpoint`, item `fortiedr`) · indicação prioritária · avaliar aquisição · tela: card + "Variante indicada: FortiEDR" + veto "FortiEndpoint: restrição arquitetural (saasAllowed=no)" · papel: idem, com tier/ação/variante/veto |
| C2 | FortiEndpoint · prioritária | **nenhum card** · — · (operacionalizar no card de capability) · tela: bloco de vetos "FortiEndpoint: tecnologia operacional — apoio em operacionalização (nunca substituição)" · papel: idem |
| C3 | FortiSOAR · prioritária | **nenhum card** · — · veto `plataforma` "FortiSOAR: capability coberta pela plataforma unificada declarada (FortiSOC) — foco em operacionalização" · tela e papel (D-3) |
| C4 | FortiAnalyzer + FortiSIEM · prioritárias | **nenhum card** · vetos `operacional` para os dois · tela e papel |
| C5 | 9 cards (7 validação, 2 prioritária) · papel **sem** qualificador, sem escopo | mesmos 9 cards · mesmos tiers · ação "hipótese — contexto não informado" · papel **com** tier, ação e "Escopo: cobre a camada de endpoint…" no FortiEndpoint e "complementa o programa…" no FortiRecon |
| C6 | FortiNDR · prioritária · variante só em `#v32support` | **FortiNDR (On-Premises)** (chave `FortiNDR`, item `fortindr-onprem`) · indicação prioritária · avaliar aquisição · tela e papel nomeiam a variante |
| C7 | FortiEndpoint (validação) + SOCaaS (prioritária) + **MDR (prioritária)** | **FortiGuard SOCaaS** · prioritária · serviço; **FortiXDR** · após validação · estender a base instalada (M50); **sem MDR** — veto "FortiGuard MDR: base declarada apenas em deployments não elegíveis (on-prem/air-gapped) — OG oficial"; **sem FortiEndpoint** — veto operacional. Tela e papel |
| C8 | FortiEndpoint · prioritária | FortiEndpoint · indicação prioritária · "hipótese — contexto não informado" · tela e papel (nada inventado; 023 E1 preservada) |
| C9 | FortiDLP · validação · sinal preservado | FortiDLP · após validação · `origem="sinal"` · igual, com origem explícita no papel |

---

## 7 · Pseudo-código e pontos de inserção

### 7.1 `ui_curation_v32.js` (core-engineer)

Inserir **entre** `catalogo()` (`:88-91`) e `valido()` (`:154`), substituindo `ofertados()` (`:93-152`):

```js
/* ===== RECONCILIAÇÃO — a fonte única do "que o motor ofereceu" (026, EA-76) ===== */
var REPRESENTANTE = { "endpoint-family": "FortiEndpoint", "fortiguard-labs-advisory": "FortiGuard-Service-Bundle" };
var FORCA = { "avaliar-aquisicao": 6, "estender": 5, "apoio-contextual": 4, "servico": 3, "sinal": 2, "hipotese": 1 };
function chavePorNome(nome) { /* PRODUCTS[k].n === nome → k; senão null (hoje :137-140) */ }
function chaveDe(itemId) { /* §2.1 */ }
function idsDaLinha(chave) { /* ids ∈ OFFERINGS ∪ SERVICES com chaveDe(id) === chave */ }
function motorCuravel(id) {
  var o = V32.OFFERINGS[id];
  if (o) return !o.contextAnchor && (o.entityType === "offering" || o.entityType === "variant") && o.recommendationPolicy !== "never-direct";
  return !!V32.SERVICES[id];
}
function nomeDoItem(id) { return (V32.OFFERINGS[id] || V32.SERVICES[id] || {}).name || id; }
function capExibida(qid, capId) {   /* pergunta → MAP[qid].cap; capability sem pergunta → CAPABILITIES[capId].name */
  var t = (qid && MAP[qid] && MAP[qid].cap) || (V32.CAPABILITIES[capId] || {}).name || "";
  return aplicarCopy(t);                 /* __P52.applyCopy sob guarda typeof — como ui_p52_support_v32.js:241-246 */
}

function reconciliar() {
  var registros = [], porChave = {}, vetos = [];
  if (typeof computeFindings !== "function" || typeof MAP === "undefined" || typeof PRODUCTS === "undefined") return { registros: registros, vetos: vetos };
  var fs; try { fs = (computeFindings() || {}).findings || []; } catch (e) { return { registros: registros, vetos: vetos }; }
  var res = (typeof V32 !== "undefined" && V32.buildRecommendationContext) ? V32.buildRecommendationContext() : { legacyMode: true, contexts: {} };
  var ctxs = res.contexts || {};
  var sup = (res.legacyMode || !V32.suppressedByPlatform) ? { caps: { has: function () { return false; } }, plat: null } : V32.suppressedByPlatform();

  function reg(chave, campos) {          /* fusão por chave (§2.2) */
    var r = porChave[chave];
    if (!r) { r = porChave[chave] = { chave: chave, nome: null, tipo: campos.tipo, itemId: null, itemIds: [], variante: null,
      variantes: null, modalidade: null, acao: campos.acao, origem: campos.origem, tier: campos.tier, caps: [], sinais: [], escopo: null,
      elegibilidade: null, entregaveis: [], motivo: campos.motivo || "" }; registros.push(r); }
    if (campos.itemId && r.itemIds.indexOf(campos.itemId) < 0) r.itemIds.push(campos.itemId);
    if (campos.tier < r.tier) r.tier = campos.tier;
    if (FORCA[campos.acao] > FORCA[r.acao]) { r.acao = campos.acao; r.motivo = campos.motivo || r.motivo; }
    if (campos.cap && r.caps.indexOf(campos.cap) < 0) r.caps.push(campos.cap);
    (campos.sinais || []).forEach(function (s) { if (r.sinais.indexOf(s) < 0) r.sinais.push(s); });
    if (campos.escopo && !r.escopo) r.escopo = campos.escopo;
    if (campos.modalidade) { r.modalidade = campos.modalidade; r.variantes = campos.variantes || null; }
    if (campos.elegibilidade) r.elegibilidade = campos.elegibilidade;
    if (campos.entregavel && r.entregaveis.indexOf(campos.entregavel) < 0) r.entregaveis.push(campos.entregavel);
    return r;
  }
  function veto(v) { vetos.push(v); }

  /* 1 · achados da Camada 1, um por pergunta */
  fs.forEach(function (f) {
    var m = MAP[f.id]; if (!m || !m.lv || !m.lv[f.lvl]) return;
    var H = (m.lv[f.lvl].c || []).filter(function (c) { return c.p && PRODUCTS[c.p]; });
    var capId = capDaPergunta(f.id), ctx = ctxs[capId], cap = capExibida(f.id, capId), tierSev = f.sev === 2 ? 1 : 2;
    var semVoz = res.legacyMode || !ctx || ctx.classification === "CONTEXT_NOT_INFORMED";
    if (semVoz && ctx && ctx.classification === "CONTEXT_NOT_INFORMED" && sup.caps.has(capId)) {        /* C3 — D-3 */
      H.forEach(function (h) { veto({ chave: h.p, itemId: null, nome: PRODUCTS[h.p].n, capability: capId, cap: cap, classe: "plataforma",
        motivo: "capability coberta pela plataforma unificada declarada — foco em operacionalização, não em nova aquisição · " + nomeDaPlataforma(sup) }); });
    } else if (semVoz) {                                                                                     /* legado / LEGACY-LABELLED */
      H.forEach(function (h) { reg(h.p, { tipo: tipoDaLinha(h.p), acao: "hipotese", origem: "gap", tier: tierSev, cap: cap, escopo: h.sn || null, motivo: h.w || "" }); });
    } else {
      var tierM = (ctx.maturity && ctx.maturity.state === "gap-high") ? 1 : 2;
      var cobertas = {};
      (ctx.candidates || []).forEach(function (cd) {
        var chave = chaveDe(cd.itemId); if (!chave) return; cobertas[chave] = true;
        if (cd.itemKind === "offering" && ctx.supportMode === "DIRECT")
          reg(chave, { tipo: "produto", itemId: cd.itemId, acao: "avaliar-aquisicao", origem: "gap", tier: tierM, cap: cap, escopo: cd.scopeNote || null, motivo: cd.variantResolution || "" });
        else if (cd.itemKind === "family" || cd.itemKind === "family-of-variants")
          reg(chave, { tipo: "produto", itemId: cd.itemId, acao: "avaliar-aquisicao", origem: "gap", tier: tierM, cap: cap, modalidade: "a definir",
            variantes: (cd.variants || []).map(nomeDoItem), motivo: cd.variantResolution || "" });
        else if (cd.itemKind === "contextual-extension")
          reg(chave, { tipo: "produto", itemId: cd.itemId, acao: "estender", origem: "gap", tier: 2, cap: cap, escopo: cd.scopeNote || null, motivo: cd.scopeNote || "" });
        else if (cd.itemKind === "contextual-support")
          reg(chave, { tipo: "produto", itemId: cd.itemId, acao: "apoio-contextual", origem: "gap", tier: 2, cap: cap, escopo: cd.scopeNote || null, motivo: cd.scopeNote || "" });
      });
      H.forEach(function (h) {                                                                               /* hipóteses não cobertas → veto com razão */
        if (cobertas[h.p]) return;
        veto(classificarVeto(h, capId, cap, ctx, sup));                                                      /* §2.2, coluna "hipóteses H" */
      });
    }
  });
  /* 2 · serviços e itens por sinal: toda capability com contexto */
  Object.keys(ctxs).forEach(function (capId) {
    var ctx = ctxs[capId], cap = capExibida((V32.CAPABILITIES[capId].questionIds || [])[0], capId);
    var tierM = (ctx.maturity && ctx.maturity.state === "gap-high") ? 1 : 2;
    (ctx.services || []).forEach(function (s) {
      var chave = chaveDe(s.serviceId); if (!chave) return;
      var porSinal = (s.triggeredBy || []).indexOf("capability-gap") < 0, validar = /^elegível — validar/.test(s.note || "");
      reg(chave, { tipo: "servico", itemId: s.serviceId, acao: "servico", origem: porSinal ? "sinal" : "gap", tier: (porSinal || validar) ? 2 : tierM, cap: cap,
        sinais: porSinal ? s.triggeredBy.map(sigPTseguro) : [], elegibilidade: validar ? "validar" : "elegivel", entregavel: nomeDoItem(s.serviceId), motivo: s.note || "" });
    });
    (ctx.candidates || []).forEach(function (cd) {                                                           /* por sinal (C9) — era o 2º laço de hoje */
      if (!cd || cd.itemKind !== "offering" || !(cd.signals && cd.signals.length)) return;
      var chave = chaveDe(cd.itemId); if (!chave) return;
      var capNome = cap;   /* linha transportada para a âncora D022-M10: `if (capNome && reg2.caps.indexOf(capNome) < 0) reg2.caps.push(capNome);` */
      var reg2 = reg(chave, { tipo: "produto", itemId: cd.itemId, acao: "sinal", origem: "sinal", tier: 2, sinais: cd.signals.map(sigPTseguro), motivo: "" });
      if (capNome && reg2.caps.indexOf(capNome) < 0) reg2.caps.push(capNome);
    });
  });
  /* 3 · nome exibido e variante (§2.2) */
  registros.forEach(function (r) {
    var linha = PRODUCTS[r.chave] ? PRODUCTS[r.chave].n : nomeDoItem(r.chave);
    var unico = r.itemIds.length === 1 && V32.OFFERINGS[r.itemIds[0]];
    r.nome = unico ? nomeDoItem(r.itemIds[0]) : linha;
    r.itemId = r.itemIds[0] || null;
    r.variante = (unico && r.nome !== linha) ? r.nome : null;
    if (r.itemIds.length > 1 && !r.modalidade) r.variantes = r.itemIds.map(nomeDoItem);
  });
  return { registros: registros, vetos: vetos };
}
function ofertados() { var vistos = {}, out = []; reconciliar().registros.forEach(function (r) { if (!vistos[r.chave]) { vistos[r.chave] = true; out.push(r.chave); } }); return out; }
```

Helpers citados e não expandidos: `capDaPergunta(qid)` (varre `V32.CAPABILITIES[*].questionIds`), `tipoDaLinha(chave)` (`"servico"` quando `idsDaLinha(chave)` cai em `SERVICES`), `nomeDaPlataforma(sup)`, `classificarVeto(...)` (tabela §2.2), `sigPTseguro` (`sigPT` sob guarda `typeof`, como `ui_p52_support_v32.js:332`).

`valido()` (`:154-159`) — a linha-âncora `D019-M1` (`:157`) fica intacta; entra uma cláusula antes dela:

```js
function idValido(id) {
  if (typeof id !== "string" || !id) return "id ausente";
  if (catalogo().indexOf(id) < 0 && !motorCuravel(id)) return "id fora do catálogo: " + id;   /* literal preservado: D019-INV8, D025-VAL2, D025-UNS1 */
  return null;
}
function valido(id, valor) {
  var e = idValido(id); if (e) return e;
  if (ENUM.indexOf(valor) < 0) return "valor fora do enum fechado: " + String(valor);
  if (catalogo().indexOf(id) < 0 && valor === "include") return "acréscimo só do catálogo da Camada 1: " + id;
  return null;
}
/* unset (:290-295): `var e = idValido(id);` no lugar de `valido(id, ENUM[0])` */
```

`decidir` (`:162-165`), `publicados` (`:170-179`), `escolhaDoOperador`, `inclusoesSemLastro`, `paraSessao`, `validar`, `daSessao`: **byte-iguais** (âncoras `D019-M2`, `D025-M2/M3/M5/M9/M23` preservadas). Bridge (`:265-315`): `oferta`, `vetos`, `contract` estendido.

### 7.2 `ui_p52_support_v32.js` — coleta (ui-engineer)

Substituir o corpo de `ofertaDoMotor()` (`:247-346`), mantendo o nome:

```js
var ultimaOferta = [];                                    /* só para resolver nome → chave na mesma passagem */
function ofertaDoMotor() {
  var b = curadoria(); if (!b || typeof b.oferta !== "function") return [];
  try { ultimaOferta = b.oferta() || []; } catch (e) { console.error("[026] oferta reconciliada indisponível:", e && e.message); ultimaOferta = []; }
  return ultimaOferta;
}
function chaveDoNome(nome) {                              /* substitui idDoNome como resolvedor de decisão */
  for (var i = 0; i < ultimaOferta.length; i++) if (ultimaOferta[i].nome === nome) return ultimaOferta[i].chave;
  return idDoNome(nome);                                   /* card acrescentado: nome da linha */
}
/* decisaoDe(nome) :136-141 e ehEscolhaDoOperador(nome) :146-151: `var id = chaveDoNome(nome);` */
/* grupoDoNome(nome) :122-125: `var id = chaveDoNome(nome); return PORTFOLIO[id] || NAO_CLASSIFICADO;` */
```

`decorar()` (`:683-773`): `if (!produtos.length) return;` (`:722`) passa a `if (!produtos.length && !vetos.length) return;` com `var vetos = vetosDoMotor();` lido do bridge; `prodLegadoDe(ws, produtos[k].nome)` (`:724`) passa a procurar pelo **nome da linha** (`PRODUCTS[p.chave].n`) e só move o `.prod` quando `p.nome === nome da linha` (variante resolvida não herda a descrição da linha); a linha `:732-733` (âncora `D019-M5`) **não muda**; `acrescimos()` (`:570-583`) compara por `data-p53-sol-chave`; depois de `declararSupressao(...)` (`:741`, `:761`) entra `declararVetos(sec, vetos)` — nó `div.p53-sol-vetos[data-p53-vetos=N][role=note]` com `ul > li[data-p53-veto-item][data-p53-veto-classe]`, **depois** dos cards e antes do botão do editor; classes `sem-relacao` não renderizam.

### 7.3 `ui_p52_support_v32.js` — card

`cardDoProduto(p)` (`:383-472`): atributos novos no `el("div", {...})` (`:385-399`), mantendo a linha `"data-p53-sol-tier": TIER[p.tier] || TIER[2]` (`:394`, âncora `D019-M16`) intacta:

```js
"data-p53-sol-chave": p.chave, "data-p53-sol-item": p.itemId || "", "data-p53-sol-acao": p.acao,
"data-p53-sol-origem": p.origem, "data-p53-sol-variante": p.variante || "", "data-p53-sol-escopo": p.escopo || "",
"data-p53-sol-elig": p.elegibilidade || "", "data-p53-sol-motivo": p.motivo || ""
```

Depois de `card.appendChild(el("h4", null, p.nome));` (`:419`):

```js
if (p.variante) card.appendChild(el("div", { "class": "p53-sol-variante" }, "Variante indicada: " + p.variante + " (linha " + PRODUCTS[p.chave].n + ")"));
if (p.modalidade) card.appendChild(el("div", { "class": "p53-sol-variante" }, "Modalidade a definir no aprofundamento: " + p.variantes.join(" ou ")));
else if (p.variantes) card.appendChild(el("div", { "class": "p53-sol-variante" }, "Disponível também como " + p.variantes.slice(1).join(", ")));
card.appendChild(el("div", { "class": "p53-sol-acao" }, ACAO_TXT[p.acao] + (p.entregaveis.length ? " — " + p.entregaveis.join("; ") : "")));
if (p.elegibilidade === "validar") card.appendChild(el("div", { "class": "p53-sol-elig" }, "Elegibilidade: validar deployment da base"));
```

Corpo (`:434-460`): se `p.prod` → como hoje; senão, se `p.variante` → `corpoDoItemDoMotor(p)` (ícone `productIcon(p.chave)` — ícone da linha —, sem `.pt-desc` inventada, link `V32.OFFERINGS[p.itemId].url` quando houver); senão `corpoDoCatalogo(p.chave, p.nome)` e, se `p.escopo` e o corpo não tem `.scope`, `el("div", {"class": "scope p53-sol-escopo"}, "Escopo: " + p.escopo)`. `cardAcrescentado(id)` (`:517-546`): `+ "data-p53-sol-chave": id, "data-p53-sol-origem": "operador", "data-p53-sol-acao": "hipotese"`.

### 7.4 `ui_p52_support_v32.js` — papel

`papelHTML()` (`:794-834`): `if (!cards.length && !aviso) return "";` (`:799`) ganha `&& !vetos`; a linha do aviso (`:801-802`, âncora `D023-M6`) **intacta**; no `pr-card` (`:813-814`) entram os atributos `data-p53-sol-tier|chave|item|acao|origem` copiados do card; depois de `<b>nome</b>` (`:816`):

```js
var tierTxt = txt(c.querySelector(".p53-sol-tierlabel"));
if (tierTxt) h += '<div class="pr-mut p53-pr-tier">' + escHtml(tierTxt) + "</div>";
["p53-sol-variante", "p53-sol-acao", "p53-sol-elig"].forEach(function (k) { var n = c.querySelector("." + k); if (n) h += '<div class="pr-mut ' + k.replace("sol", "pr") + '">' + escHtml(txt(n)) + "</div>"; });
var esc = c.querySelector(".scope"); if (esc) h += '<div class="pr-mut p53-pr-escopo">' + escHtml(txt(esc)) + "</div>";
```

E, após o laço dos cards, o bloco de vetos lido de `sec.querySelector(":scope > [data-p53-vetos]")`.

### 7.5 `ui_curation_edit_v32.js`

`nomeDe(id)` (`:72-75`): consulta `b.oferta()` primeiro (`r.chave === id → r.nome`), senão `PRODUCTS[id].n`, senão `id`; `linhaProduto` (`:98-105`): quando o registro tem `variante`, `p53-cur-item-grp` recebe "variante: …" antes do grupo. `data-p53-cur-item` continua o nome exibido.

---

## 8 · Decisões que este desenho toma e que o PO/TL devem ratificar

| id | decisão tomada aqui | alternativa | por quê |
|---|---|---|---|
| D-1 | C2/C4: **sem card de aquisição**; veto visível com a nota do motor; a ação "operacionalizar/expandir" fica no card de capability (já existe nas duas superfícies, `ui_v32.js:636-640`, `#pr-support`) | card "FortiSIEM — operacionalizar" sem qualificador | o produto a operacionalizar é o **de terceiro**; um card Fortinet com essa ação afirma o que o motor negou. `hasSubstituteV32` já é verdadeiro por capability (`notes.length > 0`, `:752`), logo a Camada 1 segue oculta sem o card |
| D-2 | `LEGACY-LABELLED` **mantém** tier por `sev` (hipótese inteira) | "sempre após validação" (contrato do motor §7) | as 3 capabilities `landscapeEnabled:false` (`engine_v32.js:43-45`) são estruturalmente `LEGACY-LABELLED`: a alternativa rebaixa governança/time/competências em **toda** sessão com contexto, sem pedido; e cria terceiro regime entre legado e contexto. Risco de 35 gates cair por vácuo (inventário QA) |
| D-3 | C3: derivação `CONTEXT_NOT_INFORMED ∧ suppressedByPlatform().caps.has(cap)` → veto `plataforma` | status quo (FortiSOAR como hipótese) + backlog da lacuna de `classify` | usa só dado público do motor (`:500-521`, exportada `:816`) e aplica a leitura que o próprio motor faz no ramo NONE (`:576`); zero toque no engine. A refutação chamou isso de "terceiro decisor": é o ponto a ratificar |
| D-4 | item do motor sem linha: chave = id do motor, curável só para `exclude`; acréscimo humano só da Camada 1 | ampliar `PRODUCTS` (Porta B, `specs/019-curadoria-do-relatorio/spec.md:215-218`) ou rota (3) da lente data-engineer | fecha o `:142` ("fora do catalogo curavel") com critério; mantém `catalog()`, editor, fixtures e schema |
| D-5 | serviços do motor (por gap e por sinal) viram registros sob a linha pareada (SOCaaS, MDR, guarda-chuva com entregáveis) | só os que o MAP já oferece para a pergunta | a 026 supera a restrição da errata E2 da 022 por decisão do proprietário (C6/C7 pedem variante e serviço); os entregáveis nomeados são o que a auditoria §6.2 pede do guarda-chuva |
| D-6 | linha "Hipótese da avaliação — contexto não informado" visível no card em legado/`LEGACY-LABELLED` | só atributo | aceite do plano: "contexto ausente gera hipótese condicionada" tem de ser legível no papel |
| D-7 | vetos visíveis nas duas superfícies (classes com razão do motor) | só no contrato | é a "razão de supressão" do QS-01; sem ela, C7 vira silêncio sobre o MDR — exatamente o que a auditoria mediu |
| D-8 | nome do card = nome do item resolvido quando há um só `itemId` de produto (C1 "FortiEDR", C6 "FortiNDR (On-Premises)"); senão nome da linha | sempre nome da linha + sub-linha de variante | com o nome da linha, C1 continuaria a titular "FortiEndpoint — indicação prioritária": o produto vetado como título. E `#v32support` já diz "FortiEDR" — as duas leituras da mesma tela passam a nomear o mesmo item. Custo: reancorar `D019-CTX1 (a)` e `D025-UNS1` (§4.3) |

Residual declarado (não resolvido pela 026): `exclude` obsoleto sem sujeito no arquivo; "condições" de acréscimo humano (019 C1); lacuna `classify` × `suppressedByPlatform` no engine (Porta B futura); `FortiGuard-Service-Bundle` sem id único no motor (resolvido por pareamento de família, não por catálogo).
