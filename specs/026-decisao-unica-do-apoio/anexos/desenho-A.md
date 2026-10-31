# Desenho A — "apresentação mínima": contrato único de decisão de apoio dentro de `ui_p52_support_v32.js`

Demanda em abertura: **026 — contrato único de decisão de apoio**. Base: `develop @ 9509e4b`.
Lente `tech-lead`, somente leitura; este documento **propõe e não delega** (R5). Nenhum arquivo do
repositório foi tocado; toda afirmação cita `arquivo:linha` do HEAD atual ou uma medição já feita pelo
orquestrador (`scratchpad/out/C*.json`, relidas por `node resumo.js`).

O ângulo deste desenho é o que a tarefa fixa: **mínimo de diff** — a reconciliação MAP × motor nasce e
morre em `ui_p52_support_v32.js`; `ui_curation_v32.js` (`offered()`, `catalogo()`, `decidir()`,
`publicados()`), `ui_session_v32.js`, `SESSION_SCHEMA_V32.md`, `engine_v32.js` (frozen) e a Camada 1
(frozen) ficam com **zero linha**. A divergência que isso deixa — `__CURATION.offered()` continua
derivando do MAP enquanto a tela passa a obedecer ao motor — é **declarada, delimitada e pinada por
gate**, não escondida (§5.4).

---

## 0. O que este desenho aceita, em uma frase cada

1. **A chave curável continua sendo a linha de produto da Camada 1** (`Object.keys(PRODUCTS)`,
   `ui_curation_v32.js:88-91`). O motor resolve a *variante* (`fortiedr`, `fortindr-onprem`,
   `fortisiem-cloud`); a variante viaja como **atributo derivado do card e do papel**, nunca para a
   sessão. É a rota (4) da lente `data-engineer`, adotada aqui pela metade que cabe em um módulo só.
2. **`__CURATION.offered()` não muda.** Logo o editor de curadoria continuará listando, em
   "Oferecidos pela avaliação", linhas que a visão por produto **não apresenta** quando o motor as
   reconciliou (C2/C4/C7-MDR/C3). Esse é o custo nomeado do desenho A — a classe do `EA-76` fica
   **mitigada e declarada**, não resolvida. O `EA-76` permanece `aberto` com esta nota (§5.4, §4.5).
3. **O motor é a autoridade sob contexto declarado** — `specs/010-recomendacao-sem-vao/spec.md:461-462`
   ("sob contexto declarado a autoridade é o engine, e listar produto do catálogo congelado ali
   contradiria a leitura informada"). Sem contexto (modo legado) ou com a capability `UNSET`, a leitura
   é a **hipótese do mapa** (Camada 1), exatamente como hoje — decisão registrada (023 E1; C8 da
   refutação).
4. **Nada do que nasce aqui é estado.** O registro de decisão (§1) é função pura de
   `(computeFindings(), MAP, PRODUCTS, V32.buildRecommendationContext(), V32.suppressedByPlatform(),
   V32.serviceEligibility(), V32.archSatisfied(), __P50SUFF.contract(), __CURATION.decide())`,
   recalculada a cada passagem de `decorar()`, sem setter, sem serialização, sem cache entre renders —
   a mesma classe do `ofertaDoMotor()` de hoje (R9 §5: dono do estado não muda; renderização só consome).

---

## 1. O registro de decisão de apoio

### 1.1 Onde nasce e quem consome

| papel | módulo | função | observação |
|---|---|---|---|
| **nasce** (derivação, não estado) | `ui_p52_support_v32.js` (dono: `ui-engineer`) | `reconciliar()` — nova, inserida antes de `:247`; `ofertaDoMotor()` passa a ser `return reconciliar().produtos;` e ganha irmã `notasDoMotor()` | o literal `var produtos = ofertaDoMotor();` (`:721`, âncora `D019-M15`) **não muda** |
| consome — tela | `ui_p52_support_v32.js` | `cardDoProduto()` `:383-472`, `corpoDoCatalogo()` `:553-569`, `colocar()` `:644-680`, `decorar()` `:683-773` | atributos `data-p53-*` novos + linhas visíveis `.p53-sol-*` |
| consome — papel | `ui_p52_support_v32.js` | `papelHTML()` `:794-834`, via `__P53SOL.printHTML` (`:863`) → `buildPrintReport` (`ui_v32.js:1566`) | derivado **dos cards da tela**, como hoje (`D019-PAR1` por construção) |
| consome — curadoria | `ui_curation_edit_v32.js` | **zero linha no desenho A** (W3 opcional, §4.2) | o editor segue lendo `offered()/catalog()/decide()` do `__CURATION` e `grupos()/grupoDe()` do `__P53SOL` |
| **não consome** | `ui_curation_v32.js`, `ui_session_v32.js`, `engine_v32.js` | — | o registro nunca entra em `__CURATION`, nunca é serializado (INV-8), nunca toca o engine (R6) |

### 1.2 Shape — nomes em PT-BR; campos do engine com o nome do engine

```js
/* um registro por LINHA DE PRODUTO da Camada 1 (ou por itemId sem par, status quo) */
{
  chave:     "FortiEndpoint",         // chave de PRODUCTS = chave de curadoria; null quando o item não tem par (status quo :142/:139)
  nome:      "FortiEndpoint",         // PRODUCTS[chave].n — vai em data-p53-sol-produto (identidade de apresentação/curadoria; NÃO muda)
  titulo:    "FortiEDR",              // o que o <h4> mostra: OFFERINGS[itemId].name quando o motor resolveu UMA oferta/variante; senão == nome
  itemId:    "fortiedr",              // identidade estável do motor (offering|variant|family|service) — em legado, "map:" + chave
  itemIds:   ["fortiedr"],            // todos os ids do motor fundidos nesta linha (C10: ["fortisiem","fortisiem-cloud"])
  tipo:      "oferta",                // "oferta" | "servico" | "familia" | "hipotese"
  acao:      "avaliar-aquisicao",     // enum fechado: avaliar-aquisicao | apoio-contextual | servico | hipotese  (os únicos que viram CARD)
  tier:      1,                       // 1 = "indicação prioritária", 2 = "após validação" (TIER[], :240); nunca null num card do motor
  origem:    "gap",                   // "gap" | "sinal" | "operador"
  fontes:    [{ qid:"endpoint", lvl:0, sev:2, capId:"endpoint-detection" }],   // origem resposta/gap (maturity.stateSourceFindingIds ≡ MAP finding ids)
  caps:      ["Endpoint Detection and Response (EDR)"],   // texto EXIBIDO (aplicarCopy), como hoje — só as capabilities que JUSTIFICAM o card
  capIds:    ["endpoint-detection"],
  sinais:    [],                      // sigPT(...) dos requiredSignals ligados (origem "sinal")
  porque:    ["EPP + EDR em agente unificado"],           // MAP.lv[].c[].w — "Neste contexto:" (só Camada 1 tem)
  escopo:    ["camada endpoint"],     // scopeNote do motor (relation partial) ∪ MAP.lv[].c[].sn — deduplicado por texto
  variante:  { resolucao:"atende", nomes:["FortiEDR"], implantacao:["cloud","on-prem","air-gapped"], restricao:"SaaS não permitido; processamento local exigido" } | null,
  elegibilidade: { elegivel:true, razao:"base compatível" } | null,           // só tipo "servico" (serviceEligibility().reason literal)
  notas:     [],                      // ctx.notes literais que acompanham o card (ex.: contextual-support)
  prod:      null                     // nó .prod movido do renderer congelado, como hoje (:724)
}

/* uma NOTA por capability em que o motor decidiu NÃO haver aquisição — nunca vira card, nunca entra em published() */
{
  capId:     "endpoint-detection",
  capNome:   "Endpoint Detection and Response (EDR)",     // aplicarCopy(MAP[qid].cap) das fontes — mesmo vocabulário dos cards
  acao:      "operacionalizar",       // enum fechado: operacionalizar | expandir | validar | avaliar | plataforma
  texto:     "tecnologia operacional — apoio em operacionalização (nunca substituição)",   // ctx.notes literal do engine
  existente: ["CrowdStrike Falcon (production)"],         // TECH_LANDSCAPE[capId].solutions[].product/status (objeto exportado em :813)
  plataforma:"fortisoc" | null,       // suppressedByPlatform().plat.offeringId || plat.solution.product
  extensoes: [{ itemId:"fortixdr", nome:"FortiXDR", scopeNote:"extensão de correlação sobre a base EDR instalada — nunca nova aquisição standalone (M50)" }],
  vetos:     [{ itemId:"fortiguard-mdr", nome:"FortiGuard MDR", classe:"inelegivel", razao:"base declarada apenas em deployments não elegíveis (on-prem/air-gapped) — OG oficial" }],
  linhas:    ["FortiEndpoint"]        // linhas do MAP que esta nota substituiu (atributo para o gate; não vira texto visível)
}
```

Regra de ouro do shape: **todo valor vem de um dado que já existe** (enum do engine, literal de
`ctx.notes`, `serviceEligibility().reason`, `OFFERINGS[].name/deployment/url`, `MAP.w/sn`,
`PRODUCTS.n/d/u`). Os únicos literais novos são os rótulos de ação (§2.6) — texto de apresentação,
fora do payload M41, fora da sessão.

### 1.3 Pareamento id do motor → linha da Camada 1 (`linhaDe`), por critério

```js
var LINHA_DE_FAMILIA_DE_SERVICO = { "fortiguard-labs-advisory": "FortiGuard-Service-Bundle" };   /* único par sem nome em comum; precedente: PORTFOLIO (:78) */
function linhaDe(itemId) {
  var O = V32.OFFERINGS || {}, S = V32.SERVICES || {}, SF = V32.SERVICE_FAMILIES || {}, visto = {}, id = itemId, k;
  while (id && !visto[id]) {                                   /* 1) nome igual  2) cadeia variantOf */
    visto[id] = 1;
    var item = O[id] || S[id]; if (!item) return null;
    k = idDoNome(item.name); if (k) return k;                   /* idDoNome já existe (:114-121) */
    id = item.variantOf;
  }
  var fam = O[itemId] && O[itemId].family;                     /* 3) representante da família: offering (não variant/component), sem variantOf, que pareia por nome */
  if (fam) for (var oid in O) if (O[oid].family === fam && O[oid].entityType === "offering" && !O[oid].variantOf) { k = idDoNome(O[oid].name); if (k) return k; }
  for (var f in SF) if ((SF[f].members || []).indexOf(itemId) >= 0) return LINHA_DE_FAMILIA_DE_SERVICO[f] || null;   /* 4) serviço membro */
  return null;                                                 /* 5) sem par: incurável, como hoje */
}
```

Medido contra o catálogo (`engine_v32.js:86-249`): `fortiedr → FortiEndpoint` (3), `fortixdr → FortiXDR`
(1), `fortisiem-cloud → FortiSIEM` (2), `fortindr-onprem/-cloud → FortiNDR` (2: `variantOf:"ndr-family"`,
cujo `name` é "FortiNDR"), `endpoint-family → FortiEndpoint` (3), `fortiguard-socaas → SOCaaS` (1, pelo
`n`), `fortiguard-mdr → FortiGuard-MDR-Service` (1), `ir-*`/`ttx`/… → `FortiGuard-Service-Bundle` (4),
`fortisoc`/`fortimail*`/`fortiaigate`/`fortipam`/`fortiauthenticator`/`fortisat` → `null` (5, status quo).
A ordem de iteração de `OFFERINGS` **não decide nada**: o critério (3) exclui `fortixdr` (variant) e
`forticlient` (component) por tipo, não por posição.

---

## 2. Regras de reconciliação MAP × motor

### 2.1 Entrada

`ofertaDoMapa()` = o laço atual `:253-271`, intacto em forma, só enriquecido: por linha guarda
`fontes[{qid,lvl,sev,capId}]`, `porque[]` (`c.w`), `escopo[]` (`c.sn`). `capId` vem de
`V32.CAPABILITIES[*].questionIds` (`engine_v32.js:43-58`; o validador garante pergunta em uma
capability só, `:697`). `R = { legacy, contexts, sup: V32.suppressedByPlatform(), arq: V32.ARCHITECTURE_CONTEXT }`.

### 2.2 Portas de saída antes de qualquer reconciliação (hipótese do mapa = hoje)

| condição | resultado | por quê |
|---|---|---|
| `V32` ausente / `buildRecommendationContext()` lança | tudo hipótese, `console.error` | como `:338-344` hoje (R10 §2: nunca silêncio) |
| `R.legacy === true` (`isLegacyModeV32`, `engine_v32.js:305-311`) | tudo hipótese; **nenhuma nota, nenhum veto, nenhuma linha visível nova** | C8: decisão 023 E1; o engine se abstém (`contexts:{}`, `:552`) e a apresentação não inventa presença nem ausência (V10, `tests_010_vao.js:589`) |
| `__P50SUFF.contract().sufficient === false` | tudo hipótese | INV-3 pelo lado da apresentação: "o que não é publicável não desloca o que é" (023 E4, `ui_v32.js:732-740`); o editor de curadoria também não existe aqui (`ui_curation_edit_v32.js:62-65`). Lido do **bridge** (`ui_p50_suff_v32.js:74,:220`), não do DOM (R9 §3). Preserva `D010-F3`/`G15` (2 cards contíguos, `D010-ARB1 (c)`) |

### 2.3 Julgamento por capability (a tabela que a spec fixa)

Para cada linha do MAP e cada `capId` das suas `fontes`, `ctx = R.contexts[capId]`:

| `ctx.classification` | `supportMode` | veredito para a LINHA nesta capability | card? | tier | onde o texto nasce |
|---|---|---|---|---|---|
| `TECHNOLOGY_WHITESPACE` | `DIRECT` | `cands = ctx.candidates` com `itemKind ∈ {offering, family, family-of-variants}` e `linhaDe(itemId) === chave` → **`avaliar-aquisicao`** | sim | `maturity.state`: `gap-high`→1, `gap-moderate`→2; `family` placeholder → **2** forçado | `titulo` = `OFFERINGS[id].name` (1 oferta) · `nome` + `variante.nomes` (2+) · `nome` + `variantResolution` (placeholder); `escopo` += `scopeNote` (partial) |
| idem, sem candidato DIRECT da linha, com `contextual-support` da linha | `DIRECT`/`CONTEXTUAL` | **`apoio-contextual`** | sim | **2** | `notas` += `scopeNote` ("apoio contextual via relação de suporte — não é aquisição direta", `:641`) |
| idem, sem candidato da linha e `R.sup.caps.has(capId)` (`:573-577`) | `CONTEXTUAL` | **nota `plataforma`** | **não** | — | `ctx.notes[0]` literal + `R.sup.plat` |
| idem, sem candidato da linha, alguma oferta da linha com `V32.archSatisfied(OFFERINGS[id].architectureRequires) === "violated"` | `DIRECT` | **nota `validar` com `vetos[]` classe `veto-arquitetural`** | não | — | razão construída de `architectureRequires` × `R.arq` (o engine descarta em silêncio, `:448`) |
| `OPERATIONAL_GAP` / `COVERAGE_GAP` / `ADOPTION_GAP` | `CONTEXTUAL` | **nota `operacionalizar` / `expandir` / `operacionalizar`**; `contextual-extension` da linha → `extensoes[]`; `contextual-support` da linha → card `apoio-contextual` (tier 2) | não (exceto contextual-support) | — | `ctx.notes` literais (`:581-584`); `existente` de `TECH_LANDSCAPE[capId].solutions` |
| `EVALUATION_IN_PROGRESS` | `CONTEXTUAL` | nota `avaliar` | não | — | `ctx.notes[0]` (`:593`) |
| `TECH_STATUS_UNVERIFIED` / `NEEDS_VALIDATION` / `POSSIBLE_CONTEXT_DIVERGENCE` | `VALIDATE` | nota `validar` | não | — | `ctx.notes[0]` ou, vazio, "validar a tecnologia declarada desta capability" (`NEEDS_VALIDATION` por `UNKNOWN` é o único alcançável com finding; o por `null/"NA"` não gera finding — `computeFindings` `v3_1_3.html:526-527`) |
| `CONTEXT_NOT_INFORMED` | `LEGACY-LABELLED` | **hipótese do mapa** (card como hoje) — **exceto** `CONTEXTO_SUPRIMIDO_POR_PLATAFORMA && R.sup.caps.has(capId)` → nota `plataforma` (C3) | sim / não | sev do MAP (`f.sev===2 ? 1 : 2`, como `:256`) | linha visível `.p53-sol-acaolinha` "hipótese do mapa — contexto tecnológico desta capability não informado" **só quando `!R.legacy`** |
| `UNASSESSED_CAPABILITY` | `CONTEXTUAL` + `relation:"contextual-by-signal"` | **`apoio-contextual`, origem `sinal`** — o laço por sinal de hoje (`:291-337`), agora deduplicado por `itemId` e unido à linha via `linhaDe` | sim | **2** | como hoje; a âncora `D022-M10` sobrevive verbatim (§4.4) |
| `MATURE_WITH_TECH` / `TECH_TRANSITION` / `null` | `NONE` | n/a (sem gap ⇒ sem finding ⇒ sem linha) | — | — | defensivo: hipótese |

**Serviços** (linhas `SOCaaS`, `FortiGuard-MDR-Service`, `FortiGuard-Service-Bundle`; `tipoDaLinha(chave) === "servico"` quando algum `SERVICES[id]` pareia pela `linhaDe`), com precedência sobre a tabela:

| `ctx.services[]` da capability contém serviço da linha? | veredito | tier |
|---|---|---|
| sim (`triggeredBy` `["capability-gap"]` ou sinais) | **`servico`** — card; `elegibilidade = {elegivel:true, razao: s.note}` | `note === "elegível — validar deployment da base"` → **2** + linha `.p53-sol-elig`; senão por `maturity.state` |
| não, e `V32.serviceEligibility(sid).eligible === false` para todo serviço da linha nesta capability | **nota com `vetos[]` classe `inelegivel`** (C7-MDR) | — |
| não, elegível mas não disparado (relação `supporting` sem `gapTrigger`, `:187,:212,:216,:218`) | hipótese **só se** `CONTEXT_NOT_INFORMED` (as três capabilities `landscapeEnabled:false` caem sempre aqui, `:43-45`); senão nota `validar` | sev do MAP |

**Agregação por linha** (uma linha pode ter várias capabilities — `FortiEndpoint` em `endpoint` e
`vulnerability-management`; `FortiSOAR` em `knowledge`, `incident-response`, `automation`):

- a linha é **card** se **alguma** capability deu `avaliar-aquisicao | servico | apoio-contextual | hipotese`;
  `caps`/`capIds` = **só essas**; as demais viram notas (deduplicadas por `capId` entre linhas — C4:
  `FortiAnalyzer` e `FortiSIEM` apontam para `security-analytics` e geram **uma** nota);
- `acao` da linha = precedência `avaliar-aquisicao > servico > apoio-contextual > hipotese`;
  `tier` = mínimo entre as capabilities mantidas (regra do `buildTiers`, `:262`);
- **identidade**: registros chaveados por `chave`; sem par (`chave === null`), por `itemId`. O nome
  exibido **deixa de ser a chave de deduplicação** (o comentário `:317-323` passa a estar errado e é
  reescrito). `data-p53-sol-produto` continua carregando `nome` porque é o que TODOS os consumidores
  atuais leem (`D019-SOL1/SOL3/PROV1/PAR1/CARD1`, `D022-PROD1`, `D025-UNS1`, `acrescimos()` `:578`,
  `decisaoDe()` `:136`); a identidade estável do motor vai em `data-p53-sol-item-id`.

### 2.4 Os casos, um a um

| caso | motor (medido) | regra | resultado |
|---|---|---|---|
| **C1** endpoint NONE, `saasAllowed:"no"`, `localProcessingRequired:"yes"` | `TECHNOLOGY_WHITESPACE/DIRECT`, `candidates=[fortiedr/offering/atende]`; `archSatisfied(fortiendpoint)="violated"` | linha `FortiEndpoint` ← `linhaDe("fortiedr")` (critério 3) → `avaliar-aquisicao`, `titulo:"FortiEDR"`, `itemId:"fortiedr"`, tier 1 (`gap-high`), `variante.restricao` derivada de `architectureRequires.anyOf` × `ARCHITECTURE_CONTEXT` | card com `<h4>FortiEDR</h4>`, `data-p53-sol-produto="FortiEndpoint"` (curável), `data-p53-sol-item-id="fortiedr"`, "indicação prioritária", linha `.p53-sol-variante` "Oferta resolvida pelo contexto declarado: FortiEDR · implantação: cloud, on-prem, air-gapped · restrição: SaaS não permitido; processamento local exigido"; corpo `corpoDoMotor` (sem `.pt-desc` do FortiEndpoint — descrever o produto vetado seria mentir; link = `OFFERINGS.fortiedr.url`; ícone `ICONS_V32[ICON_MAP_V32.fortiedr]`, `ui_icons_v32.js:3`). O nome "FortiEndpoint" **não aparece** como texto folha (`D019-CARD1 (a)` conta só `>1`) |
| **C2** endpoint gap, EDR de terceiro em produção | `OPERATIONAL_GAP/CONTEXTUAL`, `candidates=[]`, nota "nunca substituição" | **sem card de aquisição**; nota `operacionalizar` com `existente:["<produto declarado> (production)"]` | seção: 0 cards, 1 nota `[data-p53-sol-nota="endpoint-detection"][data-p53-sol-acao="operacionalizar"]`; `published()` **ainda** contém `FortiEndpoint` (divergência declarada, §5.4) |
| **C3** automation gap, FortiSOC só em `soc-platform`, `security-automation` UNSET | `CONTEXT_NOT_INFORMED/LEGACY-LABELLED`; `sup.caps ∋ security-automation` | com `CONTEXTO_SUPRIMIDO_POR_PLATAFORMA = true` (decisão D-3, §4.6): nota `plataforma` "capability coberta pela plataforma declarada FortiSOC — foco em operacionalização/expansão, não em nova aquisição" | 0 cards, 1 nota. Mesma leitura que o engine faria no ramo NONE (`:576`), aplicada ao ramo UNSET pela apresentação; lacuna do engine registrada no backlog. **C3b** (FortiSOC declarado na própria capability → `OPERATIONAL_GAP` + M75) cai na regra de C2 sem decisão nova |
| **C4** logs gap, Sentinel em produção | `OPERATIONAL_GAP/CONTEXTUAL`, `candidates=[]` | duas linhas (`FortiAnalyzer`, `FortiSIEM`) → **uma** nota `operacionalizar` em `security-analytics` | 0 cards, 1 nota; `existente:["Microsoft Sentinel (production)"]` |
| **C5** legado, sessão de referência | `legacyMode=true` | porta de saída §2.2: tudo hipótese, **zero mudança visível na tela**; o papel passa a copiar tier e `.scope` | tela: 9 cards iguais a hoje; papel: 9 `pr-card` com `data-p53-sol-tier` + texto "indicação prioritária"/"após validação" e, no `FortiEndpoint`, "Escopo: cobre a camada de endpoint; demais componentes podem permanecer em plataformas especializadas." (copiado do `.prod .scope`, `v3_1_3.html:874`) |
| **C6** NDR NONE, `saasAllowed:"no"` | `DIRECT`, `candidates=[fortindr-onprem/atende]` | `linhaDe("fortindr-onprem")` → `FortiNDR` (critério 2); `titulo:"FortiNDR (On-Premises)"`, `itemId:"fortindr-onprem"` | card `<h4>FortiNDR (On-Premises)</h4>`, `data-p53-sol-produto="FortiNDR"`, variante nomeada. Reabre a errata E2 da 022 **só na forma** (nome da variante no card existente) — nenhum card novo entra; a E2 vetava *cards* a mais (`:297-301`). Decisão D-6 ao proprietário |
| **C7** staffing+monitoring gap alto, endpoint gap moderado, FortiEDR on-prem | `soc-staffing CONTEXT_NOT_INFORMED` + `socaas<capability-gap>`; `continuous-monitoring WHITESPACE/DIRECT` + `socaas`; `endpoint OPERATIONAL_GAP` + `fortixdr/contextual-extension`; `serviceEligibility("fortiguard-mdr") = {eligible:false, reason:"base declarada apenas em deployments não elegíveis (on-prem/air-gapped) — OG oficial"}` | `SOCaaS` → `servico`, tier 1 (controle positivo); `FortiGuard-MDR-Service` → nota com `vetos:[fortiguard-mdr/inelegivel]`; `FortiEndpoint` → nota `operacionalizar` em `endpoint-detection` com `extensoes:[fortixdr]` | 1 card (SOCaaS, "indicação prioritária", `elegibilidade.razao:"sem restrições"`); 2 notas: `continuous-monitoring`/`soc-staffing` com veto do MDR e razão literal; `endpoint-detection` com "Extensão contextual da base instalada: FortiXDR — extensão de correlação sobre a base EDR instalada — nunca nova aquisição standalone (M50)". `FortiXDR` **não vira card** porque `offered()` não o contém e `decide("FortiXDR")` seria `exclude` (`ui_curation_v32.js:164`) — virar card sem passar pelo porteiro recriaria a segunda direção do `EA-76` |
| **C8** legado sem contexto | `legacyMode=true` | hipótese | igual a hoje (`data-p53-sol-acao="hipotese"`, `data-p53-sol-origem="gap"`, sem linha visível nova) |
| **C9** sinal `dataLeakageConcern` | `UNASSESSED_CAPABILITY/CONTEXTUAL`, `fortidlp` em 2 capabilities | `apoio-contextual`, `origem:"sinal"`, tier 2, caps unidas | igual a hoje na tela (já OK); papel ganha "após validação" + `data-p53-sol-origem="sinal"` |
| **C10** whitespace `saasAllowed:"yes"` | `security-analytics` → `fortianalyzer, fortisiem, fortisiem-cloud`; `endpoint-detection` → `fortiendpoint` | `FortiSIEM` funde `fortisiem` + `fortisiem-cloud` (`linhaDe` 1 e 2): `titulo:"FortiSIEM"`, `variante.nomes:["FortiSIEM","FortiSIEM Cloud"]`, `data-p53-sol-variantes="fortisiem, fortisiem-cloud"` | 3 cards prioritários, `FortiSIEM` com linha "Variantes elegíveis neste contexto: FortiSIEM, FortiSIEM Cloud" — a variante Cloud **não vira card próprio** (E2 preservada) |

### 2.5 Curadoria e identidade

- **Produto retirado não volta**: `decisaoDe(produtos[i].nome)` (`:733`, âncora `D019-M5`) continua
  consultando pela **chave da linha** (`nome` → `idDoNome` → `PRODUCTS`). Em C1, `set("FortiEndpoint","exclude")`
  retira o card `FortiEDR` — na tela (`:733`) e no papel (derivado). A supressão **sobrevive** à correção
  da oferta, o que as rotas por id do motor não garantem (lente `data-engineer`, §5).
- **Acréscimo humano**: `acrescimos()`/`cardAcrescentado()` (`:517-583`) **não mudam**: card do catálogo,
  `[data-p53-prov="operador"]` na tela e no papel (`D019-PROV1`, mutante `D019-M4`), **sem tier, sem ação,
  sem capability** — ganha só `data-p53-sol-acao="operador"` e `data-p53-sol-origem="operador"`. As
  "condições" do item manual que a auditoria pede (§9.3) **não existem no estado** (019 C1: só ids e enum
  fechado) — refutação EXTRA; fica como decisão do proprietário, fora da 026.
- **Contagem de supressão**: `suprimidos = produtos.length - cards.length` (`:734`) passa a contar só
  exclusões do operador, porque `produtos` já não contém as linhas que o **motor** reconciliou. Veto do
  motor **nunca** usa `[data-p53-suprimido]` (`D025-AUS1 (b)`/`D025-NEW1` exigem `null` sem curadoria;
  `D023-PAP1` exige a mesma contagem nas duas superfícies) — usa `[data-p53-sol-nota]`/`[data-p53-sol-veto]`.
- **Chave estável**: dedup por `chave` (Camada 1) quando há par, por `itemId` quando não há; nunca por
  `nome` sozinho. Dois ids do motor na mesma linha → um card com `variantes` (C10); o mesmo produto com
  grafias diferentes (`FortiNDR` família × `FortiNDR (On-Premises)` variante) → um card, variante nomeada (C6).

### 2.6 Os únicos literais novos (apresentação; passam pelo `p52Copy` do papel sem colidir com `P52_COPY`, `ui_p52_workspace_v32.js:128-231` — conferido: nenhum contém "mandato", "charter" ou travessão de sistema)

| chave | texto visível |
|---|---|
| `ACAO_TXT.operacionalizar` | "Ação: operacionalizar o que já existe — nenhuma nova aquisição é indicada." |
| `ACAO_TXT.expandir` | "Ação: expandir a cobertura do que já existe — nenhuma nova aquisição é indicada." |
| `ACAO_TXT.validar` | "Ação: validar antes de qualquer leitura de aquisição." |
| `ACAO_TXT.avaliar` | "Ação: apoiar a avaliação em curso (critérios/PoC) — sem candidatos de aquisição." |
| `ACAO_TXT.plataforma` | "Ação: operacionalizar/expandir a plataforma declarada — nenhuma nova aquisição é indicada." |
| `HIPOTESE_TXT` | "Hipótese do mapa de apoio: o contexto tecnológico desta capability não foi informado; condicionada à validação do contexto." |
| `VARIANTE_TXT` | "Oferta resolvida pelo contexto declarado: " / "Variantes elegíveis neste contexto: " / "Modalidade a definir no aprofundamento: " |
| `VETO_TXT` | "Não indicado nesta leitura: " + nome + " — " + razão literal do engine |
| `EXT_TXT` | "Extensão contextual da base instalada: " + nome + " — " + scopeNote literal |

Os rótulos de tier ("indicação prioritária"/"após validação") **não mudam** e continuam nascendo em um só
lugar (`chipDoGrupo`, `:379-380`); o papel **copia** o texto do `.p53-sol-tierlabel` da tela.

---

## 3. O papel (`papelHTML`, `:794-834`)

O `pr-card` passa a carregar, **lido do card da tela** (derivação, nunca recálculo — `D019-PAR1` continua
verdade por construção):

| o quê | de onde na tela | como sai no papel |
|---|---|---|
| qualificador | `data-p53-sol-tier` + `txt(.p53-sol-tierlabel)` | atributo `data-p53-sol-tier` no `pr-card` + `<div class="pr-mut p53-pr-tier">indicação prioritária</div>` (QS-02; C5: 9/9) |
| ação / origem / identidade | `data-p53-sol-acao`, `data-p53-sol-origem`, `data-p53-sol-item-id`, `data-p53-sol-variantes` | mesmos atributos no `pr-card` |
| título | `txt(h4)` | `<b>` passa a ser o **título resolvido** ("FortiEDR"); `data-p53-sol-produto` continua = linha (`D019-PAR1` compara o atributo) |
| variante | `txt(.p53-sol-variante)` | `<div class="pr-mut p53-pr-variante">` |
| elegibilidade (serviço) | `txt(.p53-sol-elig)` | `<div class="pr-mut p53-pr-elig">` |
| escopo | `txt(.prod .scope)` (movido ou montado) | `<div class="pr-mut p53-pr-escopo">Escopo: …</div>` (QS-02, parte "camada endpoint") |
| hipótese (contexto parcial) | `txt(.p53-sol-acaolinha)` | `<div class="pr-mut p53-pr-acao">` |
| proveniência | `[data-p53-prov]` | **inalterado** (`:819-820`, âncora `D019-M4`) |
| sinais, descrição, capabilities | inalterados (`:812-830`) | — |
| notas de capability | `:scope > [data-p53-sol-nota]` da seção | depois dos cards: `<div class="pr-mut p53-pr-nota" data-p53-sol-nota="<capId>" data-p53-sol-acao="…" [data-p53-sol-extensao] [data-p53-sol-veto]><b>capNome</b> texto · existente · extensões · vetos</div>` — **não** é `.pr-card` nem carrega `data-p53-sol-produto` (contagens de `D023-PAP1`/`D010-PAPEL1` intactas) |
| guarda de seção vazia | `:799` | `if (!cards.length && !aviso && !notas.length) return "";` — C2 imprime a seção só com a nota |

Ordem pinada do relatório (`tests_010_vao.js:328-338`, `tests_p50_core.js:4278-4294`) não muda: a
seção continua `#pr-sup-solucao`, `h2` "Formas de apoio, por produto", opcional.

---

## 4. Arquivos, waves, gates

### 4.1 Arquivos tocados (estimativa)

| arquivo | dono | linhas (±) | o quê |
|---|---|---|---|
| `ui_p52_support_v32.js` | `ui-engineer` | **+250 / −40** (872 → ≈1.080; já acima do orçamento R9 §7 — justificativa no `plan.md`: uma responsabilidade, "apresentação por produto", e a alternativa — módulo novo + bridge novo — contraria o ângulo A) | `linhaDe`, `tipoDaLinha`, `ofertaDoMapa`, `julgarLinha`, `reconciliar`, `notasDoMotor`, `corpoDoMotor`, `notaDeCapability`; alterações em `ofertaDoMotor`, `cardDoProduto`, `corpoDoCatalogo`, `colocar`, `decorar`, `papelHTML`; comentários `:213-239`, `:272-290`, `:317-323` reescritos |
| `ui_p52_support_v32.css` | `ui-engineer` (mesma delegação) | +35 | `.p53-sol-variante`, `.p53-sol-elig`, `.p53-sol-acaolinha`, `.p53-sol-nota`, `.p53-sol-nota-t`, `.p53-sol-veto`, `.p53-sol-ext`, `.p53-pr-*` (print); só prefixo próprio, sem hex, sem `#v32-print-report` |
| `tests_026_decisao_apoio.js` (novo) | `qa-engineer` | ≈ 420 | 4 gates (§4.3), fixtures C1/C2/C3/C4/C5/C6/C7/C9/C10/F1-like inline (dados sintéticos; mesma mecânica do `boot()` de `tests_019_curadoria.js:96-120` + landscape/arch/sinais como `probe026.js:33-39`) |
| `tests_026_mutants.js` (novo) | `qa-engineer` | ≈ 160 | 9 mutantes (§4.4), runner no padrão de `tests_019_mutants.js` |
| `.claude/verify/expected_suites.json` | `qa-engineer` | +1 chave `d026` (`pass: 4, fail: 0`) | R10 §3, mesmo PR |
| `.claude/verify/mutation_map.json` | `qa-engineer` | +1 harness `d026` (`targets`: `ui_p52_support_v32.js`, `ui_p52_support_v32.css`, `tests_026_*.js`, `ui_curation_v32.js`, `ui_v32.js`; `insumos.oraculo: tests_026_decisao_apoio.js`) | gatilho por path |
| `quickscan_secops_soccmm_v3_2_dev.html` | `build-engineer` | gerado | `build_v32_html.py` (classe `generated`, R6) |
| `.claude/verify/pins.json` | `build-engineer` | gerado | `gen_pins.py` no mesmo PR, motivo no commit (R8) — os dois arquivos do módulo estão pinados |
| `.claude/BACKLOG.md` | `doc-writer`/`product-owner` | +3 entradas | `EA-76` nota de mitigação; lacuna do engine "`sup.caps` não consultada em `CONTEXT_NOT_INFORMED`" (Porta B futura); residual do editor (§5.4) |
| `.claude/rules/design-decisions.md` | `product-owner` | +2 candidatas | D-1 (sem card em operacionalizar) e D-2 (veto visível) após ratificação |
| `ui_curation_edit_v32.js` | `ui-engineer` | **0 no desenho A** (W3 opcional: +12) | ver §4.2 |
| `ui_curation_v32.js`, `ui_session_v32.js`, `SESSION_SCHEMA_V32.md`, `engine_v32.js`, `quickscan_secops_soccmm_v3_1_3.html` | — | **0** | — |

### 4.2 Waves (um módulo por delegação; dependência real dita a ordem)

| wave | agente | módulo | entrega | portão |
|---|---|---|---|---|
| **W1** | `qa-engineer` | `tests_026_decisao_apoio.js`, `tests_026_mutants.js`, `expected_suites.json`, `mutation_map.json` | 4 gates + 9 mutantes; **RED provado e commitado** no HEAD (C1/C2/C4/C6/C7 falham por construção; C5 falha no papel; C3 falha com o switch) | red commitado (R3 §4) |
| **W2** | `ui-engineer` | `ui_p52_support_v32.js` + `ui_p52_support_v32.css` | reconciliação, card, notas, papel (§anexo) | `node tests_026_decisao_apoio.js` 4/4; `run.sh` **e** `compliance-audit.sh` (memória: os dois comandos); d019/d022/d023/d025 verdes; campanha d026 + d019/d022/d023 re-rodadas por gatilho (`mutation_map.json:396-497`) — **uma campanha por vez** (memória) |
| **W3 (opcional, decisão D-5)** | `ui-engineer` | `ui_curation_edit_v32.js` | subtítulo por item lido do bridge `__P53SOL.decisoes()` (getter read-only, registrado em `bridges.json`): "apresentado como FortiEDR" / "não apresentado — ação: operacionalizar" | só se o PO não aceitar o residual §5.4 |
| **W4** | `build-engineer` | build + `gen_pins.py` + CI (`verify`, `visual`, `fecho`) | medir `playwright P8` (12 páginas, `tests_visual/print.spec.js:100`) e `P52-PDF5/6`; divergência = **repin de BASELINE declarado**, nunca afrouxamento | CI verde |
| **W5** | `doc-writer` + `product-owner` | `BACKLOG.md`, `design-decisions.md`, `relatorio-final.md` | trilha das decisões D-1..D-6; residuais | aceite de intenção (Fase 6) |

W1 não depende de W2 (gate antes de implementação); W4 depende de W2; W3 e W5 são independentes de W4.

### 4.3 Gates NOVOS mínimos (`D026-*`) — só os que, sem eles, o produto quebra em silêncio

Oráculo **independente do MAP**: as funções públicas do engine (`classify`, `resolveCandidates`,
`archSatisfied`, `serviceEligibility`, `suppressedByPlatform`, `engine_v32.js:811-817`), com a
pré-condição do engine **afirmada antes** (se o catálogo mudar, a alínea falha NOMEANDO, nunca por vácuo).

| gate | afirma | fixtures | alíneas | por que sem ele quebra em silêncio |
|---|---|---|---|---|
| **D026-MOT1** "sob contexto declarado a visão por produto obedece ao motor" | o card só existe para o que o motor resolveu, com a identidade do motor; o que o motor vetou/não ofereceu vira nota, nunca card | C1, C2, C4, C6, C7, C10 | (a) C1: pré `archSatisfied(fortiendpoint)==="violated"`; card `[data-p53-sol-item-id="fortiedr"]`, `h4` "FortiEDR", tier `prioritaria`, nenhum nó folha "FortiEndpoint"; (b) C2/C4: pré `supportMode==="CONTEXTUAL" && candidates.length===0`; zero `[data-p53-sol-produto]`; exatamente 1 `[data-p53-sol-nota="<capId>"][data-p53-sol-acao="operacionalizar"]`; (c) C6: item-id `fortindr-onprem`, `h4` "FortiNDR (On-Premises)"; (d) C7: pré `serviceEligibility("fortiguard-mdr").eligible===false`; sem card "FortiGuard MDR"; `[data-p53-sol-veto="fortiguard-mdr"]` com `txt` contendo a `reason` literal; card SOCaaS `prioritaria` (controle positivo); nota `endpoint-detection` com `[data-p53-sol-extensao="fortixdr"]`; (e) C10: `FortiSIEM` com `data-p53-sol-variantes="fortisiem, fortisiem-cloud"`, sem card "FortiSIEM Cloud" | é o QS-01: hoje passa tudo verde com o card contradizendo o motor |
| **D026-HIP1** "sem contexto é hipótese, e nada é inventado" | legado = mapa intacto; capability UNSET = hipótese rotulada; plataforma declarada cobre | C8, C3, F1-like (`saasAllowed:"yes"`, nível 1) | (a) C8: card `FortiEndpoint` `acao="hipotese"`, tier `prioritaria`, **zero** `[data-p53-sol-nota]`, **zero** `.p53-sol-acaolinha` visível, `data-p53-sol-item-id="map:FortiEndpoint"`; (b) C3: pré `suppressedByPlatform().caps.has("security-automation")`; sem card `FortiSOAR`; nota `[data-p53-sol-nota="security-automation"][data-p53-sol-acao="plataforma"]` com `txt` contendo "FortiSOC"; (c) F1-like: todo card `acao="hipotese"` com `.p53-sol-acaolinha`, zero notas, `cards.length === offered().length` | V10 (`tests_010_vao.js:589`, "nenhum produto é inferido sem contexto") protege a Camada 1, não a visão por produto; a reconciliação poderia vazar para o legado sem que nada acusasse |
| **D026-PAP1** "o papel diz o que a tela diz: qualificador, ação, variante, escopo" | após `beforeprint`, cada `pr-card` carrega tier (atributo **e** texto), escopo quando a tela tem, variante quando a tela tem; notas chegam ao papel | C5, C1, C2, C7, C9 | (a) C5: 9 `pr-card`, todos com `data-p53-sol-tier` igual ao do card da tela e `.p53-pr-tier` ∈ {"indicação prioritária","após validação"} (7/2); `pr-card[FortiEndpoint]` contém "Escopo: cobre a camada de endpoint"; (b) C1: `<b>` "FortiEDR", `.p53-pr-variante`; (c) C2: `.p53-pr-nota[data-p53-sol-acao="operacionalizar"]`; (d) C7: `.p53-pr-nota [data-p53-sol-veto]`; (e) C9: "após validação" + `data-p53-sol-origem="sinal"` | é o QS-02: `D019-PAR1`/`D023-PAP1` comparam conjuntos, não conteúdo — o tier sumiu 9/9 sem máquina acusar |
| **D026-CUR1** "a curadoria age sobre a linha e sobrevive à variante" | excluir a linha retira o card resolvido, nas duas superfícies; acréscimo mantém marcador; veto do motor não é supressão do operador | C1, C2 | (a) C1 `set("FortiEndpoint","exclude")` → sem `[data-p53-sol-item-id="fortiedr"]` na tela e no papel; `[data-p53-suprimido="1"]` nas duas; `unset` → card volta; (b) C1 `set("FortiDeceptor","include")` → card com `[data-p53-prov]` tela+papel, `data-p53-sol-acao="operador"`, sem `data-p53-sol-tier`; (c) C2 `set("FortiEndpoint","exclude")` → nota continua, **`[data-p53-suprimido]` ausente** (pina a divergência declarada §5.4: excluir linha não apresentada é no-op visível) | a identidade deixa de ser o nome; sem gate, o `decisaoDe(titulo)` passaria em todos os gates de 019 (fixtures legadas) e "produto retirado volta" com outro nome |

Se o proprietário quiser **três** gates, `D026-HIP1` cabe como alíneas (f)/(g)/(h) de `D026-MOT1` sem
perder ataque de mutante.

### 4.4 Mutantes (um por propriedade; âncoras em código que o W2 escreve, nunca em comentário)

| id | gate | ataque | `find` (literal previsto no anexo) |
|---|---|---|---|
| D026-M1 | MOT1 (a) | título volta a ser a linha do mapa — a variante vetada reaparece | `titulo: nomeDoMotor(unica)` → `titulo: linha.nome` |
| D026-M2 | HIP1 (b) | ignorar `suppressedByPlatform` no ramo UNSET | `if (CONTEXTO_SUPRIMIDO_POR_PLATAFORMA && R.sup.caps.has(capId))` → `if (false && …)` |
| D026-M3 | MOT1 (b) | gap operacional volta a virar card do mapa | `case "OPERATIONAL_GAP": case "COVERAGE_GAP": case "ADOPTION_GAP": return naoAquisicao(` → `… return hipotese(` |
| D026-M4 | MOT1 (d) | serviço inelegível entra como hipótese | `if (!el.eligible) return veto("inelegivel", el.reason);` → `if (false) …` |
| D026-M5 | HIP1 (a) | a linha de hipótese aparece também em legado (mudança visível que ninguém pediu) | `if (!R.legacy) linha.hipoteseVisivel = true;` → `if (true) …` |
| D026-M6 | PAP1 (a) | tier só na tela — o modo real de divergir (`EA-58`, padrão do `D019-M4`) | `h += '<div class="pr-mut p53-pr-tier">'` → `if (false) h += …` |
| D026-M7 | PAP1 (a) | escopo não viaja ao papel | `var esc = c.querySelector(".prod .scope");` → `var esc = null;` |
| D026-M8 | PAP1 (c)/(d) | notas não viajam ao papel | `notasNoPapel(sec)` → `""` |
| D026-M9 | CUR1 (a) | curadoria consulta o título resolvido, não a linha | `decisaoDe(produtos[i].nome)` → `decisaoDe(produtos[i].titulo)` (mesma linha do `D019-M5`; dois mutantes sobre a mesma âncora, campanhas separadas) |

**Âncoras existentes que o W2 preserva verbatim** (memória: *rename apodrece âncora de mutante*):
`D019-M4` `<div class="pr-mut" data-p53-prov="operador">`; `D019-M5` `if (decisaoDe(produtos[i].nome) !== "exclude") cards.push(cardDoProduto(produtos[i]));`;
`D019-M7` `"data-p53-sol-grupo-nome": grupo`; `D019-M9` `"data-p53-suprimido": String(suprimidos)`; `D019-M13`
`nomeDuplicado.parentNode.removeChild(nomeDuplicado);`; `D019-M14` `linha.appendChild(tile);`; `D019-M15` `var produtos = ofertaDoMotor();`;
`D019-M16` `"data-p53-sol-tier": TIER[p.tier] || TIER[2]`; `D019-M17` `var arbitrando = arbitragemEmCurso();`; `D019-M18`/`D023-M2`
`if (arbitrando && cards.length) sec.appendChild(fronteira());`; `D023-M6` `    if (aviso) h += '<div class="pr-mut" data-p53-suprimido="' +`;
`D022-M10` `            if (capNome && reg2.caps.indexOf(capNome) < 0) reg2.caps.push(capNome);` — **com os 12 espaços**: o laço por sinal
muda de função mas mantém a profundidade de indentação e o nome `reg2`. Conferência obrigatória no W2: `node tests_019_mutants.js --preflight`
(ou equivalente) com `ocorrencias=1` em todas.

### 4.5 Gates existentes: o que acontece com cada um

Medido pela lente `qa-engineer` (`scratchpad/qa-inventario`): **nenhuma fixture de suíte reproduz C1/C2/C4/C6/C7**;
todas vivem em legado ou em `CONTEXT_NOT_INFORMED` (saas-only), ou em whitespace `DIRECT` resolvido (G2/G4/G5/G8/G10/G12/G14).
Com as regras §2.2-2.3, **essas fixtures produzem exatamente os cards de hoje** (hipótese ou aquisição da mesma linha).

| gate(s) | classe | decisão |
|---|---|---|
| `D019-SOL1`, `D019-SOL3 (a)(b)(c)`, `D019-MED1` (`OFERTA_DO_MOTOR`), `D019-PROV1 (c)`, `D019-CARD1`, `D019-VAZ1`, `D019-PAR1`, `D019-CUR1/CUR2/INV8/SUF1/PRT1` | **não afeta** (fixtures legadas; `data-p53-sol-produto` inalterado; `offered()` inalterado) | W1 acrescenta **um comentário** em `D019-SOL1`/`SOL3 (b)`/`MED1`: "oráculo `computeFindings()+MAP` vale só em modo legado; com contexto declarado o oráculo é o motor (`D026-MOT1`)". Reancoragem com trilha, sem mudar asserção |
| `D019-CTX1` (G4: `security-analytics`/`soc-platform` NONE, saas yes) | não afeta | `security-analytics` → `DIRECT` resolve `fortianalyzer`,`fortisiem`,`fortisiem-cloud` → cards `FortiAnalyzer`,`FortiSIEM` (linhas); demais capabilities UNSET → hipótese; `offered() ⊆ cards` ✓ |
| `D022-PROD1` (G5s: sinais) | não afeta | `FortiDLP` por sinal, 2 caps unidas (`D022-M10` preservado) |
| `D023-OCU1/REG1/SUP1/ARB1/SUJ1/PAP1/DOM1/LEG1` (F1 saas-only; F2 endpoint NONE) | não afeta | F2: `endpoint-detection` → `DIRECT` `fortiendpoint` (saas yes) **ou** placeholder `endpoint-family` (arquitetura unknown) → card `FortiEndpoint` (`linhaDe` 1 ou 3); `cards == published()` ✓ nessas fixtures |
| `D025-*` (G1 legado, G2 contexto NONE) | não afeta | `D025-UNS1` acha o card por `PRODUCTS[off[0]].n` = `data-p53-sol-produto` ✓ |
| `D010-*` (oráculo declarado `substituto`), `D015-*`, `U1/U7`, `P52-ICON3/t2`, `P52-LAY4/LAY5`, `P52-REC1g` | não afeta | `published()` **não muda**; F3 (gate fechado) bypass §2.2; idempotência do ramo `else` preservada (notas reemitidas por remoção+inserção) |
| `S4-S5`, `S30-S32`, `S37`, `S69` | não afeta | nada novo viaja na sessão |
| `playwright P8` (12 páginas), `P52-PDF5/6` | **incerto** — medir no CI (W4) | mudança = repin declarado de BASELINE (R10 §1), nunca afrouxamento |
| **oráculo declarado de outra demanda** que a 026 **não** pode tocar | — | `D010_DECLARED.substituto` (`fixtures_010_vao.js:819+`), `V10`/`D010-INV7`, `D019-MED1` (payload M41 byte-idêntico), `D015-TIT1` (eyebrow ratificado). Nenhum é atingido porque `published()`, a Camada 1 e o engine ficam intactos. Se o W4 medir queda em qualquer um deles → **parar e escalar**, não reancorar |

### 4.6 Decisões que o desenho toma e o proprietário ratifica (R13: registrar, não "corrigir de passagem")

| id | decisão tomada aqui | alternativa | por que esta |
|---|---|---|---|
| **D-1** | C2/C4: **sem card de aquisição**; nota de ação por capability | card da linha com `acao="operacionalizar"` e sem tier | o card nomeia um produto que o motor não ofereceu — é a presença introduzida pelo mapa que `010 spec.md:461-462` veta; a nota responde "o que existe, qual ação, o que falta validar" (Auditoria §6.3) sem nome de produto |
| **D-2** | veto de serviço inelegível **aparece** como nota com a razão literal (C7-MDR) | não aparece | a ausência silenciosa é a classe de `fail-open` que a auditoria cobra; o facilitador precisa ler por que o MDR não está lá. Oferta vetada por arquitetura **com** variante resolvida (C1) não ganha nota — a linha de variante já explica |
| **D-3** | C3: `CONTEXTO_SUPRIMIDO_POR_PLATAFORMA = true` — `CONTEXT_NOT_INFORMED` + `sup.caps.has` → nota `plataforma` | `false` → hipótese (tela de hoje) | mesma regra que o engine aplica no ramo NONE (`:576`), com dado público do engine (`suppressedByPlatform`, `:816`); um flag de uma linha, pinado por `D026-HIP1 (b)`; lacuna do engine vai ao backlog como Porta B futura |
| **D-4** | capability UNSET com contexto parcial: tier do mapa (prioritária permitida) + linha visível "hipótese" | sempre "após validação" (proposta da lente `core-engineer`, §7) | consistência: declarar contexto para a capability A não pode rebaixar o rótulo de B; é o mesmo estado que o legado tem para todas — rotulado, não rebaixado |
| **D-5** | residual do editor (§5.4) aceito no desenho A | W3 (+12 linhas, bridge getter) | mínimo de diff; o residual fica pinado por `D026-CUR1 (c)` |
| **D-6** | C6/C10: variante **nomeada no card existente** (`titulo`, `variantes`) | manter "FortiNDR"/"FortiSIEM" sem variante (E2 literal) | a E2 vetou *cards a mais* (`:297-301`); nomear a variante no card que já existe é o que a auditoria §6.2 [F13] pede e o que `#v32support` já faz (`ui_v32.js:593-597`) |
| **D-7** | candidatos do motor **sem linha no MAP** (ex.: `fortiai-assist` `contextual-support` em `detection-engineering` sev 2) continuam **fora** | alargar | é exatamente a fronteira da E2; fica declarado como residual |

---

## 5. Invariantes, importação substitutiva, riscos, rollback

### 5.1 INV-1..INV-10

| inv | efeito | prova |
|---|---|---|
| INV-1 engine byte-idêntico | **nenhum toque**; `V32.*` só é lido; `TECH_LANDSCAPE`/`ARCHITECTURE_CONTEXT` só lidos (nunca escritos pela apresentação) | `D022-BND1`/`D023-BND1`, stage `boundary`; payload M41 não contém `ui_p52_support_v32.js` |
| INV-2 UNSET ≠ NONE | capability UNSET nunca vira gap tecnológico nem aquisição: é `hipotese` rotulada; legado não ganha nota/veto | `D026-HIP1` |
| INV-3 suficiência antes de qualquer score; UI nunca dona | gate fechado ⇒ reconciliação desligada (lida do `__P50SUFF.contract()`); a apresentação **não decide** — compõe decisões do engine e do operador | `D010-F3` intacto; `D019-SUF1` |
| INV-4/5/6 | nenhum caminho de score, target ou refinamento é lido ou escrito | `D022-INV1` (`legacySnapshot` byte-igual) |
| INV-7 narrativa determinística derivada de evidência | registro = função pura; textos = literais do engine + rótulos fixos; `fontes[]` nomeia a resposta de origem | `D025-INV8` (papel igual entre janelas) |
| INV-8 derivado nunca serializado | registro nunca entra em `__CURATION` nem em `captureCanonicalInputs`; nenhum `data-*` é lido de volta como decisão | `S4-S5`, `D019-INV8` |
| INV-9 boundary | `frozen`/`generated` intactos; HTML dev só pelo builder | stage `build` |
| INV-10 PT-BR / nomes exatos | rótulos novos em PT-BR; ids/enums do engine copiados literalmente | `compliance-audit` |

Invariantes do plano da auditoria (§2 "Invariantes obrigatórias" 1-10): 1,2,4,8 cobertas acima; 3
(prioridades fora dos cards) — `businessPriority` não é lido; 5 (sem autosave) — nada persiste; 6/7
(importação) — §5.2; 9 (não reduzir contagens/pins) — contagens só **sobem** (`d026`), pins por
`gen_pins.py`; 10 (sem dados reais) — fixtures sintéticas de `cen/*.json`.

### 5.2 Importação substitutiva da 025

`fromSession`/`validate`/`toSession`/snapshot/commit/rollback (`ui_curation_v32.js:199-263`,
`ui_session_v32.js:69-77, :239-244, :548, :619-637`) **não mudam**. Depois de importar, o render
recomputa a reconciliação sobre o engine já restaurado — o registro não tem ciclo de vida próprio. A
sessão A curada seguida de B importada/nova/reiniciada não contamina B porque nada deste desenho vive
fora do render (`D025-TRX1/TRX2/TRN1/TRN2` continuam medindo o mesmo objeto). Arquivos existentes
(inclusive `synthetic_session_examples/exemplo-completo.json`) seguem válidos com o **mesmo significado**:
`"FortiEndpoint":"exclude"` continua retirando o card da linha, qualquer que seja a variante resolvida.

### 5.3 Riscos

| risco | sinal | mitigação |
|---|---|---|
| paginação do PDF (P8 = 12; PDF5/6) | job `visual` | medir antes de concluir; repin declarado |
| `published() ≠ cards` em fixture **futura** com `OPERATIONAL_GAP`/veto | gate novo que reutilize o oráculo `cards == published()` | declarar no comentário de `D023-OCU1`/`REG1`: oráculo válido só quando o motor não reconcilia; `D026-CUR1 (c)` pina o comportamento |
| editor lista linha sem card (§5.4) | operador exclui e "nada acontece" | residual declarado; W3 opcional; `D026-CUR1 (c)` |
| módulo acima de 600 linhas (R9 §7) | `lint-arch` | justificativa no `plan.md`; split em `ui_p52_decisao_v32.js` é a rota B, não esta |
| `linhaDe` critério (3) depende de `entityType`/`variantOf` do catálogo | catálogo novo com família sem representante | cai em (5) = incurável, status quo; nunca inventa par |
| `ctx.notes` literal como texto visível | engine muda a frase | o texto é do engine por desenho (mesma coisa que `#v32support` faz, `ui_v32.js:639`) |
| `P52_COPY` reescrevendo texto novo no papel | tabela `:128-231` | rótulos conferidos contra a tabela; "capability" exibida já passa por `aplicarCopy` |

### 5.4 A divergência declarada do desenho A (o que a rota B resolveria)

`__CURATION.offered()` (`ui_curation_v32.js:96-152`) continua sendo MAP + sinal. Consequências, todas
**só com contexto declarado e só nas linhas que o motor reconciliou**:

1. o editor lista em "Oferecidos pela avaliação" uma linha que a tela não apresenta (C2/C4/C7-MDR/C3);
   excluí-la é no-op visível (pinado por `D026-CUR1 (c)`); incluí-la é no-op (já ofertada);
2. `published()` contém essa linha ⇒ `temProdutoPublicadoV32()` é `true` por ela — sem efeito prático
   hoje, porque nesses mesmos estados `porCapability` já é `true` (`ui_v32.js:748-753`: `CONTEXTUAL` com
   `notes` ⇒ `presentationOf === "card"`);
3. a contagem do aviso de supressão (`:734`) conta só exclusões efetivas sobre cards existentes.

Registro: `EA-76` ganha nota "mitigado pela 026 na direção tela→motor; a direção curadoria→motor
(fonte única em `__CURATION`) continua demanda futura (rota B)". É a diferença entre os dois desenhos
em uma linha: A move a verdade para a tela; B move a verdade para o dono do estado.

### 5.5 Rollback

Um PR, três grupos de arquivo (`ui_p52_support_v32.js` + `.css`; `tests_026_*` + registros; HTML gerado
+ `pins.json`). Reverter o PR devolve o HEAD atual byte a byte; não há migração de sessão, schema ou
dado — nenhum arquivo `.json` de sessão muda de forma nem de significado. O Docker em `127.0.0.1:1337`
continua servindo o HTML anterior até o deploy manual (`deploy/` fora do git; merge não é entrega).

---

## 6. Antes / depois — C1..C10

| caso | produto (card) | tier / qualificador | ação | tela | papel |
|---|---|---|---|---|---|
| **C1** | antes: `FortiEndpoint` · depois: linha `FortiEndpoint` com título **FortiEDR** (`item-id fortiedr`) | antes: prioritária · depois: prioritária (`gap-high`) | antes: — · depois: `avaliar-aquisicao`, variante "FortiEDR · cloud, on-prem, air-gapped · SaaS não permitido; processamento local exigido" | 1 card; nome "FortiEndpoint" não aparece como texto | `pr-card` `<b>FortiEDR</b>`, tier texto, variante |
| **C2** | antes: `FortiEndpoint` · depois: **nenhum** | antes: prioritária · depois: — | depois: nota `operacionalizar` ("tecnologia operacional — apoio em operacionalização (nunca substituição)"; existente: EDR declarado) | 0 cards, 1 nota | seção com a nota, sem `pr-card` |
| **C3** | antes: `FortiSOAR` · depois: **nenhum** (D-3) | antes: prioritária · depois: — | nota `plataforma` (FortiSOC cobre) | 0 cards, 1 nota | idem |
| **C4** | antes: `FortiAnalyzer`, `FortiSIEM` · depois: **nenhum** | antes: 2× prioritária · depois: — | 1 nota `operacionalizar` (Sentinel) | 0 cards, 1 nota | idem |
| **C5** | 9 cards (iguais) | tela: 7 validação / 2 prioritária (iguais) · **papel: antes 0/9, depois 9/9** | `hipotese` (atributo só; legado) | sem mudança visível | tier em 9/9; "Escopo: cobre a camada de endpoint…" no FortiEndpoint |
| **C6** | antes: `FortiNDR` · depois: linha `FortiNDR` com título **FortiNDR (On-Premises)** | prioritária (igual) | `avaliar-aquisicao`, variante nomeada | 1 card | idem + variante |
| **C7** | antes: `FortiEndpoint` (validação), `FortiGuard SOCaaS` (prio), `FortiGuard MDR` (prio) · depois: **só `FortiGuard SOCaaS`** | SOCaaS prioritária (igual, controle positivo) | SOCaaS `servico` ("sem restrições"); nota endpoint `operacionalizar` + extensão FortiXDR (M50); nota monitoring/staffing com veto MDR ("…OG oficial") | 1 card, 2 notas | 1 `pr-card` + 2 notas |
| **C8** | `FortiEndpoint` (igual) | prioritária (igual) | `hipotese` (atributo) | igual | tier texto |
| **C9** | `FortiDLP` (igual) | após validação (igual) | `apoio-contextual`, origem `sinal` | igual | + "após validação", `origem="sinal"` |
| **C10** | `FortiAnalyzer`, `FortiSIEM` (+ variantes `fortisiem, fortisiem-cloud`), `FortiEndpoint` (`fortiendpoint`) | 3× prioritária (igual) | `avaliar-aquisicao` | 3 cards, FortiSIEM com "Variantes elegíveis: FortiSIEM, FortiSIEM Cloud" | idem |

---

## Anexo — pseudo-código e pontos de inserção (`ui_p52_support_v32.js` @ `9509e4b`)

### A.1 Constantes (inserir após `:246`, antes de `ofertaDoMotor`)

```js
var CONTEXTO_SUPRIMIDO_POR_PLATAFORMA = true;             /* D-3; âncora D026-M2 na linha que o lê */
var KINDS_DIRECT = ["offering", "family", "family-of-variants"];
var ACAO_TXT = { operacionalizar: "…", expandir: "…", validar: "…", avaliar: "…", plataforma: "…" };   /* §2.6 */
var HIPOTESE_TXT = "…", VARIANTE_TXT = { atende: "Oferta resolvida pelo contexto declarado: ", varias: "Variantes elegíveis neste contexto: ", definir: "Modalidade a definir no aprofundamento: " };
var LINHA_DE_FAMILIA_DE_SERVICO = { "fortiguard-labs-advisory": "FortiGuard-Service-Bundle" };
function capDaPergunta(qid) { var C = V32.CAPABILITIES || {}; for (var id in C) if ((C[id].questionIds || []).indexOf(qid) >= 0) return id; return null; }
function suficienciaAberta() { try { var s = window.__P50SUFF && window.__P50SUFF.contract && window.__P50SUFF.contract(); return !s || s.sufficient !== false; } catch (e) { return true; } }
function nomeDoMotor(id) { var o = (V32.OFFERINGS || {})[id] || (V32.SERVICES || {})[id]; return (o && o.name) || id; }
function restricaoDe(req) { /* architectureRequires × V32.ARCHITECTURE_CONTEXT/SESSION_SIGNALS → frase: "SaaS não permitido; processamento local exigido" (só os pares satisfeitos; sem inventar) */ }
```

### A.2 `ofertaDoMapa()` — o laço `:253-271`, com `fontes/porque/escopo`

```js
function ofertaDoMapa() {
  var out = [], porChave = {};
  if (typeof computeFindings !== "function" || typeof MAP === "undefined" || typeof PRODUCTS === "undefined") return out;
  var fs; try { fs = (computeFindings() || {}).findings || []; } catch (e) { return out; }
  for (var i = 0; i < fs.length; i++) {
    var f = fs[i], m = MAP[f.id]; if (!m || !m.lv || !m.lv[f.lvl]) continue;
    var cands = m.lv[f.lvl].c || [], tier = (f.sev === 2) ? 1 : 2, capId = capDaPergunta(f.id);
    for (var j = 0; j < cands.length; j++) {
      var id = cands[j].p, p = PRODUCTS[id]; if (!p) continue;
      var reg = porChave[id];
      if (!reg) { reg = porChave[id] = { chave: id, nome: p.n, titulo: p.n, itemId: "map:" + id, itemIds: [], tipo: "hipotese", acao: "hipotese",
                  tier: tier, origem: "gap", fontes: [], caps: [], capIds: [], sinais: [], porque: [], escopo: [], variante: null, elegibilidade: null, notas: [], prod: null }; out.push(reg); }
      if (tier < reg.tier) reg.tier = tier;                                   /* menor vence, como no buildTiers */
      reg.fontes.push({ qid: f.id, lvl: f.lvl, sev: f.sev, capId: capId });
      var capExibida = m.cap ? aplicarCopy(m.cap) : "";
      if (capExibida && reg.caps.indexOf(capExibida) < 0) { reg.caps.push(capExibida); reg.capIds.push(capId); }
      if (cands[j].w && reg.porque.indexOf(cands[j].w) < 0) reg.porque.push(cands[j].w);
      if (cands[j].sn && reg.escopo.indexOf(cands[j].sn) < 0) reg.escopo.push(cands[j].sn);
    }
  }
  return out;
}
```

### A.3 `reconciliar()` — a função que decide; `ofertaDoMotor()`/`notasDoMotor()` são fachadas

```js
function reconciliar() {
  var base = ofertaDoMapa(), R = null;
  try {
    if (typeof V32 !== "undefined" && typeof V32.buildRecommendationContext === "function") {
      var ctx = V32.buildRecommendationContext() || {};
      R = { legacy: !!ctx.legacyMode, contexts: ctx.contexts || {}, sup: V32.suppressedByPlatform(), arq: V32.ARCHITECTURE_CONTEXT || {} };
    }
  } catch (e) { if (typeof console !== "undefined" && console.error) console.error("[026] contexto do motor nao lido:", e && e.message); }
  if (!R || R.legacy || !suficienciaAberta()) return { produtos: base, notas: [] };      /* §2.2 — hipótese do mapa, como hoje */

  var produtos = [], notas = [], notaPorCap = {};
  function nota(capId, acao, texto) { var n = notaPorCap[capId]; if (!n) { n = notaPorCap[capId] = { capId: capId, capNome: "", acao: acao, texto: texto, existente: existenteDe(capId), plataforma: null, extensoes: [], vetos: [], linhas: [] }; notas.push(n); } return n; }

  base.forEach(function (linha) {
    var mantidas = [];                                                        /* capabilities que JUSTIFICAM o card */
    linha.fontes.forEach(function (f) {
      var c = R.contexts[f.capId]; if (!c) { mantidas.push(f); return; }      /* defensivo: hipótese */
      var v = julgarLinha(linha, f, c, R);                                   /* {card:bool, acao, cands, svcs, nota:{acao,texto,plataforma}, extensoes, vetos, tier} */
      if (v.card) { mantidas.push(f); aplicarVeredito(linha, v, c); }
      else { var n = nota(f.capId, v.nota.acao, v.nota.texto); n.capNome = n.capNome || aplicarCopy(MAP[f.qid].cap); n.plataforma = v.nota.plataforma || n.plataforma;
             v.extensoes.forEach(function (x) { if (!n.extensoes.some(function (y) { return y.itemId === x.itemId; })) n.extensoes.push(x); });
             v.vetos.forEach(function (x) { if (!n.vetos.some(function (y) { return y.itemId === x.itemId; })) n.vetos.push(x); });
             if (n.linhas.indexOf(linha.nome) < 0) n.linhas.push(linha.nome); }
    });
    if (!mantidas.length) return;                                             /* a linha inteira virou nota(s) — não é card, não conta como suprimido */
    linha.caps = mantidas.map(function (f) { return aplicarCopy(MAP[f.qid].cap); }).filter(unico);
    linha.capIds = mantidas.map(function (f) { return f.capId; }).filter(unico);
    if (!R.legacy && linha.acao === "hipotese") linha.hipoteseVisivel = true; /* âncora D026-M5 — `if (!R.legacy)` */
    produtos.push(linha);
  });
  porSinal(produtos, R);                                                      /* o laço :291-337, chaveado por itemId + linhaDe; mantém `reg2` e a âncora D022-M10 */
  return { produtos: produtos, notas: notas };
}
function ofertaDoMotor() { return reconciliar().produtos; }                  /* `var produtos = ofertaDoMotor();` em :721 NÃO muda */
function notasDoMotor()  { return reconciliar().notas; }
```

### A.4 `julgarLinha(linha, f, c, R)` — a tabela §2.3 em código

```js
function julgarLinha(linha, f, c, R) {
  var capId = f.capId, chave = linha.chave;
  var hipotese     = function () { return { card: true, acao: "hipotese", tier: (f.sev === 2) ? 1 : 2, cands: [], svcs: [], extensoes: [], vetos: [] }; };
  var naoAquisicao = function (acao, texto, plat) { return { card: false, nota: { acao: acao, texto: texto, plataforma: plat || null }, extensoes: extensoesDe(c, chave), vetos: [] }; };
  var veto         = function (classe, itemId, razao) { var v = naoAquisicao("validar", ACAO_TXT.validar); v.vetos.push({ itemId: itemId, nome: nomeDoMotor(itemId), classe: classe, razao: razao }); return v; };
  var daLinha      = function (k) { return linhaDe(k.itemId || k.serviceId) === chave; };
  var tierMotor    = (c.maturity && c.maturity.state === "gap-high") ? 1 : 2;

  /* serviços têm precedência (linhas SOCaaS / MDR / Bundle) */
  if (tipoDaLinha(chave) === "servico") {
    var svcs = (c.services || []).filter(daLinha);
    if (svcs.length) return { card: true, acao: "servico", svcs: svcs, cands: [], extensoes: [], vetos: [],
                              tier: svcs.some(function (s) { return /^elegível — validar/.test(s.note || ""); }) ? 2 : tierMotor };
    var ids = servicosDaLinha(chave, capId), inel = ids.map(function (sid) { return { sid: sid, el: V32.serviceEligibility(sid) }; }).filter(function (x) { return !x.el.eligible; });
    if (ids.length && inel.length === ids.length) { var el = inel[0].el; if (!el.eligible) return veto("inelegivel", inel[0].sid, el.reason); }   /* âncora D026-M4 */
    if (c.classification === "CONTEXT_NOT_INFORMED") return hipotese();
    return naoAquisicao("validar", ACAO_TXT.validar);
  }
  var direct = (c.candidates || []).filter(function (k) { return KINDS_DIRECT.indexOf(k.itemKind) >= 0 && daLinha(k); });
  var apoio  = (c.candidates || []).filter(function (k) { return k.itemKind === "contextual-support" && daLinha(k); });
  switch (c.classification) {
    case "TECHNOLOGY_WHITESPACE":
      if (c.supportMode === "DIRECT" && direct.length) return { card: true, acao: "avaliar-aquisicao", cands: direct, svcs: [], extensoes: [], vetos: [],
                                                               tier: direct.some(function (k) { return k.itemKind !== "offering"; }) ? 2 : tierMotor };
      if (apoio.length) return { card: true, acao: "apoio-contextual", cands: apoio, svcs: [], extensoes: [], vetos: [], tier: 2 };
      if (R.sup.caps.has(capId)) return naoAquisicao("plataforma", (c.notes || [])[0] || ACAO_TXT.plataforma, R.sup.plat);
      var vetadas = ofertasDaLinha(chave, capId).filter(function (id) { return V32.archSatisfied((V32.OFFERINGS[id] || {}).architectureRequires) === "violated"; });
      if (vetadas.length) return veto("veto-arquitetural", vetadas[0], restricaoDe(V32.OFFERINGS[vetadas[0]].architectureRequires));
      return naoAquisicao("validar", ACAO_TXT.validar);
    case "OPERATIONAL_GAP": case "COVERAGE_GAP": case "ADOPTION_GAP":
      if (apoio.length) return { card: true, acao: "apoio-contextual", cands: apoio, svcs: [], extensoes: [], vetos: [], tier: 2 };
      return naoAquisicao(c.classification === "COVERAGE_GAP" ? "expandir" : "operacionalizar", (c.notes || []).join(" · "));   /* âncora D026-M3 */
    case "EVALUATION_IN_PROGRESS": return naoAquisicao("avaliar", (c.notes || [])[0] || ACAO_TXT.avaliar);
    case "TECH_STATUS_UNVERIFIED": case "NEEDS_VALIDATION": case "POSSIBLE_CONTEXT_DIVERGENCE":
      return naoAquisicao("validar", (c.notes || [])[0] || ACAO_TXT.validar);
    case "CONTEXT_NOT_INFORMED":
      if (CONTEXTO_SUPRIMIDO_POR_PLATAFORMA && R.sup.caps.has(capId)) return naoAquisicao("plataforma", ACAO_TXT.plataforma, R.sup.plat);   /* âncora D026-M2 */
      return hipotese();
    default: return hipotese();
  }
}
function extensoesDe(c, chave) {   /* contextual-extension (fortixdr) → nomeado na nota, nunca card (offered() não o contém) */
  return (c.candidates || []).filter(function (k) { return k.itemKind === "contextual-extension"; })
    .map(function (k) { return { itemId: k.itemId, nome: nomeDoMotor(k.itemId), scopeNote: k.scopeNote || "" }; });
}
function aplicarVeredito(linha, v, c) {
  if (v.acao === "avaliar-aquisicao" || v.acao === "apoio-contextual") {
    v.cands.forEach(function (k) { if (linha.itemIds.indexOf(k.itemId) < 0) linha.itemIds.push(k.itemId); if (k.scopeNote && linha.escopo.indexOf(k.scopeNote) < 0) linha.escopo.push(k.scopeNote); });
    var unica = v.cands.length === 1 && v.cands[0].itemKind === "offering" ? v.cands[0].itemId : null;
    linha.titulo = unica ? nomeDoMotor(unica) : linha.nome;                      /* âncora D026-M1 */
    linha.variante = varianteDe(v.cands);                                        /* {resolucao, nomes, implantacao, restricao} | null */
    linha.tipo = v.cands.some(function (k) { return k.itemKind !== "offering"; }) ? "familia" : "oferta";
  }
  if (v.acao === "servico") { v.svcs.forEach(function (s) { if (linha.itemIds.indexOf(s.serviceId) < 0) linha.itemIds.push(s.serviceId); });
    linha.tipo = "servico"; linha.elegibilidade = { elegivel: true, razao: v.svcs[0].note || "" }; }
  if (PRECEDENCIA[v.acao] < PRECEDENCIA[linha.acao]) linha.acao = v.acao;       /* avaliar-aquisicao < servico < apoio-contextual < hipotese */
  if (v.tier < linha.tier) linha.tier = v.tier;
  linha.itemId = linha.itemIds[0] || linha.itemId;
}
```

### A.5 Card (`cardDoProduto`, `:383-472`) — só acréscimos; âncoras intactas

```js
var card = el("div", {
  "class": "apoio-block p53-sol-card",
  "data-p53-sol-produto": p.nome,                 /* identidade de curadoria — NÃO muda */
  "data-p53-sol-grupo": grupo,
  "data-p53-sol-tier": TIER[p.tier] || TIER[2],   /* âncora D019-M16 — intacta */
  "data-qs22-sinais": …,                          /* como hoje */
  "data-p53-sol-item-id": p.itemId, "data-p53-sol-acao": p.acao, "data-p53-sol-origem": p.origem,
  "data-p53-sol-variantes": p.itemIds.length > 1 ? p.itemIds.join(", ") : ""
});
card.appendChild(chipDoGrupo(grupo, p.tier));
card.appendChild(el("h4", null, p.titulo));       /* :419 — era p.nome; CARD1 (a) conta só repetição (>1), e o título não repete `nome` quando difere */
/* proveniência :424-425 inalterada */
if (p.hipoteseVisivel) card.appendChild(el("div", { "class": "p53-sol-acaolinha", "data-p53-sol-acaolinha": "hipotese" }, HIPOTESE_TXT));
if (p.variante)       card.appendChild(el("div", { "class": "p53-sol-variante" }, textoDaVariante(p.variante)));
if (p.elegibilidade && /validar/i.test(p.elegibilidade.razao)) card.appendChild(el("div", { "class": "p53-sol-elig" }, "Elegibilidade técnica: " + p.elegibilidade.razao.replace(/^elegível — /, "")));
/* .why :426-428 inalterado; corpo: */
if (p.prod) { … :449-452 inalterado (D019-M13) … }
else corpo.appendChild(p.chave && (p.tipo === "hipotese" || p.titulo === p.nome) ? corpoDoCatalogo(p.chave, p.nome, p) : corpoDoMotor(p));
```

`corpoDoCatalogo(id, nome, reg)` (`:553-569`): mesmo `.prod`, mesmo `linha.appendChild(tile);` (âncora
`D019-M14`); com `reg`, o `.pt-desc` ganha " Neste contexto: " + `reg.porque.join("; ")` + "." e, se
`reg.escopo.length`, um `<div class="scope">Escopo: …</div>` — a **mesma marcação** que o renderer
congelado emite (`v3_1_3.html:873-874`), para que o papel leia um seletor só.
`corpoDoMotor(p)`: `.prod` com ícone `ICONS_V32[ICON_MAP_V32[p.itemId]]` (fallback `productIcon(p.chave)`),
sem `.pt-desc` (o motor não tem descrição; descrever a linha vetada seria mentir), `<div class="scope">`
se `p.escopo.length`, link `OFFERINGS[p.itemId].url` quando existir ("Página oficial ↗").

### A.6 Notas (`notaDeCapability`) e colocação (`colocar`, `:644-680`)

```js
function notaDeCapability(n) {
  var box = el("div", { "class": "p53-sol-nota", "data-p53-sol-nota": n.capId, "data-p53-sol-acao": n.acao, role: "note" });
  box.appendChild(el("div", { "class": "p53-sol-nota-t" }, n.capNome));
  box.appendChild(el("div", null, ACAO_TXT[n.acao] + (n.texto ? " " + n.texto : "")));
  if (n.existente.length) box.appendChild(el("div", null, "Tecnologia declarada: " + n.existente.join(", ")));
  if (n.plataforma)       box.appendChild(el("div", null, "Plataforma declarada: " + nomeDoMotor(n.plataforma.offeringId || (n.plataforma.solution || {}).product)));
  n.extensoes.forEach(function (x) { box.appendChild(el("div", { "class": "p53-sol-ext", "data-p53-sol-extensao": x.itemId }, EXT_TXT + x.nome + " — " + x.scopeNote)); });
  n.vetos.forEach(function (x)     { box.appendChild(el("div", { "class": "p53-sol-veto", "data-p53-sol-veto": x.itemId, "data-p53-sol-veto-classe": x.classe }, VETO_TXT + x.nome + " — " + x.razao)); });
  return box;
}
/* colocar(sec, cards, arbitrando, notas): depois do laço :675-679 */
var velhasNotas = sec.querySelectorAll(":scope > [data-p53-sol-nota]"); for (…) remove;
for (i = 0; i < notas.length; i++) sec.appendChild(notaDeCapability(notas[i]));
```

As notas entram **depois dos cards** e não têm classe de `CLASSES_CONTIGUAS` (`tests_010_vao.js:168`):
nunca ficam entre o título congelado e os blocos (`D010-ARB1 (c)`), nunca entram em `data-p52-support-cards`
(`:768-769` conta `.apoio-block`), nunca são `.apoio-block` (censos de `tests_010/023`, `P52-REC1g`).
Só existem com contexto declarado — modo em que a região congelada está oculta.

### A.7 `decorar()` (`:683-773`) — três linhas

```js
var produtos = ofertaDoMotor();                                   /* :721 — âncora D019-M15, intacta */
var notas = notasDoMotor();
if (!produtos.length && !notas.length) return;                     /* :722 — era `if (!produtos.length) return;` */
… /* :723-739 inalteradas (D019-M5 em :733) */
colocar(sec, cards, arbitrando, notas);                            /* :740 */
… /* ramo else :749-761: colocar(sec, atuais, arbitrando, notasDoMotor()); */
```

### A.8 `papelHTML()` (`:794-834`)

```js
var notasTela = sec.querySelectorAll(":scope > [data-p53-sol-nota]");
if (!cards.length && !aviso && !notasTela.length) return "";       /* :799 */
… /* :800-802 inalteradas (D023-M6) */
for (…) {
  var c = cards[i], nome = c.getAttribute("data-p53-sol-produto"), gid = …, sinais = …;
  var tier = c.getAttribute("data-p53-sol-tier") || "", tierTxt = txt(c.querySelector(".p53-sol-tierlabel"));
  h += '<div class="pr-card" data-p53-sol-produto="…" data-p53-sol-grupo="…"' + (sinais ? …: "")
     + (tier ? ' data-p53-sol-tier="' + escHtml(tier) + '"' : "")
     + atributo("data-p53-sol-item-id") + atributo("data-p53-sol-acao") + atributo("data-p53-sol-origem") + atributo("data-p53-sol-variantes") + '>';
  if (sinais) …;                                                    /* :815 inalterada */
  h += "<b>" + escHtml(txt(c.querySelector("h4")) || nome) + "</b>";      /* :816 — título resolvido */
  if (tierTxt) h += '<div class="pr-mut p53-pr-tier">' + escHtml(tierTxt) + "</div>";      /* âncora D026-M6 */
  … /* :819-820 inalteradas (D019-M4) */
  var hip = c.querySelector(".p53-sol-acaolinha"); if (hip) h += '<div class="pr-mut p53-pr-acao">' + escHtml(txt(hip)) + "</div>";
  var vr = c.querySelector(".p53-sol-variante");   if (vr)  h += '<div class="pr-mut p53-pr-variante">' + escHtml(txt(vr)) + "</div>";
  var elg = c.querySelector(".p53-sol-elig");      if (elg) h += '<div class="pr-mut p53-pr-elig">' + escHtml(txt(elg)) + "</div>";
  … /* :821-822 .pt-desc inalteradas */
  var esc = c.querySelector(".prod .scope");       if (esc) h += '<div class="pr-mut p53-pr-escopo">' + escHtml(txt(esc)) + "</div>";   /* âncora D026-M7 */
  … /* :823-831 caps inalteradas */
}
h += notasNoPapel(sec);                                             /* âncora D026-M8: `.pr-mut.p53-pr-nota` por [data-p53-sol-nota], copiando data-p53-sol-acao/-extensao/-veto e o texto */
return h + "</div>";
```

### A.9 O que fica **fora** deste módulo, de propósito

`__CURATION` (zero linha), `__P53CUR` (zero no A; W3 opcional), `engine_v32.js` (frozen), `PRODUCTS`/`MAP`
(frozen, payload M41), `ui_v32.js` (`buildPrintReport` já consome `printHTML`; `hasSubstituteV32` já lê
`published()`), `SESSION_SCHEMA_V32.md`, `exemplo-completo.json`.
